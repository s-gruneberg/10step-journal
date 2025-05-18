from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, QuestionSerializer, JournalEntrySerializer, UserQuestionsSerializer, StreakSerializer
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Question, JournalEntry, UserQuestions, Streak
from rest_framework.decorators import action
import logging
import pytz
from .constants import defaultQuestions, defaultCheckmarks

logger = logging.getLogger(__name__)

def home_view(request):
    return HttpResponse("Welcome to the 10 Step Journal API backend!")

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UserQuestionsViewSet(viewsets.ModelViewSet):
    serializer_class = UserQuestionsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserQuestions.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            # Return default questions if none exist
            return Response({
                'questions': defaultQuestions,
                'checkmarks': defaultCheckmarks,
                'created_at': timezone.now().isoformat(),
                'updated_at': timezone.now().isoformat()
            })
        instance = queryset.first()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_create(self, serializer):
        # Delete existing if exists
        UserQuestions.objects.filter(user=self.request.user).delete()
        serializer.save(user=self.request.user)

class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'date'  # Use date field for lookups instead of id

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Get user's timezone from request headers
        user_tz = request.headers.get('X-Timezone', 'UTC')
        try:
            # Validate the timezone
            user_timezone = pytz.timezone(user_tz)
        except pytz.exceptions.UnknownTimeZoneError:
            user_timezone = pytz.UTC

        try:
            # Convert the date to user's timezone for consistency
            date = request.data.get('date')
            if not date:
                return Response(
                    {"detail": "Date is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Parse the date in user's timezone
            date_obj = datetime.strptime(date, '%Y-%m-%d')
            date_obj = user_timezone.localize(date_obj)
            
            # Get the date range for the user's calendar day
            start_of_day = date_obj.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = start_of_day + timedelta(days=1)

            # Convert to UTC for database query
            utc_start = start_of_day.astimezone(pytz.UTC)
            utc_end = end_of_day.astimezone(pytz.UTC)

            # Check for existing entries in the user's calendar day
            existing_entry = JournalEntry.objects.filter(
                user=request.user,
                created_at__gte=utc_start,
                created_at__lt=utc_end
            ).first()

            if existing_entry:
                return Response(
                    {"detail": "You have already saved a journal entry for this date."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Store the date in UTC
            request.data['date'] = date_obj.astimezone(pytz.UTC).date().isoformat()
            return super().create(request, *args, **kwargs)

        except Exception as e:
            logger.error(f"Error creating journal entry: {str(e)}")
            return Response(
                {"detail": f"Failed to create journal entry: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_create(self, serializer):
        entry = serializer.save(user=self.request.user)
        self._update_streaks(entry)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()  # This will use lookup_field='date' automatically
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"detail": f"Failed to delete journal entry: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _update_streaks(self, entry):
        # Get user's timezone from the most recent request
        user_tz = self.request.headers.get('X-Timezone', 'UTC')
        try:
            user_timezone = pytz.timezone(user_tz)
        except pytz.exceptions.UnknownTimeZoneError:
            user_timezone = pytz.UTC

        # Convert entry date to user's timezone
        entry_date = timezone.localtime(
            timezone.make_aware(datetime.combine(entry.date, datetime.min.time())),
            timezone=user_timezone
        ).date()

        # Get yesterday in user's timezone
        yesterday = (timezone.now().astimezone(user_timezone) - timedelta(days=1)).date()

        # Update journal streak - only if this is the first entry of the day
        has_entry_today = JournalEntry.objects.filter(
            user=self.request.user,
            date=entry_date
        ).exists()

        if not has_entry_today:  # Only update streak for the first entry of the day
            self._update_single_streak('journal', 'journal', entry_date, yesterday, bool(any(entry.answers)))

        # Update checkmark streaks - only if this is the first entry of the day
        if not has_entry_today:
            for activity, is_checked in entry.checkmarks.items():
                if is_checked:
                    self._update_single_streak(activity, 'checkmark', entry_date, yesterday, True)

    def _update_single_streak(self, activity_type, streak_type, entry_date, yesterday, is_completed):
        streak, created = Streak.objects.get_or_create(
            user=self.request.user,
            activity_type=activity_type,
            streak_type=streak_type,
            defaults={'last_entry_date': entry_date}
        )

        if is_completed:
            if created or streak.last_entry_date == yesterday:
                streak.current_streak += 1
                streak.longest_streak = max(streak.longest_streak, streak.current_streak)
            elif streak.last_entry_date < yesterday:
                streak.current_streak = 1
            streak.last_entry_date = entry_date
            streak.save()
        elif streak.last_entry_date < yesterday:
            streak.current_streak = 0
            streak.save()

class StreakViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StreakSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Streak.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def current(self):
        """Get current streaks for all activities"""
        streaks = self.get_queryset()
        serializer = self.get_serializer(streaks, many=True)
        return Response(serializer.data)
