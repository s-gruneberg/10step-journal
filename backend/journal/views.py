from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, QuestionSerializer, UserQuestionsSerializer, StreakSerializer
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Question, UserQuestions, Streak
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

class StreakViewSet(viewsets.ModelViewSet):
    serializer_class = StreakSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Streak.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current streaks for all activities"""
        streaks = self.get_queryset()
        serializer = self.get_serializer(streaks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def update_streak(self, request):
        """Update streaks for a given date"""
        try:
            # Get user's timezone from request headers
            user_tz = request.headers.get('X-Timezone', 'UTC')
            try:
                user_timezone = pytz.timezone(user_tz)
            except pytz.exceptions.UnknownTimeZoneError:
                user_timezone = pytz.UTC

            # Parse the date
            date = request.data.get('date')
            if not date:
                return Response(
                    {"detail": "Date is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Convert to user's timezone
            date_obj = datetime.strptime(date, '%Y-%m-%d')
            date_obj = user_timezone.localize(date_obj)
            entry_date = date_obj.date()

            # Get yesterday in user's timezone
            yesterday = (timezone.now().astimezone(user_timezone) - timedelta(days=1)).date()

            # Check if an entry already exists for this date in user's timezone
            start_of_day = date_obj.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = start_of_day + timedelta(days=1)

            # Convert to UTC for database query
            utc_start = start_of_day.astimezone(pytz.UTC)
            utc_end = end_of_day.astimezone(pytz.UTC)

            # Get existing streak for this date
            existing_streak = Streak.objects.filter(
                user=request.user,
                last_entry_date=entry_date
            ).first()

            if existing_streak:
                return Response(
                    {"detail": "You have already made a journal entry for this date in your timezone."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update journal streak if there are answers
            answers_exist = any(request.data.get('answers', {}).values())
            if answers_exist:
                self._update_streak(
                    request.user,
                    'journal',
                    'journal',
                    entry_date,
                    yesterday,
                    True
                )

            # Update checkmark streaks
            checkmarks = request.data.get('checkmarks', {})
            for activity, is_checked in checkmarks.items():
                self._update_streak(
                    request.user,
                    activity,
                    'checkmark',
                    entry_date,
                    yesterday,
                    is_checked
                )

            # Get updated streaks
            streaks = self.get_queryset()
            serializer = self.get_serializer(streaks, many=True)
            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error updating streaks: {str(e)}")
            return Response(
                {"detail": f"Failed to update streaks: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _update_streak(self, user, activity_type, streak_type, entry_date, yesterday, is_completed):
        streak, created = Streak.objects.get_or_create(
            user=user,
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
