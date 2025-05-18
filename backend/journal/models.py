from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Question(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text


class UserQuestions(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    questions = models.JSONField(default=list)  # List of questions
    checkmarks = models.JSONField(default=list)  # List of checkmark activities
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Questions'
        verbose_name_plural = 'User Questions'


class Streak(models.Model):
    STREAK_TYPES = [
        ('journal', 'Journal'),
        ('checkmark', 'Checkmark'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50)  # 'journal' or checkmark name
    streak_type = models.CharField(max_length=20, choices=STREAK_TYPES)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_entry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'activity_type']
        indexes = [
            models.Index(fields=['user', 'activity_type']),
        ]
        verbose_name = 'Streak'
        verbose_name_plural = 'Streaks'


class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    recovery_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Settings'
        verbose_name_plural = 'User Settings'