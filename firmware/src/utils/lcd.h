#ifndef lcd_h
#define lcd_h

LiquidCrystal_I2C init_lcd(LiquidCrystal_I2C lcd);
void writeLCD(char* s, int x, int y);
void writeLCDInt(int i, int x, int y);
void clearLCD();

#endif