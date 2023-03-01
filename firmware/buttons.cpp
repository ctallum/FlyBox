#include "firmware.h"

ESP32Encoder encoder;

void init_buttons(){
  encoder.attachHalfQuad(DT, CLK);
  encoder.setCount(0);
  pinMode(SW, INPUT_PULLUP);
}



long get_rotary_info() {
  return encoder.getCount();
}