"""
URL configuration for storytelling_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
# from drf_yasg.views import get_schema_view
# from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from accounts.views import RegisterView, LoginView

# schema_view = get_schema_view(
#     openapi.Info(
#         title="Dynamic Storytelling Platform API",
#         default_version='v1',
#         description="API for interactive storytelling platform",
#         terms_of_service="https://www.google.com/policies/terms/",
#         contact=openapi.Contact(email="contact@storytelling.local"),
#         license=openapi.License(name="BSD License"),
#     ),
#     public=True,
#     permission_classes=(permissions.AllowAny,),
# )

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include([
        # Stories and accounts
        path('', include('stories.urls')),  # Stories URLs
        path('', include('accounts.urls')),  # Accounts URLs

        # Authentication endpoints
        path('auth/', include([
            path('token/', LoginView.as_view(), name='token_obtain_pair'),  # Custom login
            path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
            path('register/', RegisterView.as_view(), name='register'),
        ])),

        # Profile endpoints (moved from direct definition)
        # path('profile/', get_user_profile, name='profile'),
        # path('profile/update/', update_user_profile, name='profile-update'),
    ])),
    
    # API documentation (temporarily disabled)
    # path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    # path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
