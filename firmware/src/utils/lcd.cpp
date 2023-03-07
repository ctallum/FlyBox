#include "../../firmware.h"

LiquidCrystal_I2C init_lcd(LiquidCrystal_I2C lcd) {
  lcd.init();
  lcd.clear();
  lcd.backlight();  // Make sure backlight is on
  return lcd;
}

void writeLCD(LiquidCrystal_I2C lcd, char* s, int x, int y) {
  lcd.setCursor(x, y);
  if 
  lcd.print(s);
}

void writeLCDInt(LiquidCrystal_I2C lcd, int i, int x, int y) {
  lcd.setCursor(x, y);
  lcd.print(i,10);
}
