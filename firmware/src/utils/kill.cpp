#include "../../firmware.h"

void(* resetFunc) (void) = 0;

void reset(){
    resetFunc();
}