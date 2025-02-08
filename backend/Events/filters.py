import django_filters
from .models import Event,EventTypeOption,EventCategoryOption

class EventFilter(django_filters.FilterSet):
      eventType = django_filters.ChoiceFilter(field_name='eventType',choices = EventTypeOption,label="eventType"),
      category = django_filters.ChoiceFilter(field_name="category",choices=EventCategoryOption,label="category"),
      location = django_filters.CharFilter(field_name="location",lookup_expr="icontains",label="location")
      date = django_filters.CharFilter(field_name='created_at',lookup_expr="lte",label="date")
      
      class Meta:
          model = Event
          fields = [
              'eventType',
              'category',
              'location',
              'date'
          ]