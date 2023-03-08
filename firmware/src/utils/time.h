#ifndef time_h
#define time_h

typedef struct Time {
  int day;
  int hour;
  int min;
};

Time* InitTime();
Time* ConvertTime(unsigned int day, unsigned int hour, unsigned int min);
void UpdateCurrentTime(Time* old_time);
RTC_DS3231 InitRTC(RTC_DS3231 rtc);
void AdjustMin();
void AdjustHour();
void DispTime(Time* time);


#endif