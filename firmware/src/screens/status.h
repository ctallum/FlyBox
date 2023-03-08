#ifndef status_h
#define status_h

void updateStatusDisplay(int device, int frequency, bool is_running, bool status[3], LiquidCrystal_I2C lcd);
void init_status(LiquidCrystal_I2C lcd);
void updateStatusPercent(LiquidCrystal_I2C lcd, int cur_min, int end_min);

#endif