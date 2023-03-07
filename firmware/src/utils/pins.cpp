#include "../../firmware.h"

PinStatus* MakePin(int pin_number) {
  struct PinStatus* pin = (struct PinStatus*)malloc(sizeof(struct PinStatus));

    pin->Pin = pin_number;
    pin->is_on = false;

  return pin;
}


