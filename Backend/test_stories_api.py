#!/usr/bin/env python
"""
Test script to verify stories API returns all published stories
"""
import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'conf.settings')
django.setup()

from django.contrib.auth import get_user_model
from stories.models import Story
from rest_framework.test import APIClient

User = get_user_model()

def test_stories_api():
    """Test that stories API returns all published stories, not just user's stories"""
    client = APIClient()

    # Create a test user
    user = User.objects.create_user(
        username='testuser123',
        email='test123@example.com',
        password='testpass123'
    )

    # Create some test stories
    story1 = Story.objects.create(
        title='Test Story 1',
        description='A test story',
        author=user,
        is_published=True
    )

    story2 = Story.objects.create(
        title='Test Story 2',
        description='Another test story',
        author=user,
        is_published=True
    )

    print("Testing stories API...")

    # Test without authentication (should return all published stories)
    response = client.get('/api/stories/')
    print(f"Status Code (unauthenticated): {response.status_code}")

    if response.status_code == 200:
        data = response.data
        print(f"Total stories returned: {data.get('count', len(data.get('results', [])))}")
        print(f"Response structure: {type(data)}")

        if 'results' in data:
            print(f"Results array length: {len(data['results'])}")
            for i, story in enumerate(data['results'][:3]):  # Show first 3
                print(f"  Story {i+1}: {story['title']} by {story['author_username']}")
        else:
            print(f"Direct array length: {len(data)}")
            for i, story in enumerate(data[:3]):  # Show first 3
                print(f"  Story {i+1}: {story['title']} by {story['author_username']}")

    # Clean up
    story1.delete()
    story2.delete()
    user.delete()

if __name__ == '__main__':
    print("Testing Stories API Response Structure")
    test_stories_api()
    print("Test completed!")
