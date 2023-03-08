#ifndef status_h
#define status_h

void updateStatusDisplay(int device, int frequency, bool is_running, bool status[3]);
void initStatus();
void updateStatusPercent(int cur_min, int end_min);

#endif