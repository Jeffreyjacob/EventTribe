from rest_framework import serializers
from .models import User,Profile,Organizer
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from .utils import send_reset_pasword_email_task,generate_url
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.utils.encoding import smart_bytes,force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
import cloudinary
import cloudinary.uploader
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken 


class RegisterUserSerializer(serializers.ModelSerializer):
      password = serializers.CharField(min_length=7,write_only=7)
      class Meta:
          model = User
          fields = [
              'full_name',
              'email',
              'password',
              'role'
          ]
      def validate(self, attrs):
           required_fields = ['email','password','full_name','role']
           for field in required_fields:
               if field not in attrs:
                   raise serializers.ValidationError({"message":f"{field} is required"})
           return super().validate(attrs)
      
      def validate_email(self, value):
           if User.objects.filter(email=value).exists():
               raise serializers.ValidationError({"message":"Email already exist"})
           return value
       
      def create(self, validated_data):
          user = User.objects.create(
              email = validated_data['email'],
              full_name = validated_data['full_name'],
              role = validated_data['role']
          )
          user.set_password(validated_data['password'])
          user.save()
          return user
      

class EmailVerificationSerializer(serializers.Serializer):
      code = serializers.CharField(max_length=6,required=True)
      class Meta:
          fields = ['code']

class ResendEmailVerificationSerializer(serializers.Serializer):
      email = serializers.EmailField(max_length=300,required=True)
      class Meta:
          fields = ['email']
          
class LoginSerializer(serializers.ModelSerializer):
      email = serializers.EmailField()
      password = serializers.CharField(min_length=7,write_only=True)
      full_name = serializers.CharField(max_length=300,read_only=True)
      access_token = serializers.CharField(max_length=350,read_only=True)
      refresh_token = serializers.CharField(max_length=350,read_only=True)
      is_verified = serializers.BooleanField(read_only=True)
      id = serializers.IntegerField(read_only=True)
      role = serializers.CharField(read_only=True)
      
      class Meta:
          model = User
          fields = [
              'email',
              'full_name',
              'password',
              'access_token',
              'refresh_token',
              'is_verified',
              'id',
              'role'
          ]
          
      def validate(self, attrs):
            email = attrs['email']
            password = attrs['password']
            
            user = authenticate(email=email,password=password)
            if not user:
                raise AuthenticationFailed({"message":"invalid credentials,try again"})
            
            user_token = user.token()
            return {
                'id':user.id,
                'email':user.email,
                'full_name':user.get_full_name,
                'role': user.get_role,
                'is_verified': user.is_verified,
                'access_token':str(user_token.get('access')),
                'refresh_token': str(user_token.get('refresh'))
            }
            
class ForgetPasswordSerializer(serializers.Serializer):
        email = serializers.EmailField(required=True)
        class Meta:
            fields = ['email']
        
        def validate(self, attrs):
            email = attrs['email']
            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=email)
                uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                token = PasswordResetTokenGenerator().make_token(user)
                abslink = generate_url(uidb64,token)
                send_reset_pasword_email_task(user.email,abslink,user.full_name)
                
            return super().validate(attrs)
        
        
class SetNewPasswordSerializer(serializers.Serializer):
        uidb64 = serializers.CharField(write_only=True,required=True)
        token = serializers.CharField(write_only=True,required=True)
        password = serializers.CharField(min_length=7,write_only=True,required=True)
        confirmPassword =  serializers.CharField(min_length=7,write_only=True,required=True)
        
        class Meta:
            fields = ['uidb64','token','password','confirmPassword']
            
        def validate(self, attrs):
             token = attrs.get('token')
             uidb64 = attrs.get('uidb64')
             password = attrs.get('password')
             confirm_password = attrs.get('confirmPassword')
          
             user_id = force_str(urlsafe_base64_decode(uidb64))
             user = User.objects.get(id=user_id)
             if not PasswordResetTokenGenerator().check_token(user,token):
                raise serializers.ValidationError('reset link is invalid or has expired')
             if password != confirm_password:
                raise serializers.ValidationError({"message":'password do not match'})
             user.set_password(password)
             user.save()
             return user 
         
class UserSerializer(serializers.ModelSerializer):
      class Meta:
          model = User
          fields = [
              'id',
              'email',
              'full_name',
              'role'
          ]
          
class ProfileSerializer(serializers.ModelSerializer):
      user = UserSerializer()
      class Meta:
          model = Profile
          fields = [
              'user',
              'gender',
              'image',
              'interest',
              'dob',
              'address',
              'phone_number',
          ]
    
    
class EditProfileSerializer(serializers.ModelSerializer):
      user = UserSerializer(read_only=True)
      image = serializers.CharField(max_length=200,read_only=True)
      updated_image = serializers.FileField(write_only=True,required=False)
      interest = serializers.ListField(child=serializers.CharField())
      class Meta:
          model = Profile
          fields = [
              'user',
              'gender',
              'image',
              'interest',
              'dob',
              'address',
              'phone_number',
              'updated_image'
          ]
            
      def update(self, instance, validated_data):
           updated_image = validated_data.pop('updated_image',None)
           if updated_image:
               try:
                   cloudinaryResponse = cloudinary.uploader.upload(updated_image)
                   cloundinaryUrl = cloudinaryResponse.get('secure_url')
                   instance.image = cloundinaryUrl
               except Exception as e:
                   raise serializers.ValidationError({"message":f"Image upload failed: {str(e)}"})
               
           for attr,value in validated_data.items():
               setattr(instance,attr,value)
           instance.save()
           return instance
       
class UpdateUserInterestSerializer(serializers.ModelSerializer):
       class Meta:
           model = Profile
           fields = [
               "interest"
           ]
       
class LogoutSerializer(serializers.Serializer):
      refresh = serializers.CharField()
          
      default_error_messages = {
          'bad_token':{'token is expired or invalid'}
      }
      
      def validate(self, attrs):
           self.token = attrs['refresh']
           return super().validate(attrs)
       
      def save(self, **kwargs):
          try:
            RefreshToken(self.token).blacklist()
          except InvalidToken as e:
            self.fail('bad token')


            
class OrganizerSerializer(serializers.ModelSerializer):
      user = UserSerializer()
      class Meta:
          model = Organizer
          fields = [
              'user',
              'followers',
          ]
      