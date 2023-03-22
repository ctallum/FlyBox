#include "../../firmware.h"

/**
 * @brief Initialize the buttons on the box
 * 
 * @param encoder ESP32Encoder chip
 */
void initButtons(ESP32Encoder *encoder){
  encoder->attachHalfQuad(DT, CLK);
  encoder->setCount(0);
  pinMode(SW, INPUT_PULLUP);
  pinMode(HOUR_PIN, INPUT_PULLUP);
  pinMode(MIN_PIN, INPUT_PULLUP);
}

/**
 * @brief Get roatry information from the rotary knob
 * 
 * @param encoder 
 * @return long value, as knob is turned, the return value increases/decreases
 */
long getRotaryInfo(ESP32Encoder *encoder) {
  return encoder->getCount();
}

/**
 * @brief Whether the rotary knob is being pressed
 * 
 * @return true
 * @return false
 */
bool knobIsPressed(){
  return (!digitalRead(SW));
}

/**
 * @brief Whether the hour adjust button is being pressed
 * 
 * @return true 
 * @return false 
 */
bool hourButtonIsPressed(){
  return (!digitalRead(HOUR_PIN));
}

/**
 * @brief Wheter the minute adjust button is being pressed
 * 
 * @return true 
 * @return false 
 */
bool minuteButtonIsPressed(){
  return (!digitalRead(MIN_PIN));
}