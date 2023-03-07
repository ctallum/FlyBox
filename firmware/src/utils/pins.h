#ifndef pins_h
#define pins_h


// Struct to hold info on pin number and whether that pin is on/off
typedef struct PinStatus{
  int Pin;
  bool is_on;
};

PinStatus* MakePin(int pin_number);


#endif