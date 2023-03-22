#ifndef firmware_h
#define firmware_h

// External Library Import
#include <ArduinoJson.h>
#include <RTClib.h>
#include "FS.h"
#include "SD.h"
#include "SPI.h"
#include <string.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <ESP32Encoder.h>

// Internal Helper Files
#include "src/utils/lights.h"
#include "src/utils/kill.h"
#include "src/utils/time.h"
#include "src/utils/buttons.h"
#include "src/utils/lcd.h"
#include "src/utils/sd_card.h"
#include "src/utils/pins.h"
#include "src/utils/events.h"
#include "src/screens/intro.h"
#include "src/screens/status.h"
#include "src/screens/select.h"

// Lights Pins
#define RED_PIN 25
#define GREEN_PIN 26
#define WHITE_PIN 27
#define IR_PIN 33

// Rotary Encoder Pins
#define SW 13
#define DT 4
#define CLK 15

// DateTime Modify Pins
#define HOUR_PIN 12
#define MIN_PIN 14

// Internal PWM Registers
const int PWM_WHITE = 0;
const int PWM_RED = 1;
const int PWM_GREEN = 2;

// Shared time constants
const int PWM_FREQ = 5000;
const int PWM_RESOLUTION = 10;
const int MAX_DUTY_CYCLE = (int)(pow(2, PWM_RESOLUTION) - 1);

#endif