#include "../../firmware.h"

extern RTC_DS3231 rtc;

Time* initTime(){
  struct Time* time = (struct Time*)malloc(sizeof(struct Time));
  return time;
}

Time* convertTime(unsigned int day, unsigned int hour, unsigned int min){
  struct Time* time = initTime();

  time->day = day;
  time->hour = hour;
  time->min = min;

  return time;
}

void updateCurrentTime(Time* old_time){
  DateTime now = rtc.now();

  old_time->day = now.day();
  old_time->hour = now.hour();
  old_time->min = now.minute();
}

RTC_DS3231 initRTC(RTC_DS3231 rtc){
  if (! rtc.begin()) {
    Serial.println("Couldn't find RTC");
  }
  return rtc;
}

void addGlobalMinuteOffset(){
  rtc.adjust(DateTime(rtc.now().unixtime() + 60));
}

void addGlobalHourOffset(){
  rtc.adjust(DateTime(rtc.now().unixtime() + 60*60));
}

void dispTime(Time* time){
  if (time->hour<10){
    writeLCDInt( 0, 15, 0);
    writeLCDInt( time->hour, 16, 0);
  } else {
    writeLCDInt( time->hour, 15, 0);
  }
  writeLCD(":",17,0);
  if (time->min < 10){
    writeLCDInt( 0, 18, 0);
    writeLCDInt( time->min, 19, 0);
  } else {
    writeLCDInt( time->min, 18, 0);
  }
}

