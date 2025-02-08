from django.contrib import admin
from .models import User,EmailVerification,Profile,Organizer

# Register your models here.

admin.site.register(User)
admin.site.register(EmailVerification)
admin.site.register(Profile)
admin.site.register(Organizer)
