from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import CurrentUserView
from .auth_views import (
    CustomTokenObtainPairView,
    RegisterView,
    RequestPasswordResetView,
    PasswordResetConfirmView
)
from rest_framework_simplejwt.views import TokenRefreshView

# Create a router for our ViewSet-based APIs
router = DefaultRouter()
router.register(r'user-questions', views.UserQuestionsViewSet, basename='user-questions')
router.register(r'streaks', views.StreakViewSet, basename='streaks')

# Define URL patterns
urlpatterns = [
    # Authentication endpoints
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/user/', CurrentUserView.as_view(), name='current_user'),
    path('auth/password-reset/', RequestPasswordResetView.as_view(), name='password_reset'),
    path('auth/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    # API endpoints
    path('api/', include(router.urls)),
]
