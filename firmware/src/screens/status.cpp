#include "../../firmware.h"

void updateStatusDisplay(Event* event, PinStatus* Pins[3]){
  // get device number from event
  int device = event->device;
  int frequency = event->frequency;

  if (event->is_active){
    if (!Pins[device]->isRunningEvent){
      Pins[device]->isRunningEvent = true;
      if (frequency != 0){
        writeLCD("Flashing", 8, device + 1);
      } else {
        writeLCD("On", 8, device + 1);
      }
    }
  } else {
    if (Pins[device]->isRunningEvent){
      Pins[device]->isRunningEvent = false;
      writeLCD("         ", 8, device + 1);
    }
  } 
}

void initStatus(){
  writeLCD("Status", 0, 0);
  writeLCD("White:", 0, 3);
  writeLCD("Red:", 0, 1);
  writeLCD("Green:", 0, 2);
}

void updateStatusPercent(int cur_min, int start_min, int end_min){
  int percent = (100 * (cur_min- start_min))/(end_min-start_min);
  if (percent < 0){
    percent = 0;
  }
  Serial.println(percent);
  writeLCDInt( percent, 8, 0);

  if (percent < 10){
    writeLCD("%", 9, 0);
  } else if (percent < 100){
    writeLCD("%", 10, 0);
  } else {
    writeLCD("%", 11, 0);
  }
}