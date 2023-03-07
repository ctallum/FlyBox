#include "../../firmware.h"

void init_buttons(ESP32Encoder *encoder){
  encoder->attachHalfQuad(DT, CLK);
  encoder->setCount(0);
  pinMode(SW, INPUT_PULLUP);
  pinMode(HOUR_PIN, INPUT_PULLUP);
  pinMode(MIN_PIN, INPUT_PULLUP);
}

long get_rotary_info(ESP32Encoder *encoder) {
  return encoder->getCount();
}

bool knob_is_pressed(){
  return (!digitalRead(SW));
}

bool hour_button_is_pressed(){
  return (!digitalRead(HOUR_PIN));
}

bool min_button_is_pressed(){
  return (!digitalRead(MIN_PIN));
}