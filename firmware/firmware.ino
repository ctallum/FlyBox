#include "interface.h"
#include "events.h"

// set up some global variables for hardware
RTC_DS3231 rtc;

LiquidCrystal_I2C lcd(0x27, 20, 4);
EventList* FlyBoxEvents;

// set up some global variables for timing stuff
int prev_day;
unsigned int days_elapsed = 0;
unsigned int prev_time = 0; // for frequency things

// set up some global variables for LED Pins
#define GREEN_PIN 27
#define WHITE_PIN 26
#define RED_PIN 25
#define IR_PIN 33

typedef struct PinLayout{
  int Pin;
  bool is_on;
};

// make a dict sort of object so I can use json number to get pin
PinLayout Pins[3] = {PinLayout{GREEN_PIN, false}, 
                     PinLayout{RED_PIN, false}, 
                     PinLayout{WHITE_PIN, false}};

bool LightStatus[3] = {false, false, false};

const int PWM_LED_FREQ = 5000; // 5 KHz
const int PWM_FAN_FREQ = 24000; // 23 KHz
const int PWM_LED_WHITE_CHANNEL = 0;
const int PWM_LED_RED_CHANNEL = 1;
const int PWM_LED_GREEN_CHANNEL = 2;
const int PWM_LED_FAN_CHANNEL = 3;
const int PWM_RESOLUTION = 10;
const int MAX_DUTY_CYCLE = (int)(pow(2, PWM_RESOLUTION) - 1);

void setup() {
  // Setup pins
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(WHITE_PIN, OUTPUT);
  pinMode(RED_PIN, OUTPUT);
  pinMode(IR_PIN, OUTPUT);

  sleep(1);
  digitalWrite(GREEN_PIN, LOW);
  digitalWrite(WHITE_PIN, LOW);
  digitalWrite(RED_PIN, LOW);

  Serial.begin(115200);
  
  // set up rtc chip
  if (! rtc.begin()) {
    Serial.println("Couldn't find RTC");
  return;
  }

  //rtc.adjust(DateTime(__DATE__, __TIME__));
  prev_day = rtc.now().day();
 
  // set up buttons, LCD, and SD
  init_buttons();
  lcd = init_lcd(lcd);
  fs::FS SD = init_SD(lcd);  

  // get file name to decode (intro screen)
  char* filename = getFiles(lcd, SD);

  // decode the file via json deserialization
  FlyBoxEvents = DecodeFile(filename);

  // Turn on IR light for whole flybox test run
  digitalWrite(IR_PIN, HIGH);

  writeLCD(lcd, "Status", 0, 0);
  writeLCD(lcd, "White:", 0, 3);
  writeLCD(lcd, "Red:", 0, 1);
  writeLCD(lcd, "Green:", 0, 2);
}


void loop() {
  // get current time from RTC chip

  DateTime now = rtc.now();
  int cur_day = now.day();

  // add to elapsed time
  if (cur_day != prev_day){
    days_elapsed ++;
    prev_day = cur_day;
  }

  // iterate through all the flybox events 
  bool is_done = true;

  EventNode* current_event = FlyBoxEvents->root;
  for (int i = 0; i < FlyBoxEvents->n_events; i++) {
    // check if we are during the event

    bool previous_state = current_event->current->is_active;

    check_for_event_start(current_event->current, now, days_elapsed);
    check_for_event_end(current_event->current, now, days_elapsed);

    //check to start running event
    if (current_event->current->is_active){
      int device = current_event->current->device;
      int frequency = current_event->current->frequency;
      run_event(device, frequency);

      updateStatusDisplay(device, frequency, true, LightStatus, lcd);
    }
    
    // check the end time
    if (previous_state == true && current_event->current->is_active == false){
      int device = current_event->current->device;
      kill_event(device);
      updateStatusDisplay(device, 0, false, LightStatus, lcd);
    }

    Time* end_time = current_event->current->stop;
    int end_total_min = end_time->day*60*24 + end_time->hour*60 + end_time->min;
    int cur_total_min = days_elapsed*60*24 + now.hour()*60 + now.minute();

    if (end_total_min > cur_total_min){
      is_done = false;
    }

    current_event = current_event->next;
  }
  
  if (is_done){
    lcd.clear();
    digitalWrite(IR_PIN, LOW);
    writeLCD(lcd,"Finished!", 5,1);
    for(;;){
    }
  }  
}

// Device is the JSON device group#, frequency is Hz
void run_event(int device, int frequency){
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

void updateStatusDisplay(int device, int frequency, bool is_running, bool status[3], LiquidCrystal_I2C lcd){
  if (is_running){
    if (!status[device]){
      status[device] = true;
      if (frequency != 0){
        writeLCD(lcd, "Flashing", 8, device + 1);
      } else {
        writeLCD(lcd, "On", 8, device + 1);
      }
    }
  } else {
    if (status[device]){
      status[device] = false;
      writeLCD(lcd, "         ", 8, device + 1);
    }
  } 
}