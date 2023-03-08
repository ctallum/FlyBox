#ifndef status_h
#define status_h

void updateStatusDisplay(Event* event, PinStatus* Pins[3]);
void initStatus();
void updateStatusPercent(int cur_min, int start_min, int end_min);

#endif