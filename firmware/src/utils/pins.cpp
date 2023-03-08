#include "../../firmware.h"

PinStatus* initPinStatus(int pin_number) {
  struct PinStatus* pin = (struct PinStatus*)malloc(sizeof(struct PinStatus));

    pin->pinNumber = pin_number;
    pin->isCurrentlyOn = false;
    pin->isRunningEvent = false;
    pin->lastTimeOn = 0;

  return pin;
}


