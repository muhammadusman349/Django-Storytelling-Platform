from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Story, Chapter, DecisionPoint, Choice, Vote, StoryShare
from .serializers import (
    StorySerializer, ChapterSerializer, 
    DecisionPointSerializer, ChoiceSerializer, VoteSerializer
)
from rest_framework.exceptions import PermissionDenied

class StoryListCreateView(generics.ListCreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Story.objects.all().order_by('-created_at')
        # Filter by author if provided
        author = self.request.query_params.get('author', None)
        if author:
            queryset = queryset.filter(author__username=author)
        # Filter by category if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class StoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        return Story.objects.filter(is_published=True)

    def perform_update(self, serializer):
        if serializer.instance.author != self.request.user:
            raise PermissionDenied("You can only edit your own stories")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionDenied("You can only delete your own stories")
        instance.delete()

class StoryLikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        story = get_object_or_404(Story, slug=slug)
        if request.user in story.likes.all():
            story.likes.remove(request.user)
            return Response({"detail": "Story unliked"}, status=status.HTTP_200_OK)
        story.likes.add(request.user)
        return Response({"detail": "Story liked"}, status=status.HTTP_200_OK)

class StoryShareView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, slug):
        story = get_object_or_404(Story, slug=slug)
        platform = request.data.get('platform', '').lower()
        
        if not platform:
            return Response(
                {"detail": "Platform is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if platform not in ['twitter', 'facebook', 'email']:
            return Response(
                {"detail": "Invalid platform"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        share, created = StoryShare.objects.get_or_create(
            story=story,
            shared_by=request.user,
            platform=platform
        )
        
        if created:
            return Response(
                {"detail": f"Story shared on {platform}"},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {"detail": f"Story already shared on {platform}"},
            status=status.HTTP_200_OK
        )

class ChapterListCreateView(generics.ListCreateAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Chapter.objects.filter(story__slug=self.kwargs['story_slug'])

    def perform_create(self, serializer):
        story = get_object_or_404(Story, slug=self.kwargs['story_slug'])
        if story.author != self.request.user:
            return Response(
                {"error": "Only the author can add chapters"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save(story=story)

class ChapterDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Chapter.objects.filter(story__slug=self.kwargs['story_slug'])

class DecisionPointListCreateView(generics.ListCreateAPIView):
    serializer_class = DecisionPointSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return DecisionPoint.objects.filter(
            chapter__story__slug=self.kwargs['story_slug'],
            chapter_id=self.kwargs['chapter_pk']
        )

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
            return Response(
                {"error": "Only the story author can update decision points"},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()

    def perform_destroy(self, instance):
        if instance.chapter.story.author != self.request.user:
            return Response(
                {"error": "Only the story author can delete decision points"},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()

class ChoiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ChoiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Choice.objects.filter(
            decision_point__chapter__story__slug=self.kwargs['story_slug'],
            decision_point__chapter__id=self.kwargs['chapter_pk'],
            decision_point__id=self.kwargs['decision_point_pk']
        )

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
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        choice = get_object_or_404(Choice, id=request.data.get('choice'))
        
        if Vote.objects.filter(
            user=request.user, 
            choice__decision_point=choice.decision_point
        ).exists():
            return Response(
                {"error": "You have already voted on this decision point"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        choice.votes += 1
        choice.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)