from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/user/', views.CurrentUserProfileView.as_view(), name='current-user'),

    # Profile management
    path('profile/', views.CurrentUserProfileView.as_view(), name='profile'),
    path('profile/update/', views.UpdateUserProfileView.as_view(), name='profile-update'),
    path('profile/<str:username>/', views.UserProfileView.as_view(), name='user-profile'),
    path('profile/<str:username>/followers/', views.UserFollowersView.as_view(), name='user-followers'),
    path('profile/<str:username>/following/', views.UserFollowingView.as_view(), name='user-following'),

    # Follow system
    path('follow/<str:username>/', views.FollowUserView.as_view(), name='follow-user'),
    path('unfollow/<str:username>/', views.UnfollowUserView.as_view(), name='unfollow-user'),
]
