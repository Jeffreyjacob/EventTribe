from django.http import JsonResponse
import stripe
from django.conf import settings
import stripe.error
import stripe.webhook
from .models import Bookings,Ticket
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from Events.models import Event
from users.models import User
from django.core.mail import EmailMessage
from celery import shared_task
import requests
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives

stripe.api_key = settings.STRIPE_SECRET_KEY

# @shared_task
def send_ticket_email(user_id,event_id,quantity,ticket_img):
    user = get_object_or_404(User,id=user_id)
    event = get_object_or_404(Event,id=event_id)
    """Sends an email with ticket image."""
    Subject = "🎟 Your Event Ticket is Ready!"
    html_content = render_to_string('BookedEmail.html',{
        'username':user.full_name,
        'event_title':event.title,
        "event_location":event.location,
        "event_date":event.start_date,
        "event_quantity":quantity,
        "ticket_img": ticket_img
    })
    text_content = strip_tags(html_content)
    
    SendEmail = EmailMultiAlternatives(
        subject=Subject,
        body=text_content,
        to=[user.email]
    )
    
    SendEmail.content_subtype = 'html'
    SendEmail.attach_alternative(html_content,"text/html")
    try:
        response = requests.get(ticket_img)
        if response.status_code == 200:
            SendEmail.attach("ticket.png", response.content, "image/png")
    except requests.RequestException:
        print("⚠️ Could not download the ticket image")

    SendEmail.send(fail_silently=True)
    

def handle_checkout_session(session):
      metadata = session.get('metadata',{})
      user_id = metadata.get('user_id')
      event_id = metadata.get('event_id')
      quantity = metadata.get('quantity')
      
      event = get_object_or_404(Event,id=event_id)
      user = get_object_or_404(User,id=user_id)
      
      booking = Bookings.objects.create(
          event = event,
          booked_by = user,
          quantity = quantity,
          status = 'Booked' if session['payment_status'] == 'paid' else 'Cancelled'
      )
      booking.save()
      ticket =Ticket.objects.create(booking=booking)
      event.attendees.add(user)
      event.save()
      
      send_ticket_email(user_id,event.id,quantity,ticket.ticket_image)
      
      
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.headers.get('Stripe-signature','')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
    
    try:
        event = stripe.Webhook.construct_event(payload,sig_header,endpoint_secret)
    except ValueError:
        return JsonResponse({"error":"Invalid Payload "},status=400)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({"error":"Invalid signature"},status=400)
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_session(session)
        
    elif event['type'] == 'invoice.payment_failed':
         session = event['data']['object']
         user_id = session.get('metadata', {}).get('user_id')
         event_id = session.get('metadata', {}).get('event_id')
         
         if user_id and event_id:
            user = get_object_or_404(User, id=user_id)
            event = get_object_or_404(Event, id=event_id)

            # Send failure email
            subject = "❌ Payment Failed - Booking Unsuccessful"
            message = f"""
            Dear {user.full_name},

            Your payment for "{event.title}" has failed.

            Please try again. If you need help, contact support.

            Thank you.
            """
            email = EmailMessage(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
            email.send()
        
    return JsonResponse({"status":'success'})
      