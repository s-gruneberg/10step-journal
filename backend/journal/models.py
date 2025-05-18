from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Question(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text


class JournalEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entries')
    date = models.DateField(auto_now_add=True)
    content = models.TextField()

    def __str__(self):
        return f"{self.user.username} - {self.date}"