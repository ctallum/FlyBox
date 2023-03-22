#include "../../firmware.h"

extern LiquidCrystal_I2C lcd;

/**
 * @brief Initilze the LCD screen
 * 
 * @param lcd LiquidCrystal_I2C object
 * @return LiquidCrystal_I2C 
 */
LiquidCrystal_I2C initLCD(LiquidCrystal_I2C lcd) {
  lcd.init();
  lcd.clear();
  lcd.backlight();  // Make sure backlight is on
  return lcd;
}

/**
 * @brief Write a character array to the LCD screen
 * 
 * @param s character array, max of 20 char long
 * @param x x-value location of starting character of array (0-19)
 * @param y y-value location of starting character of array (0-3)
 */
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

/**
 * @brief Write an integer value to the LCD screen
 * 
 * @param i integer value to print
 * @param x x-value location of starting character of array (0-19)
 * @param y y-value location of starting character of array (0-3)
 */
void writeLCDInt(int i, int x, int y) {
  lcd.setCursor(x, y);
  lcd.print(i,10);
}

/**
 * @brief Clear LCD screen
 * 
 */
void clearLCD(){
  lcd.clear();
}
