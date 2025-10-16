from rest_framework import serializers
from .models import Story, Chapter, DecisionPoint, Choice, Vote, StoryShare
from django.contrib.auth import get_user_model

User = get_user_model()

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'votes']

class DecisionPointSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = DecisionPoint
        fields = ['id', 'question', 'choices', 'created_at', 'expires_at', 'is_active']

class ChapterSerializer(serializers.ModelSerializer):
    decision_points = DecisionPointSerializer(many=True, read_only=True)
    
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'content', 'order', 'decision_points', 'created_at']

class StorySerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    likes_count = serializers.ReadOnlyField()
    shares_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()
    is_shared = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model = Story
        fields = (
            'id', 'title', 'slug', 'description', 'content', 'cover_image',
            'category', 'author', 'author_username', 'chapters', 'created_at', 
            'updated_at', 'is_active', 'is_published', 'likes_count', 
            'shares_count', 'is_liked', 'is_shared', 'can_edit'
        )
        read_only_fields = ('author', 'slug')

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_is_shared(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.shares.filter(id=request.user.id).exists()
        return False

    def get_can_edit(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.author == request.user
        return False

class StoryShareSerializer(serializers.ModelSerializer):
    shared_by_username = serializers.CharField(source='shared_by.username', read_only=True)
    story_title = serializers.CharField(source='story.title', read_only=True)

    class Meta:
        model = StoryShare
        fields = ('id', 'story', 'shared_by', 'shared_by_username', 
                 'story_title', 'shared_at', 'platform')
        read_only_fields = ('shared_by', 'shared_at')

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'choice', 'created_at']
        read_only_fields = ['user']
