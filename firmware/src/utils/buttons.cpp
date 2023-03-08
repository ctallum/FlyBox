#include "../../firmware.h"

void initButtons(ESP32Encoder *encoder){
  encoder->attachHalfQuad(DT, CLK);
  encoder->setCount(0);
  pinMode(SW, INPUT_PULLUP);
  pinMode(HOUR_PIN, INPUT_PULLUP);
  pinMode(MIN_PIN, INPUT_PULLUP);
}

long getRotaryInfo(ESP32Encoder *encoder) {
  return encoder->getCount();
}

bool knobIsPressed(){
  return (!digitalRead(SW));
}

bool hourButtonIsPressed(){
  return (!digitalRead(HOUR_PIN));
}

bool minuteButtonIsPressed(){
  return (!digitalRead(MIN_PIN));
}