#ifndef buttons_h
#define buttons_h

void init_buttons(ESP32Encoder *encoder);
long get_rotary_info(ESP32Encoder *encoder);
bool knob_is_pressed();
bool hour_button_is_pressed();
bool min_button_is_pressed();

#endif

