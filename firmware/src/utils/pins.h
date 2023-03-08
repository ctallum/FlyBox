#ifndef pins_h
#define pins_h


// Struct to hold info on pin number and whether that pin is on/off
typedef struct PinStatus{
  int pinNumber;
  bool isCurrentlyOn;
  bool isRunningEvent;
  unsigned int lastTimeOn;
};

PinStatus* initPinStatus(int pin_number);


#endif