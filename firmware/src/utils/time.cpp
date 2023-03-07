#include "../../firmware.h"

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

void GetCurrentTime(RTC_DS3231 rtc, Time* old_time){
  DateTime now = rtc.now();

  old_time->day = now.day();
  old_time->hour = now.hour();
  old_time->min = now.minute();
}

RTC_DS3231 InitRTC(RTC_DS3231 rtc, Time* time){
  if (! rtc.begin()) {
    Serial.println("Couldn't find RTC");
  }
  GetCurrentTime(rtc, time);
  return rtc;
}

void AdjustMin(RTC_DS3231 rtc){
  rtc.adjust(DateTime(rtc.now().unixtime() + 60));
}

void AdjustHour(RTC_DS3231 rtc){
  rtc.adjust(DateTime(rtc.now().unixtime() + 60*60));
}

void DispTime(LiquidCrystal_I2C lcd, Time* time){
  if (time->hour<10){
    writeLCDInt(lcd, 0, 15, 0);
    writeLCDInt(lcd, time->hour, 16, 0);
  } else {
    writeLCDInt(lcd, time->hour, 15, 0);
  }
  writeLCD(lcd, ":",17,0);
  if (time->min < 10){
    writeLCDInt(lcd, 0, 18, 0);
    writeLCDInt(lcd, time->min, 19, 0);
  } else {
    writeLCDInt(lcd, time->min, 18, 0);
  }
}

