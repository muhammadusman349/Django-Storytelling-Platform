#!/usr/bin/env python
"""
Test script to verify all endpoints are working correctly
"""
import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'conf.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
import json

User = get_user_model()

def test_profile_endpoints():
    """Test profile-related endpoints"""
    client = APIClient()
    
    # Create a test user
    user = User.objects.create_user(
        username='testprofile',
        email='testprofile@example.com',
        password='testpass123',
        first_name='Test',
        last_name='Profile'
    )
    
    print("Testing profile endpoints...")
    
    # Test login first
    login_data = {
        'username': 'testprofile',
        'password': 'testpass123'
    }
    
    login_response = client.post('/api/auth/token/', login_data, format='json')
    print(f"Login Status: {login_response.status_code}")
    
    if login_response.status_code == 200:
        # Get the token
        token = login_response.data['tokens']['access']
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Test current user profile
        profile_response = client.get('/api/profile/')
        print(f"Current Profile Status: {profile_response.status_code}")
        if profile_response.status_code == 200:
            print(f"Profile Data: {profile_response.data}")
        else:
            print(f"Profile Error: {profile_response.data}")
        
        # Test user profile by username
        user_profile_response = client.get(f'/api/profile/{user.username}/')
        print(f"User Profile Status: {user_profile_response.status_code}")
        if user_profile_response.status_code == 200:
            print(f"User Profile Data: {user_profile_response.data}")
        else:
            print(f"User Profile Error: {user_profile_response.data}")
    
    # Clean up
    user.delete()

def test_stories_endpoints():
    """Test stories endpoints"""
    client = APIClient()
    
    print("\nTesting stories endpoints...")
    
    # Test stories list
    stories_response = client.get('/api/stories/')
    print(f"Stories List Status: {stories_response.status_code}")
    
    if stories_response.status_code == 200:
        print(f"Stories Count: {len(stories_response.data)}")
    else:
        print(f"Stories Error: {stories_response.data}")

if __name__ == '__main__':
    print("Testing Django API Endpoints\n")
    
    test_profile_endpoints()
    test_stories_endpoints()
    
    print("\nTest completed!")
