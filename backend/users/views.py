from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from users import serializers as api_serializer
from .utils import send_email_verification_code_task
from .models import EmailVerification,User,Profile,Organizer
from rest_framework.generics import GenericAPIView,ListAPIView,UpdateAPIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.utils.timezone import now,timedelta
from .permissions import IsUserOwnProfile,IsUserOrganizer
from Events.models import Event
from Events.serializers import EventSerializer
from rest_framework.pagination import PageNumberPagination

# Create your views here.


class RegisterAPIView(GenericAPIView):
    serializer_class = api_serializer.RegisterUserSerializer
    permission_classes = [AllowAny]
    
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            EmailVerification.objects.create(user=user)                
            send_email_verification_code_task(user.id)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
            
        if 'email' in serializer.errors:
            return Response({"message": serializer.errors['email'][0]}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        

class EmailVerificationAPIView(GenericAPIView):
      serializer_class = api_serializer.EmailVerificationSerializer
      permission_classes = [AllowAny]
      
      def post(self,request):
          serializer = self.serializer_class(data=request.data)
          if serializer.is_valid(raise_exception=True):
              code = serializer.validated_data.get('code')
              try:
                 verification = EmailVerification.objects.get(code=code)
                 user = verification.user
                 
                 if verification.is_expired():
                     return Response({"message":"your code is expired"},status=status.HTTP_400_BAD_REQUEST)
                 
                 updateUser = User.objects.get(id=user.id)
                 updateUser.is_verified = True
                 updateUser.save()
                 
                 verification.delete()
                 
                 return Response({"message":"Email has been verified successfully!"},status=status.HTTP_200_OK)
                 
              except EmailVerification.DoesNotExist:
                  return Response({"message":"invalid code"},status=status.HTTP_400_BAD_REQUEST)
              
              
              
class ResendEmailVerificationCodeAPIView(GenericAPIView):
      serializer_class = api_serializer.ResendEmailVerificationSerializer
      def post(self,request):
          serializer = self.serializer_class(data=request.data)
          if serializer.is_valid(raise_exception=True):
              email = serializer.validated_data.get("email")
              try:
                 user = User.objects.get(email=email)
                 if user.is_verified:
                     return Response({"message":"Email is already very verified"},status=status.HTTP_400_BAD_REQUEST)
                 verification,created = EmailVerification.objects.get_or_create(user=user)
                 
                 if not created:
                     verification.code = verification.generate_code()
                     verification.expires_at = now() + timedelta(hours=1)
                     verification.save()
                     
                 send_email_verification_code_task(user.id)
                 return Response({"message":"A new verification code has been sent to your email."},status=status.HTTP_200_OK)    
                 
              except User.DoesNotExist:
                  return Response({"message":'User does not exist'},status=status.HTTP_400_BAD_REQUEST)    
              
              
class LoginAPIView(GenericAPIView):
      serializer_class = api_serializer.LoginSerializer
      def post(self,request):
          serializer = self.serializer_class(data=request.data)
          serializer.is_valid(raise_exception=True)
          return Response(serializer.data,status=status.HTTP_200_OK)
      
      
      
class ForgetPasswordAPIView(GenericAPIView):
      serializer_class = api_serializer.ForgetPasswordSerializer
      def post(self,request):
          serializer = self.serializer_class(data=request.data)
          if serializer.is_valid(raise_exception=True):
              return Response({"message":"a link has been sent to your email to reset your password"}
                    ,status=status.HTTP_200_OK)
              
class SetNewPasswordAPIView(GenericAPIView):
       serializer_class = api_serializer.SetNewPasswordSerializer
       def patch(self,request):
           serializer = self.serializer_class(data=request.data)
           serializer.is_valid(raise_exception=True)
           return Response({"message":"Your Password has been reset successfully!"}
,status=status.HTTP_200_OK)
           
           
class GetUserProfileAPIView(GenericAPIView):
     serializer_class = api_serializer.ProfileSerializer
     pagination_class = [IsUserOwnProfile]
     
     def get(self,request):
         user = request.user
         try:
            profile = Profile.objects.get(user=user) 
         except Profile.DoesNotExist:
             return Response({"message":"User does not exist"})
         
         serializer = self.serializer_class(profile)
         return Response(serializer.data,status=status.HTTP_200_OK)
     

class UpdateUserProfileAPIView(UpdateAPIView):
      serializer_class = api_serializer.EditProfileSerializer
      permission_classes = [IsUserOwnProfile]
      queryset = Profile.objects.all()
      
      def get_object(self):
            return self.request.user.profile
        
class UpdateUserInterestAPIView(GenericAPIView):
     permission_classes = [IsUserOwnProfile]
     serializer_class = api_serializer.UpdateUserInterestSerializer
     
     def patch(self,request):
        profile = request.user.profile
        serializer= self.serializer_class(profile,data=request.data,partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"message":"Interested updated","data":serializer.data},status=status.HTTP_200_OK)
        return Response({"message":serializer.errors},status=status.HTTP_400_BAD_REQUEST)
         
     
        
class UserFollowOrganizer(GenericAPIView):
      permission_classes = [IsAuthenticated]
      
      def post(self,request,organizerId):
          user = request.user
          try:
              userOrganizer = User.objects.get(id=organizerId)
              organizer = Organizer.objects.get(user=userOrganizer)
              if user in organizer.followers.all():
                  organizer.followers.remove(user)
                  return Response({"message":"you unfollow organizer"},status=status.HTTP_200_OK)
              else:
                  organizer.followers.add(user)
                  return Response({"message":"you follow organizer"},status=status.HTTP_200_OK)
                  
              
          except User.DoesNotExist:
              return Response({"message":"user does not exist"}) 
          
class OrgaizerPagination(PageNumberPagination):
       page_size = 10
       max_page_size = 10

class  GetOrganizerListAPIView(ListAPIView):
       serializer_class = api_serializer.OrganizerSerializer
       permission_classes = [AllowAny]
       queryset = Organizer.objects.select_related('user').all()
       pagination_class = OrgaizerPagination
       
          
class GetOrganizerDetailAPIView(GenericAPIView):
       permission_classes = [AllowAny]
       serializer_class = api_serializer.OrganizerSerializer
       
       def get(self,request,organizerId):
           try:
               user = User.objects.get(id=organizerId)
               organizer = Organizer.objects.get(user=user)
               events = Event.objects.filter(organizer=user)
               
               organizerserializer = self.serializer_class(organizer)
               eventserializer = EventSerializer(events,many=True)
               
               return Response({
                   'organizer':organizerserializer.data,
                   'events':eventserializer.data
               },status=status.HTTP_200_OK)
               
           except User.DoesNotExist:
               return Response({"message":"user with organizer id does not exist"})
               

class LogoutAPIView(GenericAPIView):
      permission_classes = [IsAuthenticated]
      serializer_class = api_serializer.LogoutSerializer
      
      def post(self,request):
          serializer = self.serializer_class(data=request.data)
          serializer.is_valid(raise_exception=True)
          serializer.save()
          return Response({"message":"User logged out"},status=status.HTTP_204_NO_CONTENT)
           
              
              