from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserFollow

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

class UserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    stories_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'date_joined', 'followers_count', 'following_count',
            'stories_count', 'is_following', 'bio', 'avatar', 'is_author'
        )
        read_only_fields = ('id', 'username', 'email', 'date_joined')

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
                return None  # Don't show follow status for own profile
            return UserFollow.objects.filter(
                follower=request.user,
                following=obj
            ).exists()
        return False

    def update(self, instance, validated_data):
        # Handle avatar separately if provided
        avatar = validated_data.pop('avatar', None)
        if avatar is not None:
            instance.avatar = avatar

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class UserFollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)

    class Meta:
        model = UserFollow
        fields = ('id', 'follower', 'following', 'created_at')
