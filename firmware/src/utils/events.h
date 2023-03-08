#ifndef events_h
#define events_h

// data structures
typedef struct Event {
  int device;
  int frequency;
  int intensity;
  bool sunset;
  Time* start;
  Time* stop;
  bool is_active;
  Event* next;
};

typedef struct EventList {
  Event* root;
  int n_events;
};

// event management
Event* newEvent(int device, int frequency, int intensity, bool sunset, unsigned long start, unsigned long stop);
EventList* newEventList();
void addEvent(EventList* s, Event* n);
void checkToRunEvent(Event* event, Time* now, int days_elapsed);
EventList* decodeJSONFile(const char* filename);
void killEvent(PinStatus* Pins[], int device);
void runEvent(PinStatus* Pins[], Event* event);
int getLastEventEnd(EventList* events);
int getFirstEventStart(EventList* events);

#endif