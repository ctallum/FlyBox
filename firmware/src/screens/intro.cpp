#include "../../firmware.h"

void printIntro(RTC_DS3231 rtc, Time* time){
    writeLCD("FLYBOX",0,0);
    writeLCD("Click knob to start", 0, 2);
    bool min_pressed = min_button_is_pressed();
    bool hour_pressed = hour_button_is_pressed();
    for(;;){
      GetCurrentTime(rtc, time);
      DispTime(time);
      if (min_button_is_pressed() && (min_pressed == false)){
        AdjustMin(rtc);
        min_pressed = true;
      }
      if (!min_button_is_pressed() && (min_pressed == true)){
        min_pressed = false;
      }
      if (hour_button_is_pressed() && (hour_pressed == false)){
        AdjustHour(rtc);
        hour_pressed = true;
      }
      if (!hour_button_is_pressed() && (hour_pressed == true)){
        hour_pressed = false;
      }
      if (knob_is_pressed()){
        clearLCD();
        break;
      }
    }
}