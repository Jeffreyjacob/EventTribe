from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from .models import Event


@receiver(m2m_changed,sender=Event.attendees.through)
def move_user_from_waiting_list(sender,instance,action,**kwargs):
      if action == "post_remove":
          if instance.attendees.count() < instance.capacity:
              waiting_list_entry = instance.EventWaitingList.first()
              if waiting_list_entry:
                  instance.attendees.add(waiting_list_entry)
                  waiting_list_entry.delete()
              
          