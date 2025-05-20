from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils.text import slugify
import uuid

User = get_user_model()

class Story(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stories')
    description = models.TextField()
    content = models.TextField()
    cover_image = models.ImageField(upload_to='story_covers/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_published = models.BooleanField(default=True)
    category = models.CharField(max_length=50, blank=True)
    likes = models.ManyToManyField(
        User,
        related_name='liked_stories',
        blank=True
    )
    shares = models.ManyToManyField(
        User,
        through='StoryShare',
        related_name='shared_stories'
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            # If slug exists, append a UUID
            if Story.objects.filter(slug=self.slug).exists():
                self.slug = f"{self.slug}-{str(uuid.uuid4())[:8]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def likes_count(self):
        return self.likes.count()

    @property
    def shares_count(self):
        return self.shares.count()

    class Meta:
        verbose_name_plural = 'Stories'
        ordering = ['-created_at']

class StoryShare(models.Model):
    story = models.ForeignKey(Story, on_delete=models.CASCADE)
    shared_by = models.ForeignKey(User, on_delete=models.CASCADE)
    shared_at = models.DateTimeField(auto_now_add=True)
    platform = models.CharField(max_length=50)  # e.g., 'twitter', 'facebook', 'email'
    
    class Meta:
        unique_together = ('story', 'shared_by', 'platform')

    def __str__(self):
        return f"{self.shared_by.username} shared {self.story.title} on {self.platform}"

class Chapter(models.Model):
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=200)
    content = models.TextField()
    order = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.story.title} - Chapter {self.order}: {self.title}"

    class Meta:
        ordering = ['order']

class DecisionPoint(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='decision_points')
    question = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Decision Point for {self.chapter}"

class Choice(models.Model):
    decision_point = models.ForeignKey(DecisionPoint, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=500)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.text

class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'choice')
