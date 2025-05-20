from django.urls import path
from . import views

urlpatterns = [
    # Story URLs
    path('stories/', views.StoryListCreateView.as_view(), name='story-list'),
    path('stories/<slug:slug>/', views.StoryDetailView.as_view(), name='story-detail'),
    path('stories/<slug:slug>/like/', views.StoryLikeView.as_view(), name='story-like'),
    path('stories/<slug:slug>/share/', views.StoryShareView.as_view(), name='story-share'),
    
    # Chapter URLs
    path('stories/<slug:story_slug>/chapters/', 
         views.ChapterListCreateView.as_view(), 
         name='chapter-list'),
    path('stories/<slug:story_slug>/chapters/<int:pk>/', 
         views.ChapterDetailView.as_view(), 
         name='chapter-detail'),
    
    # Decision Point URLs
    path('stories/<slug:story_slug>/chapters/<int:chapter_pk>/decision-points/',
         views.DecisionPointListCreateView.as_view(),
         name='decision-point-list'),
    path('stories/<slug:story_slug>/chapters/<int:chapter_pk>/decision-points/<int:pk>/',
         views.DecisionPointDetailView.as_view(),
         name='decision-point-detail'),
    
    # Choice URLs
    path('stories/<slug:story_slug>/chapters/<int:chapter_pk>/decision-points/<int:decision_point_pk>/choices/',
         views.ChoiceListCreateView.as_view(),
         name='choice-list'),
    
    # Vote URLs
    path('stories/<slug:story_slug>/chapters/<int:chapter_pk>/decision-points/<int:decision_point_pk>/vote/',
         views.VoteCreateView.as_view(),
         name='vote-create'),
]