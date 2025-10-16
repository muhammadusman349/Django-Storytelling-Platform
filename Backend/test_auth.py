#!/usr/bin/env python
"""
Test script to verify authentication endpoints are working
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

def test_registration():
    """Test user registration endpoint"""
    client = APIClient()
    
    # Test data
    data = {
        'username': 'testuser123',
        'email': 'test123@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User'
    }
    
    print("Testing registration endpoint...")
    response = client.post('/api/auth/register/', data, format='json')
    
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {response.data}")
        response_data = response.data
    except AttributeError:
        print(f"Response Content: {response.content}")
        response_data = None
    
    if response.status_code == 201:
        print("Registration successful!")
        return response_data
    else:
        print("Registration failed!")
        return None

def test_login():
    """Test user login endpoint"""
    client = APIClient()
    
    # Create a test user first
    user = User.objects.create_user(
        username='logintest',
        email='logintest@example.com',
        password='testpass123'
    )
    
    # Test login
    data = {
        'username': 'logintest',
        'password': 'testpass123'
    }
    
    print("\nTesting login endpoint...")
    response = client.post('/api/auth/token/', data, format='json')
    
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {response.data}")
        response_data = response.data
    except AttributeError:
        print(f"Response Content: {response.content}")
        response_data = None
    
    if response.status_code == 200:
        print("Login successful!")
        return response_data
    else:
        print("Login failed!")
        return None

def test_stories_endpoint():
    """Test stories endpoint"""
    client = APIClient()
    
    print("\nTesting stories endpoint...")
    response = client.get('/api/stories/')
    
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {response.data}")
        response_data = response.data
    except AttributeError:
        print(f"Response Content: {response.content}")
        response_data = None
    
    if response.status_code == 200:
        print("Stories endpoint working!")
        return response_data
    else:
        print("Stories endpoint failed!")
        return None

if __name__ == '__main__':
    print("Testing Django Authentication Endpoints\n")
    
    # Clean up any existing test users
    User.objects.filter(username__in=['testuser123', 'logintest']).delete()
    
    # Run tests
    reg_result = test_registration()
    login_result = test_login()
    stories_result = test_stories_endpoint()
    
    print("\n" + "="*50)
    print("Test Results Summary:")
    print("="*50)
    print(f"Registration: {'PASS' if reg_result else 'FAIL'}")
    print(f"Login: {'PASS' if login_result else 'FAIL'}")
    print(f"Stories: {'PASS' if stories_result else 'FAIL'}")
    
    if reg_result and login_result and stories_result:
        print("\nAll tests passed! Your authentication is working correctly.")
    else:
        print("\nSome tests failed. Check the error messages above.")
