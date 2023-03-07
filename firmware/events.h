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
Event* NewEvent(int device, int frequency, int intensity, bool sunset, unsigned long start, unsigned long stop);
EventList* NewEventList();
void AddEvent(EventList* s, Event* n);

void check_for_event_end(Event* event, Time* now, int days_elapsed);
void check_to_run_event(Event* event, Time* now, int days_elapsed);

// misc.
EventList* DecodeFile(const char* filename);

#endif