from rest_framework import serializers
from .models import Bookings,Ticket
from Events.models import Event
from django.shortcuts import get_object_or_404


class TicketSerializer(serializers.ModelSerializer):
      class Meta:
          model = Ticket
          fields = ["id","qrcode"," ticket_image"]
          
class EventSerializer(serializers.ModelSerializer):
      class Meta:
          model = Event
          fields = [
              'id',
               'title',
               'organizer',
               'description', 
               'start_date',
               'end_date',
               'location',
               'category',
               'eventType',
               'price',
               'image',
               'attendees',
               'organizer'
          ]

class BookingSerializer(serializers.ModelSerializer):
       ticket = TicketSerializer()
       event = EventSerializer()
       class Meta:
           model = Bookings
           fields = [
               "id",
               "event",
               "booked_by",
               "quantity",
               "status",
               "created_at",
               "ticket"
           ]
           
class CreateBookingSerializer(serializers.ModelSerializer):
        
        class Meta:
            model = Bookings
            fields = ["event","quanity"]
            
        def validate(self, attrs):
              required_fields = ["event","quanity"]
              
              for field in required_fields:
                  if field  not in attrs or not attrs[field]:
                      raise serializers.ValidationError(f"{field} is required")

              return super().validate(attrs)
        
        def create(self, validated_data):
             user = self.context["request"].user
             event = Event.objects.get(id=validated_data['event'])
             booking = Bookings.objects.create(
                 event = event,
                 booked_by = user,
                 quantity = validated_data['quantity']
             )
             booking.save()
             return booking
           
           
class CreateCheckoutSerializer(serializers.Serializer):
       quantity = serializers.IntegerField(required=True)
       event = serializers.CharField(min_length=1,required=True)
       class Meta:
           fields = [
               "quantity",
               "event"
           ]
           
           
