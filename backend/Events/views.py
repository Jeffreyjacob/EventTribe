from django.shortcuts import render
from Events import serializers as api_serializer
from rest_framework import status
from rest_framework.generics import GenericAPIView,ListAPIView,DestroyAPIView,RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from .permissions import isUserOrganizer
from django.shortcuts import get_object_or_404
from Events.models import Event
import cloudinary
import cloudinary.uploader
from django_filters .rest_framework import DjangoFilterBackend
from .filters import EventFilter,OrganizerEventFilter
from rest_framework.pagination import PageNumberPagination

# Create your views here.

class EventPagination(PageNumberPagination):
      page_size = 3
      max_page_size = 20
      page_size_query_param = 'page_size'
    

class CreateEventAPIView(GenericAPIView):
    serializer_class = api_serializer.CreateSerializer
    permission_classes = [isUserOrganizer]
    
    def post(self,request):
        serializer = self.serializer_class(data=request.data,context={'request':request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    

class EditEventAPIView(GenericAPIView):
     serializer_class = api_serializer.EditSerializer
     permission_classes = [isUserOrganizer]
     
     def put(self,request,id):
         event = get_object_or_404(Event,id=id)
         serializer = self.serializer_class(event,data=request.data)
         if serializer.is_valid(raise_exception=True):
             image = serializer.validated_data.pop('uploaded_image')
             if image:
                 allowed_format = ['image/png','image/jpeg','image/jpg']
                 if hasattr(image,"content_type") and image.content_type not in allowed_format:
                       return Response({"message":"Invalid image format. Please upload JPEG or PNG."})
                 
                 try:
                     upload_options = {
                     "folder": "events/",  # Organize images in folders
                     "resource_type": "image",
                     "allowed_formats": ["jpg", "png", "jpeg"],
                      }
                     uploadedImage = cloudinary.uploader.upload(
                         image,
                         **upload_options
                     )
                     image_url = uploadedImage.get('secure_url')
                     serializer.save(image=image_url)
                     return Response(serializer.data,status=status.HTTP_200_OK)
                     
                 except Exception as e:
                       return Response({"message":f"failed to upload image: {str(e)}"})
         return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
     
     
class AllEventAPIView(ListAPIView):
       serializer_class = api_serializer.EventSerializer
       permission_classes = [AllowAny]
       queryset = Event.objects.select_related('organizer').all()
       pagination_class = EventPagination
       

class AddOrRemoveEventFavoriteAPIView(GenericAPIView):
       permission_classes = [IsAuthenticated]
       
       def post(self,request,id):
           user = request.user
           event = get_object_or_404(Event,id=id)
           if event:
               if user in event.favorited.all():
                   event.favorited.remove(user)
                   return Response({"message":"Removed from favorite"},status=status.HTTP_200_OK)
               else:
                   event.favorited.add(user)
                   return Response({"message":"Added to favorite"},status=status.HTTP_200_OK)
               
class EventDetailsByIdAPIView(GenericAPIView):
      serializer_class = api_serializer.EventSerializer
      permission_classes = [AllowAny]
      
      def get(self,request,id):
          try:
              event = Event.objects.get(id=id)
              serializer = self.serializer_class(event)
              return Response(serializer.data,status=status.HTTP_200_OK)
          except Event.DoesNotExist:
              return Response({"message":"Event does not exist"})

          
class OrganizerEventAPIView(ListAPIView):
       serializer_class = api_serializer.EventSerializer
       permission_classes = [IsAuthenticated,isUserOrganizer]
       queryset = Event.objects.select_related("organizer").all()
       pagination_class = EventPagination
       filter_backends = (DjangoFilterBackend,)
       filterset_class = OrganizerEventFilter
       
       def get_queryset(self):
            return Event.objects.filter(organizer=self.request.user)
        
class UserInterestEventAPIView(GenericAPIView):
      serializer_class = api_serializer.EventSerializer
      permission_classes = [IsAuthenticated]
      pagination_class = EventPagination
      
      def get(self,request):
          try:
              user = request.user
              user_interest = user.profile.interest
              
              if not user_interest:
                  return Response({
                       "message": "No interests found in your profile",
                       "data": []
                  },status=status.HTTP_200_OK)
                  
              matching_event = Event.objects.filter(
                  category__in = user_interest
              ).distinct().order_by('-created_at')
              
              # Apply pagination to the queryset
              paginator = self.pagination_class()
              paginated_events = paginator.paginate_queryset(matching_event, request)
              serializer = self.serializer_class(paginated_events, many=True)

            # Return paginated response
              return paginator.get_paginated_response(serializer.data)
              
          except Exception as e:
            return Response({
                "status": "error",
                "message": f"Error fetching matching events: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)
           

class DeleteEventApiView(DestroyAPIView):
      permission_classes = [isUserOrganizer]
      serializer_class = api_serializer.EventSerializer
      queryset = Event.objects.all()
      lookup_field = 'id'
    
class SearchEventAPIView(ListAPIView):
     permission_classes = [AllowAny]
     serializer_class = api_serializer.EventSerializer
     queryset = Event.objects.all()
     filter_backends = (DjangoFilterBackend,)
     filterset_class = EventFilter
     pagination_class = EventPagination
     

class RelatedEventAPIView(RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Event.objects.all()
    lookup_field = "id"
    
    
    def get_object(self):
         return Event.objects.get(id=self.kwargs['id'])
     
    def get(self, request, *args, **kwargs):
         event = self.get_object()
         relatedEvents = Event.objects.filter(
             category = event.category
         ).exclude(id=event.id)
         serializer = api_serializer.EventSerializer(relatedEvents,many=True)
         return Response(serializer.data,status=status.HTTP_200_OK)
     
     
    
    
            
            
            
        