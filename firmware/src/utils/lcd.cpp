#include "../../firmware.h"

extern LiquidCrystal_I2C lcd;

LiquidCrystal_I2C init_lcd(LiquidCrystal_I2C lcd) {
  lcd.init();
  lcd.clear();
  lcd.backlight();  // Make sure backlight is on
  return lcd;
}

void writeLCD(char* s, int x, int y) {
  lcd.setCursor(x, y);
  int len = strlen(s);
  if (len > 20-x) {
    len = 20-x;
  }
  for (int pos = 0; pos < len; pos ++){
    lcd.setCursor(x+pos,y);
    lcd.print(s[pos]);
  }
}

void writeLCDInt(int i, int x, int y) {
  lcd.setCursor(x, y);
  lcd.print(i,10);
}

void clearLCD(){
  lcd.clear();
}
