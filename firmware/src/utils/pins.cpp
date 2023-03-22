#include "../../firmware.h"

/**
 * @brief Initializes a PinStatus struct and sets the pinNumber field
 * 
 * @param pinNumber ESP32 PWM register
 * @return PinStatus* 
 */
PinStatus* initPinStatus(int pinNumber) {
  struct PinStatus* pin = (struct PinStatus*)malloc(sizeof(struct PinStatus));

    pin->pinNumber = pinNumber;
    pin->isCurrentlyOn = false;
    pin->isRunningEvent = false;
    pin->lastTimeOn = 0;

  return pin;
}


