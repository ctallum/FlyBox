#ifndef events_h
#define events_h

/**
 * @brief A structure that represents a discrete lighting time event. The values are the following:
 * @param device int value from 0-2. Red = 0, Green = 1, White = 2
 * @param frequency int value of the desired light strobe frequency in Hz
 * @param intensity int value of the desired light intensity, 0-100
 * @param start Time* value containing start day, hour, and minute
 * @param stop Time* value containing end day, hour, and minute
 * @param isActive bool value of whether the current event is running
 * @param next Event* value that is the next Event item in the linked list
 */
typedef struct Event {
  int device;
  int frequency;
  int intensity;
  bool sunset;
  Time* start;
  Time* stop;
  bool isActive;
  Event* next;
};

/**
 * @brief A linked list struct containing all of the Event structures. Has following values:
 * @param root Event* first event of the list
 * @param nEvents Total number of events in the current flybox test program
 */
typedef struct EventList {
  Event* root;
  int nEvents;
};


Event* newEvent(int device, int frequency, int intensity, bool sunset, Time* start, Time* stop);
EventList* newEventList();
void addEvent(EventList* s, Event* n);
void checkToRunEvent(Event* event, Time* now, int daysElapsed);
EventList* decodeJSONFile(const char* filename);
void killEvent(PinStatus* Pins[], int device);
void runEvent(PinStatus* Pins[], Event* event);
int getLastEventEnd(EventList* events);
int getFirstEventStart(EventList* events);

#endif