#ifndef events_h
#define events_h

typedef struct Time {
  int day;
  int hour;
  int min;
};

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
Event* NewEvent(int device, int frequency, int intensity, bool sunset, unsigned long start, unsigned long stop);
EventList* NewEventList();
void AddEvent(EventList* s, Event* n);


void check_to_run_event(Event* event, DateTime now, int days_elapsed);
Time* ConvertTime(unsigned int day, unsigned int hour, unsigned int min);

// misc.
EventList* DecodeFile(const char* filename);

#endif