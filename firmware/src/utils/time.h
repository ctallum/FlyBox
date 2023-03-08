#ifndef time_h
#define time_h

typedef struct Time {
  int day;
  int hour;
  int min;
};

Time* initTime();
Time* convertTime(unsigned int day, unsigned int hour, unsigned int min);
void updateCurrentTime(Time* old_time);
RTC_DS3231 initRTC(RTC_DS3231 rtc);
void addGlobalMinuteOffset();
void addGlobalHourOffset();
void dispTime(Time* time);


#endif