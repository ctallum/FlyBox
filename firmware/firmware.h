#include <ArduinoJson.h>
#include <RTClib.h>
#include "FS.h"
#include "SD.h"
#include "SPI.h"
#include <string.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <ESP32Encoder.h>

#include "time.h"
#include "buttons.h"
#include "events.h"
#include "lcd.h"
#include "intro.h"
#include "sd_card.h"
#include "events.h"

// Lights Pins
#define GREEN_PIN 27
#define WHITE_PIN 26
#define RED_PIN 25
#define IR_PIN 33

// Rotary Encoder Pins
#define SW 13
#define DT 4
#define CLK 15

// DateTime Modify Pins
#define HOUR_PIN 12
#define MIN_PIN 14

// Internatl PWM Registers
const int PWM_WHITE = 0;
const int PWM_RED = 1;
const int PWM_GREEN = 2;


// Struct to hold info on pin number and whether that pin is on/off
typedef struct PinStatus{
  int Pin;
  bool is_on;
};
