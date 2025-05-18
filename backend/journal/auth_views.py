from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterUserSerializer, UserSerializer
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
import re

class CustomTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [AnonRateThrottle]
    
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            return response
        except Exception as e:
            error_message = str(e)
            if "No active account found" in error_message:
                return Response(
                    {"detail": "Invalid username or password"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            return Response(
                {"detail": "Login failed. Please try again."},
                status=status.HTTP_400_BAD_REQUEST
            )

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    throttle_classes = [AnonRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            self.perform_create(serializer)
            return Response(
                {"detail": "Registration successful! You can now login."},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class RequestPasswordResetView(APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            # In production, this would be your frontend URL
            reset_url = f"http://localhost:5173/reset-password/{user.pk}/{token}"
            
            send_mail(
                'Password Reset Request',
                f'Click the following link to reset your password: {reset_url}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            
            return Response(
                {"detail": "Password reset email has been sent."},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "If an account exists with this email, a password reset link will be sent."},
                status=status.HTTP_200_OK
            )

class PasswordResetConfirmView(APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        user_id = request.data.get('user_id')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        try:
            user = User.objects.get(pk=user_id)
            if default_token_generator.check_token(user, token):
                try:
                    validate_password(new_password)
                    user.set_password(new_password)
                    user.save()
                    return Response(
                        {"detail": "Password has been reset successfully."},
                        status=status.HTTP_200_OK
                    )
                except ValidationError as e:
                    return Response(
                        {"password": e.messages},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(
                    {"detail": "Invalid or expired reset link."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid reset link."},
                status=status.HTTP_400_BAD_REQUEST
            ) 