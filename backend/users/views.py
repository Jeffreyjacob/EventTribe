from rest_framework.response import Response
from rest_framework import status
import stripe.error
from users import serializers as api_serializer
from .utils import send_email_verification_code_task
from .models import EmailVerification,User,Profile,Organizer,CreditCard
from rest_framework.generics import GenericAPIView,ListAPIView,UpdateAPIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.utils.timezone import now,timedelta
from .permissions import IsUserOwnProfile
from Events.models import Event
from Events.serializers import EventSerializer
from rest_framework.pagination import PageNumberPagination
import stripe
from django.conf import settings


# Create your views here.
stripe.api_key = settings.STRIPE_SECRET_KEY

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
           
              
class AddCreditCardView(GenericAPIView):
    
    permission_classes = [IsAuthenticated]
    
    
    def post(self,request,*args,**kwargs):
        user = request.user
        stripe_token = request.data.get("stripe_token")
        
        if not stripe_token:
            return Response({"error":"Stripe token is required"})
        
        try:
            latest_card = CreditCard.objects.filter(user=user).order_by("-created_at").first()
            stripe_customer_id = latest_card.stripe_customer_id if latest_card else None
            
            if not stripe_customer_id:
                customer =  stripe.Customer.create(email=user.email)
                stripe_customer_id = customer.id
                
            payment_method = stripe.PaymentMethod.create(
                type="card",
                card={"token":stripe_token}
            )
            
            stripe.PaymentMethod.attach(payment_method.id,customer=stripe_customer_id)
            card = stripe.PaymentMethod.retrieve(payment_method.id).card
            
            is_first_card = CreditCard.objects.filter(user=user).count() == 0
            
            creditCard = CreditCard.objects.create(
                user=user,
                stripe_customer_id = stripe_customer_id,
                stripe_payment_method =payment_method.id,
                last4 = card.last4,
                exp_month = card.exp_month,
                exp_year = card.exp_year,
                brand = card.brand,
                is_default = (CreditCard.objects.filter(user=user).count() == 0)
            )
            if is_first_card or creditCard.is_default:
                stripe.Customer.modify(
                    stripe_customer_id,
                    invoice_settings={"default_payment_method": payment_method.id}
                )

            return Response(api_serializer.CreditCardSerializer(creditCard).data,status=status.HTTP_201_CREATED)
        except stripe.error.StripeError as e:
            return Response({"error":str(e)},status=status.HTTP_400_BAD_REQUEST)
       
    
    

class ListCreditCardView(ListAPIView):
     permission_classes = [IsAuthenticated]
     serializer_class = api_serializer.CreditCardSerializer
     queryset = CreditCard.objects.select_related("user").all()
     
     def get_queryset(self):
          return super().get_queryset().filter(user=self.request.user)


class SetDefaultCreditCardView(GenericAPIView):
     permission_classes = [IsAuthenticated]
     
     def patch(self,request,card_id):
         user = request.user
         
         try:
           card = CreditCard.objects.get(id=card_id,user=user)
           CreditCard.objects.filter(user=user,is_default=True).update(is_default=False)
           card.is_default = True
           card.save()  
           
           stripe.Customer.modify(
                card.stripe_customer_id,
                invoice_settings={"default_payment_method": card.stripe_payment_method}
            )
           return Response({"message":"set to default card"})
         except CreditCard.DoesNotExist:
             return Response({"error":"Card not found"},status=status.HTTP_400_BAD_REQUEST)
                            
       
       
class DeleteCreditCardView(GenericAPIView):
    
     permission_classes = [IsAuthenticated]
     
     def delete(self,request,card_id):
         user = request.user
         
         try:
             card = CreditCard.objects.get(id=card_id,user=user)
             
             if card.is_default and CreditCard.objects.filter(user=user).count > 1:
                 return Response({"error":"Set another default card before delete"},status=status.HTTP_400_BAD_REQUEST)
             
             stripe.PaymentMethod.detach(card.stripe_payment_method)
             card.delete()
             return Response({"message":"Card deleted successfully!"})
         except CreditCard.DoesNotExist:
             return Response({"error":"Card not found"},status=status.HTTP_400_BAD_REQUEST)