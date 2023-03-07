#include "firmware.h"

void init_buttons(ESP32Encoder *encoder){
  encoder->attachHalfQuad(DT, CLK);
  encoder->setCount(0);
  pinMode(SW, INPUT_PULLUP);
}

long get_rotary_info(ESP32Encoder *encoder) {
  return encoder->getCount();
}