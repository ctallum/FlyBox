#include "../../firmware.h"

void updateStatusDisplay(int device, int frequency, bool is_running, bool status[3], LiquidCrystal_I2C lcd){
  if (is_running){
    if (!status[device]){
      status[device] = true;
      if (frequency != 0){
        writeLCD(lcd, "Flashing", 8, device + 1);
      } else {
        writeLCD(lcd, "On", 8, device + 1);
      }
    }
  } else {
    if (status[device]){
      status[device] = false;
      writeLCD(lcd, "         ", 8, device + 1);
    }
  } 
}