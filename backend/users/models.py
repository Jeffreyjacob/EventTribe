from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from rest_framework_simplejwt.tokens import RefreshToken
import random
import string
from django.utils.timezone import now,timedelta
# Create your models here.

class UserManager(BaseUserManager):
    
    def create(self,full_name,email,password=None,role="User"):
        if not email:
            raise ValueError("email is required")
        email = self.normalize_email(email)
        email = email.lower()
        user = self.model(
            full_name = full_name,
            email = email,
            role = role
        )   
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self,full_name,email,password=None):
        user = self.create(
            full_name= full_name,
            email= email,
            password = password
        )
        user.is_superuser = True
        user.is_staff = True
        user.is_verified = True
        user.save(using=self._db)
        return user
    
    
class User(AbstractBaseUser,PermissionsMixin):
      
      class RoleStatus(models.TextChoices):
           USER = 'User',
           ORGANIZER = 'Organizer'
           
      
      full_name = models.CharField(max_length=255)
      email = models.EmailField(unique=True,max_length=300)
      role = models.CharField(max_length=100,choices=RoleStatus.choices,default=RoleStatus.USER)
      is_active = models.BooleanField(default=True)
      is_verified = models.BooleanField(default=False)
      is_staff = models.BooleanField(default=False)
      created_at = models.DateTimeField(auto_now_add=True)
      updated_at = models.DateTimeField(auto_now=True)
      
      USERNAME_FIELD = 'email'
      REQUIRED_FIELDS = ['full_name']
      
      objects = UserManager()
      
      def __str__(self):
           return f"{self.email}"
       
      @property
      def get_full_name(self):
          return f"{self.full_name}"
      
      @property
      def get_role(self):
          return f"{self.role}"
      
      def token(self):
          refresh = RefreshToken.for_user(self)
          return {
              'refresh':str(refresh),
              'access': str(refresh.access_token)
          }
          


class Profile(models.Model):
    class GenderChoices(models.TextChoices):
          MALE = 'Male'
          FEMALE = 'Female'
    
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="profile")
    gender = models.CharField(max_length=200,choices=GenderChoices.choices,blank=True,null=True)
    image = models.CharField(max_length=500,blank=True,null=True)
    interest = models.JSONField(default=list, blank=True)
    dob = models.DateField(blank=True,null=True)
    address = models.CharField(max_length=300,blank=True,null=True)
    phone_number = models.CharField(max_length=20,blank=True,null=True)
    
    
    def __str__(self):
         return f"{self.user.full_name}"

class EmailVerification(models.Model):
    
      user = models.ForeignKey(User,on_delete=models.CASCADE)
      code = models.CharField(max_length=6,unique=True,editable=False)
      created_at = models.DateTimeField(auto_now_add=True)
      expires_at = models.DateTimeField()
      
      def save(self,*args, **kwargs):
          if not self.code:
              self.code = self.generate_code()
          if not self.expires_at:
              self.expires_at = now() + timedelta(hours=1)
          return super().save(*args, **kwargs)
      
      def is_expired(self):
          return now() > self.expires_at
      
      def generate_code(self):
          """ Generate 6 digit code """
          return "".join(random.choices(string.digits,k=6))
      
      def __str__(self):
           return f"{self.user.full_name} - passcode"
       
       
class Organizer(models.Model):
     user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="organizer")
     followers = models.ManyToManyField(User,related_name="following")
     created_at = models.DateTimeField(auto_now_add=True)
     
     def __str__(self):
          return f"{self.user.email} organizer"
      

class CreditCard(models.Model):
      
      user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="creditcard")
      stripe_customer_id = models.CharField(max_length=255)
      stripe_payment_method = models.CharField(max_length=255,unique=True)
      last4 = models.CharField(max_length=4)
      exp_month = models.IntegerField()
      exp_year = models.IntegerField()
      brand = models.CharField(max_length=50)
      created_at = models.DateTimeField(auto_now_add=True)
      is_default = models.BooleanField(default=False)
      
      def __str__(self):
           return f"{self.user.email} - {self.brand} **** {self.last4}"
       
      def save(self,*args,**kwargs):
          if self.is_default:
              CreditCard.objects.filter(user=self.user,is_default=True).update(is_default=False)
          super().save(*args,**kwargs)
          




     
        

