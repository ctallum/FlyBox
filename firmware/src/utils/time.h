#ifndef time_h
#define time_h

typedef struct Time {
  int day;
  int hour;
  int min;
};

Time* InitTime();
Time* ConvertTime(unsigned int day, unsigned int hour, unsigned int min);
void GetCurrentTime(RTC_DS3231 rtc, Time* old_time);
RTC_DS3231 InitRTC(RTC_DS3231 rtc, Time* time);
void AdjustMin(RTC_DS3231 rtc);
void AdjustHour(RTC_DS3231 rtc);
void DispTime(Time* time);


#endif