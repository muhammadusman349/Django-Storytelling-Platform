from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/user/', views.get_user_profile, name='current-user'),

    # Profile management
    path('profile/<str:username>/',
         views.get_user_profile_by_username,
         name='user-profile'),

    # Follow system
    path('follow/<str:username>/',
         views.FollowUserView.as_view(),
         name='follow-user'),
    path('unfollow/<str:username>/',
         views.UnfollowUserView.as_view(),
         name='unfollow-user'),
]
