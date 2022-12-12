#include "header.h"

// set up some global variables for hardware
RTC_DS3231 rtc;
EventList* FlyBoxEvents;

// set up some global variables for timing stuff
int prev_second;
unsigned long sec_elapsed = 0;
unsigned long prev_time = 0;

// set up some global variables for LED Pins
#define WHITE_PIN 26
#define RED_PIN 25
#define GREEN_PIN 27
#define IR_PIN 33

typedef struct PinLayout{
  int Pin;
  bool is_on;
};

// make a dict sort of object so I can use json number to get pin
PinLayout Pins[3] = {PinLayout{RED_PIN, false}, 
                     PinLayout{GREEN_PIN, false}, 
                     PinLayout{WHITE_PIN, false}};

void setup() {

  Serial.begin(115200);
  
  // set up rtc chip
  if (! rtc.begin()) {
  Serial.println("Couldn't find RTC");
  return;
  }
  rtc.adjust(DateTime(__DATE__, __TIME__));
 
  // set up buttons
  init_buttons();

  // set up LCD Screen
  LiquidCrystal_I2C lcd = init_lcd();

  // set up sd card reader
  fs::FS SD = init_SD(lcd);

  // get file name to decode (intro screen)
  char* filename = getFiles(lcd, SD);

  // decode the file via json deserialization
  FlyBoxEvents = DecodeFile(filename);

  
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(WHITE_PIN, OUTPUT);
  pinMode(IR_PIN, OUTPUT);

  digitalWrite(GREEN_PIN, LOW);
  digitalWrite(RED_PIN, LOW);
  digitalWrite(WHITE_PIN, LOW);

  digitalWrite(IR_PIN, HIGH);

  prev_second = 0;
}


void loop() {
  // get current time from RTC chip
  DateTime now = rtc.now();
  int cur_second = now.second();

  // add to elapsed time
  if (cur_second != prev_second){
    sec_elapsed ++;
    prev_second = cur_second;
  }

  // iterate through all the flybox events 
  EventNode* current_event = FlyBoxEvents->root;
  for (int i = 0; i < FlyBoxEvents->n_events; i++) {
    // check if we are during the event
    if (current_event->current->start <= sec_elapsed && current_event->current->stop > sec_elapsed){
      int device = current_event->current->device;
      int frequency = current_event->current->frequency;
      run_event(device, frequency);
    }

    // check the end time
    if (current_event->current->stop == sec_elapsed){
      int device = current_event->current->device;
      kill_event(device);
    }

    current_event = current_event->next;
  }  
}

// Device is the JSON device group#, frequency is Hz
void run_event(int device, int frequency){
  if (device == 1){
    Serial.println("green flashing");
  }
  int pin = Pins[device].Pin;
  bool is_on = Pins[device].is_on;
  if (frequency == 0){
    digitalWrite(pin, HIGH);
    Pins[device].is_on = true;
    return;
  } 
  else{
    unsigned long current_time = millis();
    int duration = 500/frequency;
    if (current_time - prev_time >= duration){
      prev_time = current_time;
      if (is_on){
        digitalWrite(pin, LOW);
        Pins[device].is_on = false;
      } else{
        Pins[device].is_on = true;
        digitalWrite(pin, HIGH);
      }
    }
  }
}

void kill_event(int device){
  int pin = Pins[device].Pin;
  digitalWrite(pin, LOW);
  Pins[device].is_on = false;
}