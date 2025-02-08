from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User,Profile,Organizer


@receiver(post_save,sender=User)
def create_User_Profile(sender,instance,created,**kwargs):
    if created:
        Profile.objects.create(user=instance)
        if instance.role == "Organizer":
            Organizer.objects.create(user=instance)