#ifndef lcd_h
#define lcd_h

LiquidCrystal_I2C init_lcd(LiquidCrystal_I2C lcd);
void writeLCD(LiquidCrystal_I2C lcd, char* s, int x, int y);
void writeLCDInt(LiquidCrystal_I2C lcd, int i, int x, int y);

#endif