#ifndef time_h
#define time_h

typedef struct Time {
  int day;
  int hour;
  int min;
};

Time* initTime();
Time* setTimeStruct(unsigned int day, unsigned int hour, unsigned int min);
void updateCurrentTime(Time* previousFlyBoxTime);
RTC_DS3231 initRTC(RTC_DS3231 rtc);
void addGlobalMinuteOffset();
void addGlobalHourOffset();
void dispTime(Time* time);


#endif