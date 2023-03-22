#include "../../firmware.h"


/**
 * @brief Display the current time on the box and update time if time adjustment buttons are pressed
 * 
 * @param time A Time* object containing day, hour, and minute
 */
void printIntro(Time* time){
    writeLCD("FLYBOX",0,0);
    writeLCD("Click knob to start", 0, 2);
    bool minuteButtonActivlyPressed = minuteButtonIsPressed();
    bool hourButtonActivlyPressed = hourButtonIsPressed();
    for(;;){
      updateCurrentTime(time);
      dispTime(time);
      if (minuteButtonIsPressed() && (minuteButtonActivlyPressed == false)){
        addGlobalMinuteOffset();
        minuteButtonActivlyPressed = true;
      }
      if (!minuteButtonIsPressed() && (minuteButtonActivlyPressed == true)){
        minuteButtonActivlyPressed = false;
      }
      if (hourButtonIsPressed() && (hourButtonActivlyPressed == false)){
        addGlobalHourOffset();
        hourButtonActivlyPressed = true;
      }
      if (!hourButtonIsPressed() && (hourButtonActivlyPressed == true)){
        hourButtonActivlyPressed = false;
      }
      if (knobIsPressed()){
        clearLCD();
        updateCurrentTime(time);
        break;
      }
    }
}