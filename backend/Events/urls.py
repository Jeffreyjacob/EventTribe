from django.urls import path
from Events import views as view

urlpatterns = [
    path("",view.AllEventAPIView.as_view()),
    path("create/",view.CreateEventAPIView.as_view()),
    path("organizer/",view.OrganizerEventAPIView.as_view()),
    path("interest/",view.UserInterestEventAPIView.as_view()),
    path("search/",view.SearchEventAPIView.as_view()),
    path("<id>/",view.EventDetailsByIdAPIView.as_view()),
    path("delete/<id>/",view.DeleteEventApiView.as_view()),
    path("update/<id>/",view.EditEventAPIView.as_view()),
    path("favorite/<id>/",view.AddOrRemoveEventFavoriteAPIView.as_view()),
]