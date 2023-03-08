#include "../../firmware.h"

void updateStatusDisplay(int device, int frequency, bool is_running, bool status[3], LiquidCrystal_I2C lcd){
  if (is_running){
    if (!status[device]){
      status[device] = true;
      if (frequency != 0){
        writeLCD("Flashing", 8, device + 1);
      } else {
        writeLCD("On", 8, device + 1);
      }
    }
  } else {
    if (status[device]){
      status[device] = false;
      writeLCD("         ", 8, device + 1);
    }
  } 
}

void init_status(LiquidCrystal_I2C lcd){
  writeLCD("Status", 0, 0);
  writeLCD("White:", 0, 3);
  writeLCD("Red:", 0, 1);
  writeLCD("Green:", 0, 2);
}

void updateStatusPercent(LiquidCrystal_I2C lcd, int cur_min, int end_min){
  int percent = (100 * cur_min)/end_min;
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