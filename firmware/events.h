#ifndef events_h
#define events_h

// data structures
typedef struct Time {
  int day;
  int hour;
  int min;
};

typedef struct Event {
  int device;
  int frequency;
  Time* start;
  Time* stop;
  bool is_active;
};

typedef struct EventNode {
  Event* current;
  EventNode* next;
};

typedef struct EventList {
  EventNode* root;
  int n_events;
};

// event management
Event* NewEvent(int device, int frequency, unsigned long start, unsigned long stop);
EventNode* NewEventNode(Event* event);
EventList* NewEventList();
void AddEvent(EventList* s, EventNode* n);

// time operations
void check_for_event_start(Event* event, DateTime now, int days_elapsed);
void check_for_event_end(Event* event, DateTime now, int days_elapsed);
void check_to_run_event(Event* event, DateTime now, int days_elapsed);
Time* ConvertTime(unsigned int day, unsigned int hour, unsigned int min);

// misc.
EventList* DecodeFile(const char* filename);

#endif