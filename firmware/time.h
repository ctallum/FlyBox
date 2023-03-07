#ifndef time_h
#define time_h

typedef struct Time {
  int day;
  int hour;
  int min;
};

Time* InitTime();
Time* ConvertTime(unsigned int day, unsigned int hour, unsigned int min);
Time* GetCurrentTime(RTC_DS3231 rtc, Time* old_time);
Time* InitRTC(RTC_DS3231 rtc);


#endif