from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.db import models
from .models import Story, Chapter, DecisionPoint, Choice, Vote, StoryShare
from .serializers import (
    StorySerializer, ChapterSerializer,
    DecisionPointSerializer, ChoiceSerializer, VoteSerializer, StoryShareSerializer
)
from rest_framework.exceptions import PermissionDenied

class StoryListCreateView(generics.ListCreateAPIView):
    """List and create stories with filtering and search"""
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Story.objects.filter(is_published=True).select_related('author').prefetch_related('likes', 'shares').order_by('-created_at')

        # Filter by author if provided
        author = self.request.query_params.get('author', None)
        if author:
            queryset = queryset.filter(author__username=author)

        # Filter by category if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)

        # Search by title or description
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class StoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a story"""
    queryset = Story.objects.filter(is_published=True).select_related('author').prefetch_related('likes', 'shares', 'chapters')
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def perform_update(self, serializer):
        if serializer.instance.author != self.request.user:
            raise PermissionDenied("You can only edit your own stories")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionDenied("You can only delete your own stories")
        instance.delete()

class StoryLikeView(APIView):
    """Like or unlike a story"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        story = get_object_or_404(Story, slug=slug, is_published=True)

        if request.user in story.likes.all():
            story.likes.remove(request.user)
            return Response({
                "message": "Story unliked",
                "liked": False,
                "likes_count": story.likes_count
            }, status=status.HTTP_200_OK)

        story.likes.add(request.user)
        return Response({
            "message": "Story liked",
            "liked": True,
            "likes_count": story.likes_count
        }, status=status.HTTP_200_OK)

class StoryShareView(APIView):
    """Share a story on social platforms"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        story = get_object_or_404(Story, slug=slug, is_published=True)
        platform = request.data.get('platform', '').lower()

        if not platform:
            return Response(
                {"error": "Platform is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        valid_platforms = ['twitter', 'facebook', 'email', 'linkedin', 'whatsapp']
        if platform not in valid_platforms:
            return Response(
                {"error": f"Invalid platform. Valid options: {', '.join(valid_platforms)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        share, created = StoryShare.objects.get_or_create(
            story=story,
            shared_by=request.user,
            platform=platform
        )

        if created:
            return Response({
                "message": f"Story shared on {platform}",
                "shared": True,
                "shares_count": story.shares_count
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": f"Story already shared on {platform}",
            "shared": False,
            "shares_count": story.shares_count
        }, status=status.HTTP_200_OK)

class ChapterListCreateView(generics.ListCreateAPIView):
    """List and create chapters for a story"""
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        story_slug = self.kwargs['story_slug']
        return Chapter.objects.filter(story__slug=story_slug).order_by('order')

    def perform_create(self, serializer):
        story = get_object_or_404(Story, slug=self.kwargs['story_slug'], is_published=True)
        if story.author != self.request.user:
            return Response(
                {"error": "Only the author can add chapters"},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save(story=story)

class ChapterDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a chapter"""
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        story_slug = self.kwargs['story_slug']
        return Chapter.objects.filter(story__slug=story_slug)

    def perform_update(self, serializer):
        chapter = self.get_object()
        if chapter.story.author != self.request.user:
            raise PermissionDenied("You can only edit chapters of your own stories")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.story.author != self.request.user:
            raise PermissionDenied("You can only delete chapters of your own stories")
        instance.delete()

class DecisionPointListCreateView(generics.ListCreateAPIView):
    """List and create decision points for a chapter"""
    serializer_class = DecisionPointSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return DecisionPoint.objects.filter(
            chapter__story__slug=self.kwargs['story_slug'],
            chapter_id=self.kwargs['chapter_pk'],
            is_active=True
        ).order_by('-created_at')

    def perform_create(self, serializer):
        chapter = get_object_or_404(
            Chapter,
            story__slug=self.kwargs['story_slug'],
            pk=self.kwargs['chapter_pk']
        )
        if chapter.story.author != self.request.user:
            return Response(
                {"error": "Only the story author can add decision points"},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save(chapter=chapter)

class DecisionPointDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a decision point"""
    serializer_class = DecisionPointSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return DecisionPoint.objects.filter(
            chapter__story__slug=self.kwargs['story_slug'],
            chapter_id=self.kwargs['chapter_pk']
        )

    def perform_update(self, serializer):
        decision_point = self.get_object()
        if decision_point.chapter.story.author != self.request.user:
            raise PermissionDenied("Only the story author can update decision points")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.chapter.story.author != self.request.user:
            raise PermissionDenied("Only the story author can delete decision points")
        instance.delete()

class ChoiceListCreateView(generics.ListCreateAPIView):
    """List and create choices for a decision point"""
    serializer_class = ChoiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Choice.objects.filter(
            decision_point__chapter__story__slug=self.kwargs['story_slug'],
            decision_point__chapter__id=self.kwargs['chapter_pk'],
            decision_point__id=self.kwargs['decision_point_pk']
        ).order_by('id')

    def perform_create(self, serializer):
        decision_point = get_object_or_404(
            DecisionPoint,
            chapter__story__slug=self.kwargs['story_slug'],
            chapter__id=self.kwargs['chapter_pk'],
            id=self.kwargs['decision_point_pk']
        )
        if decision_point.chapter.story.author != self.request.user:
            return Response(
                {"error": "Only the author can add choices"},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save(decision_point=decision_point)

class VoteCreateView(generics.CreateAPIView):
    """Create a vote for a choice"""
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        choice_id = request.data.get('choice')
        if not choice_id:
            return Response(
                {"error": "Choice ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        choice = get_object_or_404(Choice, id=choice_id)

        # Check if user already voted on this decision point
        if Vote.objects.filter(
            user=request.user,
            choice__decision_point=choice.decision_point
        ).exists():
            return Response(
                {"error": "You have already voted on this decision point"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if decision point is still active
        if not choice.decision_point.is_active:
            return Response(
                {"error": "This decision point is no longer active"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Update vote count
        choice.votes += 1
        choice.save()

        return Response({
            **serializer.data,
            "message": "Vote recorded successfully",
            "choice_votes": choice.votes
        }, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserStoriesView(generics.ListAPIView):
    """Get stories by a specific user"""
    serializer_class = StorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs['username']
        return Story.objects.filter(
            author__username=username,
            is_published=True
        ).select_related('author').prefetch_related('likes', 'shares').order_by('-created_at')

class StoryStatsView(generics.RetrieveAPIView):
    """Get detailed statistics for a story"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StorySerializer

    def get_object(self):
        story = get_object_or_404(Story, slug=self.kwargs['slug'], is_published=True)

        # Only author can see detailed stats
        if story.author != self.request.user:
            raise PermissionDenied("You can only view stats for your own stories")

        return story

class StorySharesView(generics.ListAPIView):
    """Get all shares for a story"""
    serializer_class = StoryShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        story = get_object_or_404(Story, slug=self.kwargs['slug'])

        # Only author can see shares
        if story.author != self.request.user:
            raise PermissionDenied("You can only view shares for your own stories")

        return StoryShare.objects.filter(story=story).order_by('-shared_at')