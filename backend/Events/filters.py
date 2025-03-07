import django_filters
from .models import Event,EventTypeOption,EventCategoryOption

class EventFilter(django_filters.FilterSet):
      eventType = django_filters.ChoiceFilter(field_name='eventType',choices = EventTypeOption.choices,label="eventType")
      category = django_filters.ChoiceFilter(field_name="category",choices=EventCategoryOption.choices,label="category")
      location = django_filters.CharFilter(field_name="location",lookup_expr="icontains",label="location")
      date = django_filters.DateFilter(field_name='start_date',lookup_expr="gte",label="date")
      
      class Meta:
          model = Event
          fields = [
              'eventType',
              'category',
              'location',
              'date'
          ]
          

class OrganizerEventFilter(django_filters.FilterSet):
      
      title = django_filters.CharFilter(field_name="title",lookup_expr="icontains",label="title")