from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserFollow

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

class UserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    stories_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'date_joined', 'followers_count', 'following_count',
            'stories_count', 'is_following', 'bio', 'avatar'
        )
        read_only_fields = ('username', 'email', 'date_joined')

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    def get_stories_count(self, obj):
        return obj.stories.count()
        
    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if request.user == obj:
                return None
            return UserFollow.objects.filter(
                follower=request.user,
                following=obj
            ).exists()
        return False

class UserFollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)

    class Meta:
        model = UserFollow
        fields = ('id', 'follower', 'following', 'created_at')
