from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from .models import UserFollow
from .serializers import UserSerializer, UserProfileSerializer, UserFollowSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """User registration with JWT token generation"""
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Hash the password before saving
            serializer.validated_data['password'] = make_password(
                serializer.validated_data['password']
            )
            user = serializer.save()

            # Generate tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'detail': str(e),
                'message': 'Registration failed'
            }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """Custom login view that matches frontend expectations"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')

            if not username or not password:
                return Response({
                    'detail': 'Username and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Try to authenticate with username or email
            user = authenticate(username=username, password=password)
            
            if not user:
                # Try with email if username auth failed
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(username=user_obj.username, password=password)
                except User.DoesNotExist:
                    pass

            if not user:
                return Response({
                    'detail': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)

            if not user.is_active:
                return Response({
                    'detail': 'Account is disabled'
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Generate tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'detail': 'Login failed'
            }, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserProfileView(generics.RetrieveAPIView):
    """Get current authenticated user's profile"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

class UserProfileView(generics.RetrieveAPIView):
    """Get user profile by username"""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = UserProfileSerializer
    queryset = User.objects.filter(is_active=True)
    lookup_field = 'username'

class UpdateUserProfileView(generics.UpdateAPIView):
    """Update current user's profile"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # Handle avatar upload if provided
        if 'avatar' in request.FILES:
            instance.avatar = request.FILES['avatar']
            instance.save(update_fields=['avatar'])

        self.perform_update(serializer)

        return Response({
            'user': serializer.data,
            'message': 'Profile updated successfully'
        })

class FollowUserView(APIView):
    """Follow a user"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        try:
            user_to_follow = get_object_or_404(User, username=username, is_active=True)

            if user_to_follow == request.user:
                return Response(
                    {'error': 'You cannot follow yourself'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if already following
            follow, created = UserFollow.objects.get_or_create(
                follower=request.user,
                following=user_to_follow
            )

            if not created:
                return Response(
                    {'error': 'You are already following this user'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {
                    'message': f'You are now following {user_to_follow.username}',
                    'following': True
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': 'Failed to follow user'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UnfollowUserView(APIView):
    """Unfollow a user"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        try:
            user_to_unfollow = get_object_or_404(User, username=username, is_active=True)

            follow = UserFollow.objects.filter(
                follower=request.user,
                following=user_to_unfollow
            ).first()

            if not follow:
                return Response(
                    {'error': 'You are not following this user'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            follow.delete()
            return Response(
                {
                    'message': f'You have unfollowed {user_to_unfollow.username}',
                    'following': False
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': 'Failed to unfollow user'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserFollowersView(generics.ListAPIView):
    """Get user's followers"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserFollowSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(User, username=username, is_active=True)
        return UserFollow.objects.filter(following=user)

class UserFollowingView(generics.ListAPIView):
    """Get users that a user is following"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserFollowSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(User, username=username, is_active=True)
        return UserFollow.objects.filter(follower=user)