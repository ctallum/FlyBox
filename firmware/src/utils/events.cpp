#include "../../firmware.h"

extern int previousDay;
extern unsigned int daysElapsed;

/**
 * @brief Allocate memory for a Event struct and populate the struct fields
 * 
 * @param device int value from 0-2. Red = 0, Green = 1, White = 2
 * @param frequency int value of the desired light strobe frequency in Hz
 * @param intensity int value of the desired light intensity, 0-100
 * @param sunset bool value of whether the lights should fade in and out
 * @param start Time* value containing start day, hour, and minute
 * @param stop Time* value containing end day, hour, and minute
 * @return Event* 
 */
Event* newEvent(int device, int frequency, int intensity, bool sunset, Time* start, Time* stop) {
  struct Event* event = (struct Event*)malloc(sizeof(struct Event));

  event->device = device;
  event->frequency = frequency;
  event->intensity = intensity;
  event->sunset = sunset;
  event->start = start;
  event->stop = stop;
  event->isActive = false;
  event->next = NULL;

  return event;
}

/**
 * @brief Create an empty linked list to hold events
 * 
 * @return EventList* 
 */
EventList* newEventList() {
  struct EventList* list = (struct EventList*)malloc(sizeof(struct EventList));

  list->root = NULL;
  list->nEvents = NULL;

  return list;
}

/**
 * @brief Add an event to the end of the linked list of events
 * 
 * @param eventList an EventList* linked list struct
 * @param newEvent an Event* struct
 */
void addEvent(EventList* eventList, Event* newEvent) {
  if (eventList->root == NULL) {
    eventList->root = newEvent;
  } else {
    Event* currentNode = eventList->root;
    while (currentNode->next != NULL) {
      currentNode = currentNode->next;
    }
    currentNode->next = newEvent;
  }
  eventList->nEvents++;
}

/**
 * @brief Parse the text file and interpert the JSON into event structs
 * 
 * @param filename char array of the desired text file 
 * @return EventList* A linked list of events that contains all of the inerperted JSON data
 */
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
      
      unsigned int startDay = doc["start_day"];
      unsigned int startHour = doc["start_hour"];
      unsigned int startMinute = doc["startMinute"];

      unsigned int endDay = doc["end_day"];
      unsigned int endHour = doc["end_hour"];
      unsigned int endMinute = doc["endMinute"];
      int intensity = doc["intensity"];
      int frequency = doc["frequency"];
      bool sunset = (doc["sunset"] == "true");

      Time* timeStart = setTimeStruct(startDay, startHour, startMinute);
      Time* timeStop = setTimeStruct(endDay, endHour, endMinute);

      Event* event = newEvent(device, frequency, intensity, sunset, timeStart, timeStop);
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

/**
 * @brief Checks to see if a certain event should run and sets event properties appropriatley 
 * 
 * @param event an Event* structure that contains the date and time of start and stop
 * @param now a Time* struct that contains the current date and time
 * @param daysElapsed int value of number of days elapsed since the start of the test
 * @return Void, function sets the value of the Event 'isActive' field
 */
void checkToRunEvent(Event* event, Time* now, int daysElapsed){
  int currentHour = now->hour;
  int currentMinute = now->min;
  
  Time * start = event->start;
  Time * stop = event->stop;

  int totalMinutesElapsed = daysElapsed * 1440 + currentHour * 60 + currentMinute;
  int eventStartMinute = start->day * 1400 + start->hour * 60 + start->min;
  int eventEndMinute = stop->day * 1400 + stop->hour * 60 + stop->min;

  if (totalMinutesElapsed >= eventStartMinute && totalMinutesElapsed < eventEndMinute){
    event->isActive = true;
  } else { 
    event->isActive = false;
  }
}

/**
 * @brief Kills an event and ensures that the light is off
 * 
 * @param Pins A PinStatus object that contains all the info on the pin
 * @param device The light that we want to turn off. 0 = Red, 1 = Green, 2 = White
 */
void killEvent(PinStatus* Pins[3], int device){
  int pin = Pins[device]->pinNumber;
  ledcWrite(pin, 0);
  Pins[device]->isCurrentlyOn = false;
}


/**
 * @brief Run an event
 * 
 * @param Pins A PinStatus object that contains all the info on the pins
 * @param event An Event* object that contains information on the current event to run
 */
void runEvent(PinStatus *Pins[3], Event* event){
  int device = event->device;
  int frequency = event->frequency;
  int intensity = event->intensity;
  bool sunset = event->sunset; 
  int pin = Pins[device]->pinNumber;
  bool pinIsON = Pins[device]->isCurrentlyOn;
  
  int pwmIntensity = (pow(intensity, 3) / 1000000)* MAX_DUTY_CYCLE;

  if (frequency == 0){
    ledcWrite(pin, pwmIntensity);
    Pins[device]->isCurrentlyOn = true;
    return;
  } 
  else{
    Serial.println(pin);
    Serial.println(Pins[device]->pinNumber);
    unsigned long currentTimeMillis = millis();
    int duration = 500/frequency;
    if (currentTimeMillis - Pins[device]->lastTimeOn >= duration){
      Pins[device]->lastTimeOn = currentTimeMillis;
      if (pinIsON){
        ledcWrite(pin, 0);
        Pins[device]->isCurrentlyOn = false;
      } else{
        Pins[device]->isCurrentlyOn = true;
        ledcWrite(pin, pwmIntensity);
      }
    }
  }
}

/**
 * @brief Get the minute for the end of the final event for % done indicator
 * 
 * @param events A linked list of all of the flybox events
 * @return int minute total of last eventof the final event end time
 */
int getLastEventEnd(EventList* events){
  int lastEventEnd = 0;
  Event* currentEvent = events->root;
  for (int i = 0; i < events->nEvents; i++){
    Time* currentEventEndTime = currentEvent->stop;
    int currentEventEndMinute = currentEventEndTime->day*60*24 + currentEventEndTime->hour*60 + currentEventEndTime->min;
    if (currentEventEndMinute > lastEventEnd){
      lastEventEnd = currentEventEndMinute;
    }
    
    currentEvent = currentEvent->next;
  }
  return lastEventEnd;
}

/**
 * @brief Get the minute for the start of the first event for the % done indicator
 * 
 * @param events A linked list of all of the flybox events
 * @return int munute total of the first event start time
 */
int getFirstEventStart(EventList* events){
  int earliestEventStart = 100000000;
  Event* currentEvent = events->root;
  for (int i = 0; i < events->nEvents; i++){
    Time* currentEventStartTime = currentEvent->start;
    int currentEventStartMinute = currentEventStartTime->day*60*24 + currentEventStartTime->hour*60 + currentEventStartTime->min;
    if (earliestEventStart > currentEventStartMinute){
      earliestEventStart = currentEventStartMinute;
    }
    
    currentEvent = currentEvent->next;
  }
  return earliestEventStart;
}