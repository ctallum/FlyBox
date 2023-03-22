#include "../../firmware.h"

extern RTC_DS3231 rtc;


/**
 * @brief Allocate memory for a struct that contains integer values for day, hour, and minute
 * @param None
 * @return *Time structure with unitialized field values of day, hour, and minute 
 */
Time* initTime(){
  struct Time* time = (struct Time*)malloc(sizeof(struct Time));
  return time;
} 

/**
 * @brief Create an empty time structure then set struct values
 * @param day int value of current day 
 * @param hour int value of current hour 
 * @param minute int value of current minute
 * @return *Time structure
 */
Time* setTimeStruct(unsigned int day, unsigned int hour, unsigned int min){
  struct Time* time = initTime();

  time->day = day;
  time->hour = hour;
  time->min = min;

  return time;
}

/**
 * @brief get current DateTime from RTC chip and then update current time
 * @param previousFlyBoxTime a Time struct
 */
void updateCurrentTime(Time* previousFlyBoxTime){
  DateTime now = rtc.now();

  previousFlyBoxTime->day = now.day();
  previousFlyBoxTime->hour = now.hour();
  previousFlyBoxTime->min = now.minute();
}

/**
 * @brief Initialize the RTC chip
 * 
 * @param rtc RTC object
 * @return RTC_DS3231 
 */
RTC_DS3231 initRTC(RTC_DS3231 rtc){
  if (! rtc.begin()) {
    Serial.println("Couldn't find RTC");
  }
  return rtc;
}

/**
 * @brief Permanantly add a minute to the internal RTC chip
 */
void addGlobalMinuteOffset(){
  rtc.adjust(DateTime(rtc.now().unixtime() + 60));
}

/**
 * @brief Permanantly add an hour to the internal RTC chip
 */
void addGlobalHourOffset(){
  rtc.adjust(DateTime(rtc.now().unixtime() + 60*60));
}

/**
 * @brief Display the current time on the box LCD screen
 * @param time a Time object
 */
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

