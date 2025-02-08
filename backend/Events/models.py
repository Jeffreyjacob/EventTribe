from django.db import models
import uuid
from users.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal
# Create your models here.

class EventTypeOption(models.TextChoices):
          Free = "Free"
          Paid = "Paid"
      
class EventCategoryOption(models.TextChoices):
          
          Art_Exhibitions = "Art Exhibitions"
          Cultural_Festivals = "Cultural Festivals"
          Theater_Plays = "Theater Plays"
          Dance_Performances = "Dance Performances"
          Food_Festivals = "Food Festivals"
          Wine_Tastings = "Wine Tastings"
          Cooking_Classe = "Cooking Classes"
          Beer_Festivals = "Beer Festivals",
          Marathons = "Marathons"
          Yoga_Sessions = "Yoga Sessions"
          Fitness_Workshops = "Fitness Workshops"
          Sporting_Events = "Sporting Events"
          Conferences = "Conferences"
          Seminars = "Seminars"
          Networking_Events = "Network Events"
          Family_Friendly_Events = "Family-Friendly Events"
          Children_Workshops = "Children's Workshops"
          Kid_Friendly_Shows = "Kid-Friendly Shows"
          Educational_Activites = "Educational Activities"
          Tech_Conferences = "Tech Conferences"
          Hackathons = "Hackathons"
          Startup_Events = "Startup Events"
          Gadget_Expos ="Gadget Expos"
          Start_up_Comedy = "Start-up Comedy"
          Improve_Nights = "Improve Nights"
          Comedy_Festivals = "Comedy Festivals"
          Magic_Shows = "Magic Shows"
          Fundraising_Events = "Fundraising Events"
          Charity_Galas = "Charity Galas"
          Benefit_Concerts = "Benefit Concerts"
          Auctions_Fundraisers = "Auctions & Fundraisers"
          Lectures_Talks = "Lectures & Talks"
          Workshops = "Workshops"
          Educational_Seminars = "Educational Seminars"
          Skill_Building_Sessions = "Skill-Building Sessions"
          City_Tours = "City Tours"
          Adventure_Travel = "Adventure Travel"
          Cultural_Experiences = "Cultural Experiences"
          Cruise_Vacations = "Cruise Vacations"


class Event(models.Model):      
      id = models.UUIDField(primary_key=True,default=uuid.uuid4)
      organizer = models.ForeignKey(User,on_delete=models.CASCADE,related_name="event")
      title = models.CharField(max_length=300)
      description = models.TextField()
      start_date = models.DateTimeField()
      end_date = models.DateTimeField()
      location = models.CharField(max_length=300)
      category = models.CharField(max_length=200,choices=EventCategoryOption.choices)
      eventType = models.CharField(max_length=20,choices=EventTypeOption.choices)
      price = models.DecimalField(decimal_places=2,max_digits=10,validators=[MinValueValidator(Decimal('0.00'))])
      image = models.CharField(max_length=350)
      capacity = models.PositiveIntegerField()
      favorited = models.ManyToManyField(User,related_name="FavoriteEvent")
      attendees = models.ManyToManyField(User,related_name="eventbooked")
      created_at = models.DateTimeField(auto_now_add=True)
      
      
      def __str__(self):
           return f"{self.title}"
       
      def save(self, *args, **kwargs):
         
         if self.eventType == EventTypeOption.Free:
             self.price = 0.00
             
         super().save(*args, **kwargs)
         
         
class WaitingList(models.Model):
      
      id = models.UUIDField(primary_key=True,default=uuid.uuid4)
      user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="userWaitingList")
      event = models.ForeignKey(Event,on_delete=models.CASCADE,related_name="EventWaitingList")
      created_at = models.DateTimeField(auto_now_add=True)
      
      class Meta:
          unique_together = ('event', 'user')
          ordering = ['created_at']
      
      def __str__(self):
            return f"{self.event.title} waiting list {self.id}"
        
      