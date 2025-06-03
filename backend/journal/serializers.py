from rest_framework import serializers
from .models import Question, UserQuestions, Streak, UserSettings, UserUsage
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
import re

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'user']

class UserQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuestions
        fields = ['questions', 'checkmarks', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class StreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Streak
        fields = ['activity_type', 'streak_type', 'current_streak', 'longest_streak', 'last_entry_date']
        read_only_fields = ['current_streak', 'longest_streak', 'last_entry_date']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['username', 'password', 'password2']
        extra_kwargs = {
            'username': {
                'validators': [
                    UniqueValidator(
                        queryset=User.objects.all(),
                        message="This username is already taken."
                    )
                ]
            },
        }

    def validate_username(self, value):
        if not re.match(r'^[\w.@+-]+$', value):
            raise serializers.ValidationError(
                "Username can only contain letters, numbers, and @/./+/-/_ characters."
            )
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "The two password fields didn't match."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['recovery_date']
        read_only_fields = ['created_at', 'updated_at']

class UserUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserUsage
        fields = ['dates']
        read_only_fields = ['created_at', 'updated_at']

