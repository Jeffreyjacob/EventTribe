from rest_framework import serializers
from .models import Event
import cloudinary
import cloudinary.uploader


class CreateSerializer(serializers.ModelSerializer):
      uploaded_image = serializers.FileField(write_only=True,required=True)
      image = serializers.CharField(read_only=True)
      price = serializers.DecimalField(decimal_places=2,max_digits=10,required=False)
      
      class Meta:
          model = Event
          fields = [
              'title',
              'description', 
              'start_date',
              'end_date',
              'location',
              'category',
              'eventType',
              'price',
              'capacity',
              'image',
              'uploaded_image'
          ]
          
      def create(self, validated_data):
           user = self.context['request'].user
           uploadedImage = validated_data.pop('uploaded_image',None)
           cloudinary_url = None  
           
           if uploadedImage:
               allowed_format = ['image/png','image/jpeg','image/jpg']
               if hasattr(uploadedImage,'content_type') and uploadedImage.content_type not in allowed_format:
                   raise serializers.ValidationError({
                    "message": "Invalid image format. Please upload JPEG or PNG."
                    })
                   
               try:
                     upload_options = {
                     "folder": "events/",  # Organize images in folders
                     "resource_type": "image",
                     "allowed_formats": ["jpg", "png", "jpeg"],
                      }
                     cloudinary_response = cloudinary.uploader.upload(
                         uploadedImage,
                         **upload_options
                      )
                     cloudinary_url = cloudinary_response.get('secure_url')
               except Exception as e:
                    raise serializers.ValidationError({"message":f"failed to upload image: {str(e)}"})
          
           event = Event.objects.create(
               **validated_data,
               organizer=user,
               image = cloudinary_url
           )
           event.save()
           return event
           

class EditSerializer(serializers.ModelSerializer):
    uploaded_image = serializers.FileField(write_only=True,required=False)
    image = serializers.CharField(read_only=True)
    class Meta:
        model = Event
        fields = [
            'title',
            'description', 
            'start_date',
            'end_date',
            'location',
            'category',
            'eventType',
            'price',
            'capacity',
            'image',
            'uploaded_image'
        ]
        
        
class  EventSerializer(serializers.ModelSerializer):
       class Meta:
           model = Event
           fields = [
               'id',
               'title',
               'description', 
               'start_date',
               'end_date',
               'location',
               'category',
               'eventType',
               'price',
               'capacity',
               'image',
               'favorited',
               'attendees'
           ]
           
