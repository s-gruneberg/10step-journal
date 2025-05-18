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

    def perform_create(self, serializer):
        # Delete existing if exists
        UserQuestions.objects.filter(user=self.request.user).delete()
        serializer.save(user=self.request.user)

class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Creating journal entry with data: {request.data}")
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error creating journal entry: {str(e)}")
            logger.exception(e)
            return Response(
                {"detail": f"Failed to create journal entry: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_create(self, serializer):
        try:
            # Update or create entry for today
            entry = serializer.save(user=self.request.user)
            self._update_streaks(entry)
        except Exception as e:
            logger.error(f"Error in perform_create: {str(e)}")
            logger.exception(e)
            raise

    def _update_streaks(self, entry):
        try:
            today = timezone.now().date()
            
            # Update journal streak
            self._update_single_streak('journal', 'journal', today, bool(any(entry.answers)))

            # Update checkmark streaks
            for activity, is_checked in entry.checkmarks.items():
                if is_checked:
                    self._update_single_streak(activity, 'checkmark', today, True)
        except Exception as e:
            logger.error(f"Error updating streaks: {str(e)}")
            logger.exception(e)
            raise

    def _update_single_streak(self, activity_type, streak_type, today, is_completed):
        try:
            streak, created = Streak.objects.get_or_create(
                user=self.request.user,
                activity_type=activity_type,
                streak_type=streak_type,
                defaults={'last_entry_date': today}
            )

            if is_completed:
                if created or (today - streak.last_entry_date) <= timedelta(days=1):
                    streak.current_streak += 1
                    streak.longest_streak = max(streak.longest_streak, streak.current_streak)
                else:
                    streak.current_streak = 1
                streak.last_entry_date = today
                streak.save()
            elif (today - streak.last_entry_date) > timedelta(days=1):
                streak.current_streak = 0
                streak.save()
        except Exception as e:
            logger.error(f"Error updating single streak: {str(e)}")
            logger.exception(e)
            raise

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
