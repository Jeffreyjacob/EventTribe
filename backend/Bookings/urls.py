from django.urls import path
from Bookings.views import CreateCheckOutAPIView,GetBookedEventbyOrganizer,GetBookedEventByUserAPIView,CancelBookedEventAPIView
from .webhooks import stripe_webhook

urlpatterns = [
    path("checkout-session/",CreateCheckOutAPIView.as_view()),
    path("organizer/",GetBookedEventbyOrganizer.as_view()),
    path("user/",GetBookedEventByUserAPIView.as_view()),
    path("stripe-webhook/",stripe_webhook),
    path("cancel/<booking_id>/",CancelBookedEventAPIView.as_view())
]