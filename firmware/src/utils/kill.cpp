#include "../../firmware.h"

/**
 * @brief Function that restarts the ESP32
 */
void(* resetFunc) (void) = 0;

/**
 * @brief Wrapper function to reset the ESP32 using an internal force reset function
 */
void reset(){
    resetFunc();
}