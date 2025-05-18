from django.urls import path
from . import views
from .views import QuestionsListCreateView, JournalEntryListCreateView, CurrentUserView
from .auth_views import (
    CustomTokenObtainPairView,
    RegisterView,
    RequestPasswordResetView,
    PasswordResetConfirmView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('questions/', QuestionsListCreateView.as_view(), name='questions'),
    path('journal-entries/', JournalEntryListCreateView.as_view(), name='journal-entries'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', CurrentUserView.as_view(), name='current_user'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/password-reset/', RequestPasswordResetView.as_view(), name='password_reset'),
    path('auth/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
