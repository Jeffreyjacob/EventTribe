from django.db import models
from users.models import User
from Events.models import Event
import uuid
import qrcode
from io import BytesIO
import cloudinary
import cloudinary.uploader


# Create your models here.

class BookingStatus(models.TextChoices):
      PENDING = "Pending"
      BOOKED = "Booked"
      CANCELLED = "Cancelled"

class Bookings(models.Model):
    
     id  = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
     event = models.ForeignKey(Event,on_delete=models.SET_NULL,null=True,related_name="bookings")
     booked_by = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,related_name="bookings")
     quantity = models.PositiveIntegerField()
     status = models.CharField(max_length=100,choices=BookingStatus.choices,default=BookingStatus.PENDING)
     created_at = models.DateTimeField(auto_now_add=True)
     
     def __str__(self):
           return f"{self.event} booked by ${self.booked_by.full_name}"
       
     @property  
     def total_price(self): 
         return self.quantity * self.event.price
    
class Ticket(models.Model):
      id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
      booking = models.OneToOneField(Bookings,on_delete=models.CASCADE,related_name="ticket")
      qr_code = models.URLField(blank=True, null=True)  # Changed to URLField
      ticket_image = models.URLField(blank=True, null=True) 
      created_at = models.DateTimeField(auto_now_add=True)
    
     
      def __str__(self):
           return f"{self.id}"
       
      def generate_qr_code(self):
          qr = qrcode.make(str(self.id))
          buffer = BytesIO()
          qr.save(buffer,format="PNG")
          buffer.seek(0)
          cloudinaryUrl = cloudinary.uploader.upload(buffer,folder="qr_codes/")
          self.qr_code = cloudinaryUrl['secure_url']
        
      
      def generate_ticket_image(self):
          from .utils import generate_ticket
          ticket_file = generate_ticket(self)
          cloudinaryUrl = cloudinary.uploader.upload(ticket_file)
          self.ticket_image = cloudinaryUrl['secure_url']
          
          
      
      def save(self,*agrs,**kwargs):
          if not self.qr_code:
              self.generate_qr_code()
          if not self.ticket_image:
              self.generate_ticket_image()
          super().save(*agrs,**kwargs)
          
           