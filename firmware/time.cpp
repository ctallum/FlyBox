#include "firmware.h"

Time* InitTime(){
  struct Time* time = (struct Time*)malloc(sizeof(struct Time));
  return time;
}

Time* ConvertTime(unsigned int day, unsigned int hour, unsigned int min){
  struct Time* time = InitTime();

  time->day = day;
  time->hour = hour;
  time->min = min;

  return time;
}

Time* GetCurrentTime(RTC_DS3231 rtc, Time* old_time){
  DateTime now = rtc.now();

  old_time->day = now.day();
  old_time->hour = now.hour();
  old_time->hour = now.minute();
  
  return old_time;
}

Time* InitRTC(RTC_DS3231 rtc){
  if (! rtc.begin()) {
    Serial.println("Couldn't find RTC");
  return NULL;
  }
  Time* time = InitTime();
  time = GetCurrentTime(rtc, time);
  return time;
}
