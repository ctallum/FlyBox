#ifndef status_h
#define status_h

void updateStatusDisplay(Event* event, PinStatus* Pins[3]);
void initStatus();
void updateStatusPercent(int currentMinute, int startMinute, int endMinute);

#endif