#include "../../firmware.h"

extern int prev_day;
extern unsigned int days_elapsed;
extern unsigned int prev_time[3]; // for frequency things

Event* newEvent(int device, int frequency, int intensity, bool sunset, Time* start, Time* stop) {
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

EventList* newEventList() {
  struct EventList* list = (struct EventList*)malloc(sizeof(struct EventList));

  list->root = NULL;
  list->n_events = NULL;

  return list;
}

void addEvent(EventList* s, Event* n) {
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

EventList* decodeJSONFile(const char* filename) {
  EventList* FlyBoxEvents = newEventList();
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

      Time* time_start = convertTime(start_day, start_hour, start_min);
      Time* time_stop = convertTime(end_day, end_hour, end_min);

      Event* event = newEvent(device, frequency, intensity, sunset, time_start, time_stop);
      addEvent(FlyBoxEvents, event);

    } while (myFile.findUntil(",", "]"));
  } else {
    clearLCD();
    digitalWrite(IR_PIN, LOW);
    writeLCD("Error: No file found", 0,0);
    writeLCD("Press knob to",3,2);
    writeLCD("restart",6, 3);
    for (;;){
      if (knobIsPressed()){
        reset();
      }
    }
  }
  return FlyBoxEvents;
}

void checkToRunEvent(Event* event, Time* now, int days_elapsed){
  int cur_hour = now->hour;
  int cur_min = now->min;
  
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

void killEvent(PinStatus* Pins[3], int device){
  int pin = Pins[device]->Pin;
  ledcWrite(pin, 0);
  Pins[device]->is_on = false;
}

// Device is the JSON device group#, frequency is Hz
void runEvent(PinStatus *Pins[3], int device, int frequency, int intensity){
  
  int pwm_intensity = (pow(intensity, 3) / 1000000)* MAX_DUTY_CYCLE;

  int pin = Pins[device]->Pin;
  bool is_on = Pins[device]->is_on;
  if (frequency == 0){
    ledcWrite(pin, pwm_intensity);
    Pins[device]->is_on = true;
    return;
  } 
  else{
    
    unsigned long current_time = millis();
    int duration = 500/frequency;
    if (current_time - prev_time[device] >= duration){
      prev_time[device] = current_time;
      if (is_on){
        ledcWrite(pin, 0);
        Pins[device]->is_on = false;
      } else{
        Pins[device]->is_on = true;
        ledcWrite(pin, pwm_intensity);
      }
    }
  }
}

int getLongestEvent(EventList* events){
  int last_event_end = 0;
  Event* current_event = events->root;
  for (int i = 0; i < events->n_events; i++){
    Time* end_time = current_event->stop;
    int end_total_min = end_time->day*60*24 + end_time->hour*60 + end_time->min;
    if (end_total_min > last_event_end){
      last_event_end = end_total_min;
    }
    
    current_event = current_event->next;
  }
  return last_event_end;
}