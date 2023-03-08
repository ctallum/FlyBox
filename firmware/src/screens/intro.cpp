#include "../../firmware.h"

void printIntro(Time* time){
    writeLCD("FLYBOX",0,0);
    writeLCD("Click knob to start", 0, 2);
    bool min_pressed = minuteButtonIsPressed();
    bool hour_pressed = hourButtonIsPressed();
    for(;;){
      updateCurrentTime(time);
      dispTime(time);
      if (minuteButtonIsPressed() && (min_pressed == false)){
        addGlobalMinuteOffset();
        min_pressed = true;
      }
      if (!minuteButtonIsPressed() && (min_pressed == true)){
        min_pressed = false;
      }
      if (hourButtonIsPressed() && (hour_pressed == false)){
        addGlobalHourOffset();
        hour_pressed = true;
      }
      if (!hourButtonIsPressed() && (hour_pressed == true)){
        hour_pressed = false;
      }
      if (knobIsPressed()){
        clearLCD();
        break;
      }
    }
}