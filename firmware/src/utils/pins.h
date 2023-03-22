#ifndef pins_h
#define pins_h


/**
 * @brief Struct that contains following fields
 * @param pinNumber int value of ESP32 PWM register 
 * @param isCurrentlyOn bool value of whether light is currently on
 * @param isRunningEvent bool value of whether a currently running event is using the light
 * @param lastTimeOn unsigned int value in miliseconds of when the light was last turned on
 * 
 */
typedef struct PinStatus{
  int pinNumber;
  bool isCurrentlyOn;
  bool isRunningEvent;
  unsigned int lastTimeOn;
};

PinStatus* initPinStatus(int pinNumber);


#endif