#ifndef buttons_h
#define buttons_h

void initButtons(ESP32Encoder *encoder);
long getRotaryInfo(ESP32Encoder *encoder);
bool knobIsPressed();
bool hourButtonIsPressed();
bool minuteButtonIsPressed();

#endif

