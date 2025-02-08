from celery import shared_task
from .models import EmailVerification,User
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

# @shared_task
def send_email_verification_code_task(userid):
    user = User.objects.get(id=userid)
    verification = EmailVerification.objects.get(user=user)
    code = verification.code
    Subject = "Email Verification"
    html_content = render_to_string('EmailVerification.html',{
        'username':user.full_name,
        'code':code,
        'companyname':'EventTribe'
    })
    text_content = strip_tags(html_content)
    
    SendEmail = EmailMultiAlternatives(
        subject=Subject,
        body=text_content,
        to=[user.email]
    )
    
    SendEmail.content_subtype = 'html'
    SendEmail.attach_alternative(html_content,"text/html")
    SendEmail.send(fail_silently=True)
    

def generate_url(uidb64,token):
     frontend_url = settings.FRONTEND_URL
     reset_url = f"{frontend_url}/reset_password/{uidb64}/{token}"
     return reset_url
 
# @shared_task
def send_reset_pasword_email_task(email,reset_link,name):
    
    html_content = render_to_string('reset-email-password.html',{
        'reset_url': reset_link,
        'product_name': 'Event tribe',
        'name':name
    })
    
    plain_content = strip_tags(html_content)
    
    sendEmail = EmailMultiAlternatives(
        subject= "Password reset",
        body = plain_content,
        to = [email]
    )
    
    sendEmail.content_subtype = 'html'
    sendEmail.attach_alternative(html_content,'text/html')
    sendEmail.send(fail_silently=True)
     
    
    
    