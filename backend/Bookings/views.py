from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.generics import GenericAPIView,ListAPIView
from Bookings import serializers as api_serializer
from Events.models import Event,WaitingList
from users.models import CreditCard
from .models import Bookings
from rest_framework.pagination import PageNumberPagination
import stripe
from django.conf import settings
from .permissions import IsUserOrganizer
from django.db.utils import IntegrityError

# Create your views here.
stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckOutAPIView(GenericAPIView):
     permission_classes = [IsAuthenticated]
     serializer_class = api_serializer.CreateCheckoutSerializer
     
     def post(self,request):
         user = request.user
         serializer = self.serializer_class(data=request.data)
         try:
             if serializer.is_valid(raise_exception=True):
                 print(serializer.errors)
             event_id = serializer.validated_data['event']
             quantity = serializer.validated_data['quantity']
             
             print("Event ID:", event_id)  # Debugging line
             print("Quantity:", quantity) 
             
             event = Event.objects.get(id=event_id)     
             print(event)
             if event.attendees.count() + quantity >= event.capacity:
                 WaitingList.objects.create(
                     user = user,
                     event = event
                 )
                 return Response({"message":"The event is full. You have been added to the waiting list."},
                                 status=status.HTTP_400_BAD_REQUEST)
             else:
                 default_card = CreditCard.objects.filter(user=user,is_default=True).first()
                 if not default_card:
                     return Response({"message":"Please enter your card information in your account to proceed"},
                                     status=status.HTTP_400_BAD_REQUEST)
                 if default_card:
                   stripe_customer = stripe.Customer.retrieve(default_card.stripe_customer_id)
                   print(stripe_customer)
                     
                 checkout_session = stripe.checkout.Session.create(
                     payment_method_types= ['card'],
                     customer= default_card.stripe_customer_id,
                     mode= 'payment',
                     line_items= [
                         {
                             'price_data':{
                                 "currency":"usd",
                                 "product_data":{
                                     "name":event.title,
                                     "images":[event.image] if event.image else [],
                                 },
                                 "unit_amount":int(event.price * 100)
                             },
                             "quantity": quantity
                         }
                     ],
                    metadata= {
                        'user_id': request.user.id,
                        "event_id": event.id,
                        "quantity": quantity
                    },
                    success_url= f"{settings.FRONTEND_URL}/success",
                    cancel_url=f"{settings.FRONTEND_URL}/eventDetail/{event.id}"
                 )
                 return Response({'url':checkout_session.url},status.HTTP_200_OK)
         except Event.DoesNotExist:
                return Response({"message":"event not found"},status=status.HTTP_404_NOT_FOUND)
         except Exception as e:
                return Response({"message":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class BookingPagination(PageNumberPagination):
      page_size = 10
      max_page_size = 10
      
      
class GetBookedEventByUserAPIView(ListAPIView):
      serializer_class = api_serializer.BookingSerializer
      permission_classes = [IsAuthenticated]
      queryset = Bookings.objects.select_related('booked_by','event').all()
      pagination_class = BookingPagination
      
      
      def get_queryset(self):
           return super().get_queryset().filter(user=self.request.user)
       
class GetBookedEventbyOrganizer(ListAPIView):
      serializer_class = api_serializer.BookingSerializer
      permission_classes = [IsAuthenticated,IsUserOrganizer]
      queryset = Bookings.objects.select_related('booked_by','event').all()
      pagination_class = BookingPagination
      
      def get_queryset(self):
           return super().get_queryset().filter(event__organizer=self.request.user)


class CancelBookedEventAPIView(GenericAPIView):
      permission_classes = [IsAuthenticated]
      
      def patch(self,request,booking_id):
          user = request.user
          try:
             booking = Bookings.objects.get(id=booking_id)
             if booking.booked_by != user:
                 return Response({"message":"You can only cancel your own booking"},status=status.HTTP_403_FORBIDDEN)
             booking.status = "Cancelled"
             booking.event.attendees.remove(user)
             booking.save()
             return Response({"message":"Booking Cancelled!"},status=status.HTTP_200_OK) 
          except Bookings.DoesNotExist:
              return Response({"message":"event does not event"},status=status.HTTP_404_NOT_FOUND)
          except IntegrityError:
              return Response({"message": "An error occurred while canceling the booking."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
          
      
        
     