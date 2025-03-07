from django.urls import path
from users import views as api_views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/',api_views.RegisterAPIView.as_view(),name="registerUser"),
    path('emailVerification/',api_views.EmailVerificationAPIView.as_view(),name='emailVerification'),
    path('resendEmailVerification/',api_views.ResendEmailVerificationCodeAPIView.as_view(),name="resendEmailVerification"),
    path('login/',api_views.LoginAPIView.as_view(),name="login"),
    path('token/refresh/',TokenRefreshView.as_view(),name="token_refresh"),
    path('forgetpassword/',api_views.ForgetPasswordAPIView.as_view(),name="forgetPassword"),
    path('setpassword/',api_views.SetNewPasswordAPIView.as_view(),name="setpassword"),
    path('profile/',api_views.GetUserProfileAPIView.as_view(),name="profil"),
    path('profile/update/',api_views.UpdateUserProfileAPIView.as_view(),name="updateProfile"),
    path('organizer/',api_views.GetOrganizerListAPIView.as_view()),
    path('logout/',api_views.LogoutAPIView.as_view()),
    path("updateInterest/",api_views.UpdateUserInterestAPIView.as_view()),
    path("creditcard/create/",api_views.AddCreditCardView.as_view()),
    path("creditcard/",api_views.ListCreditCardView.as_view()),
    path("creditcard/setdefault/<card_id>/",api_views.SetDefaultCreditCardView.as_view()),
    path("creditcard/delete/<card_id>/",api_views.DeleteCreditCardView.as_view()),
    path("follow/<organizerId>/",api_views.UserFollowOrganizer.as_view()),
    path("organizer/<organizerId>/",api_views.GetOrganizerDetailAPIView.as_view())
]