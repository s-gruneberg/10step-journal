from django.urls import path
from . import views
from .views import QuestionsListCreateView, JournalEntryListCreateView, CurrentUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('questions/', QuestionsListCreateView.as_view(), name='questions'),
    path('journal-entries/', JournalEntryListCreateView.as_view(), name='journal-entries'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', CurrentUserView.as_view(), name='current_user'),
]
