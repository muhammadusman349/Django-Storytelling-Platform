from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_author = models.BooleanField(default=False)
    following = models.ManyToManyField(
        'self', 
        through='UserFollow',
        related_name='followers',
        symmetrical=False
    )

    def __str__(self):
        return self.username

class UserFollow(models.Model):
    follower = models.ForeignKey(
        User, 
        related_name='following_relationships', 
        on_delete=models.CASCADE
    )
    following = models.ForeignKey(
        User, 
        related_name='follower_relationships', 
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"
