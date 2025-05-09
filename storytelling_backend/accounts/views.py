from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from .models import UserFollow
from .serializers import UserSerializer, UserProfileSerializer, UserFollowSerializer

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
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
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile(request):
    """Get current user's profile"""
    serializer = UserProfileSerializer(request.user, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile_by_username(request, username):
    """Get user profile by username"""
    try:
        user = User.objects.get(username=username)
        serializer = UserProfileSerializer(user, context={'request': request})
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(
            {'detail': 'User not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_user_profile(request):
    serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        try:
            user_to_follow = User.objects.get(username=username)
            if user_to_follow == request.user:
                return Response(
                    {'detail': 'You cannot follow yourself'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            follow, created = UserFollow.objects.get_or_create(
                follower=request.user,
                following=user_to_follow
            )
            
            if not created:
                return Response(
                    {'detail': 'You are already following this user'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response(
                {'detail': f'You are now following {user_to_follow.username}'},
                status=status.HTTP_201_CREATED
            )
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class UnfollowUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        try:
            user_to_unfollow = User.objects.get(username=username)
            follow = UserFollow.objects.filter(
                follower=request.user,
                following=user_to_unfollow
            ).first()
            
            if not follow:
                return Response(
                    {'detail': 'You are not following this user'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            follow.delete()
            return Response(
                {'detail': f'You have unfollowed {user_to_unfollow.username}'},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )