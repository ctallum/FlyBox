#include "firmware.h"




Event* NewEvent(int device, int frequency, int intensity, bool sunset, Time* start, Time* stop) {
  struct Event* event = (struct Event*)malloc(sizeof(struct Event));

  event->device = device;
  event->frequency = frequency;
  event->intensity = intensity;
  event->sunset = sunset;
  event->start = start;
  event->stop = stop;
  event->is_active = false;
  event->next = NULL;

  return event;
}

EventList* NewEventList() {
  struct EventList* list = (struct EventList*)malloc(sizeof(struct EventList));

  list->root = NULL;
  list->n_events = NULL;

  return list;
}

void AddEvent(EventList* s, Event* n) {
  if (s->root == NULL) {
    s->root = n;
  } else {
    Event* current_node = s->root;
    while (current_node->next != NULL) {
      current_node = current_node->next;
    }
    current_node->next = n;
  }
  s->n_events++;
}

EventList* DecodeFile(const char* filename) {
  EventList* FlyBoxEvents = NewEventList();
  StaticJsonDocument<512> doc;

  File myFile = SD.open(filename);
  if (myFile) {

    myFile.find("[");
    do {
      DeserializationError error = deserializeJson(doc, myFile);
      if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
      }

      int device = doc["group"];
      
      unsigned int start_day = doc["start_day"];
      unsigned int start_hour = doc["start_hour"];
      unsigned int start_min = doc["start_min"];

      unsigned int end_day = doc["end_day"];
      unsigned int end_hour = doc["end_hour"];
      unsigned int end_min = doc["end_min"];
      int intensity = doc["intensity"];
      int frequency = doc["frequency"];
      bool sunset = (doc["sunset"] == "true");

      Time* time_start = ConvertTime(start_day, start_hour, start_min);
      Time* time_stop = ConvertTime(end_day, end_hour, end_min);

      Event* event = NewEvent(device, frequency, intensity, sunset, time_start, time_stop);
      AddEvent(FlyBoxEvents, event);

    } while (myFile.findUntil(",", "]"));
  }
  return FlyBoxEvents;
}

void check_for_event_start(Event* event, DateTime now, int days_elapsed){
    int cur_hour = now.hour();
    int cur_min = now.minute();

    Time* start = event->start;

    if (start->day == days_elapsed && start->hour == cur_hour && start->min == cur_min){
        event->is_active = true;
    }
}

void check_for_event_end(Event* event, DateTime now, int days_elapsed){
    int cur_hour = now.hour();
    int cur_min = now.minute();

    Time* stop = event->stop;

    if (stop->day == days_elapsed && stop->hour == cur_hour && stop->min == cur_min){
        event->is_active = false;
    }
}

void check_to_run_event(Event* event, DateTime now, int days_elapsed){
  int cur_hour = now.hour();
  int cur_min = now.minute();
  
  Time * start = event->start;
  Time * stop = event->stop;

  int global_min = days_elapsed * 1440 + cur_hour * 60 + cur_min;
  int global_start_min = start->day * 1400 + start->hour * 60 + start->min;
  int global_end_min = stop->day * 1400 + stop->hour * 60 + stop->min;

  if (global_min >= global_start_min && global_min < global_end_min){
    event->is_active = true;
  } else { 
    event->is_active = false;
  }
}