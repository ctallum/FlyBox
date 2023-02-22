#include "events.h"


Time* ConvertTime(unsigned int day, unsigned int hour, unsigned int min){
  struct Time* time = (struct Time*)malloc(sizeof(struct Time));

  time->day = day;
  time->hour = hour;
  time->min = min;

  return time;
}

Event* NewEvent(int device, int frequency, Time* start, Time* stop) {
  struct Event* event = (struct Event*)malloc(sizeof(struct Event));

  event->device = device;
  event->frequency = frequency;
  event->start = start;
  event->stop = stop;
  event->is_active = false;

  return event;
}

EventNode* NewEventNode(Event* event) {
  struct EventNode* node = (struct EventNode*)malloc(sizeof(struct EventNode));

  node->current = event;
  node->next = NULL;

  return node;
}

EventList* NewEventList() {
  struct EventList* list = (struct EventList*)malloc(sizeof(struct EventList));

  list->root = NULL;
  list->n_events = NULL;

  return list;
}

void AddEvent(EventList* s, EventNode* n) {
  if (s->root == NULL) {
    s->root = n;
  } else {
    EventNode* current_node = s->root;
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
      int frequency = doc["frequency"];
      unsigned int start_day = doc["start_day"];
      unsigned int start_hour = doc["start_hour"];
      unsigned int start_min = doc["start_min"];

      unsigned int end_day = doc["end_day"];
      unsigned int end_hour = doc["end_hour"];
      unsigned int end_min = doc["end_min"];

      Time* time_start = ConvertTime(start_day, start_hour, start_min);
      Time* time_stop = ConvertTime(end_day, end_hour, end_min);

      Event* event = NewEvent(device, frequency, time_start, time_stop);
      EventNode* event_node = NewEventNode(event);

      AddEvent(FlyBoxEvents, event_node);

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