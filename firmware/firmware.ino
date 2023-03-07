#include "firmware.h"

// set up some global variables for hardware
RTC_DS3231 rtc;
ESP32Encoder encoder;
LiquidCrystal_I2C lcd(0x27, 20, 4);

EventList* FlyBoxEvents;

// set up some global variables for timing stuff
int prev_day;
unsigned int days_elapsed = 0;
unsigned int prev_time = 0; // for frequency things
Time* cur_time = InitTime();



// make a dict sort of object so I can use json number to get pin
PinStatus Pins[3] = {PinStatus{PWM_GREEN, false}, 
                     PinStatus{PWM_RED, false}, 
                     PinStatus{PWM_WHITE, false}};

// used to determine if a section of lights are running an event
bool LightStatus[3] = {false, false, false};

const int PWM_FREQ = 5000;
const int PWM_RESOLUTION = 10;
const int MAX_DUTY_CYCLE = (int)(pow(2, PWM_RESOLUTION) - 1);

void setup() {
  Serial.begin(115200);

  // Setup pins
  ledcSetup(PWM_WHITE, PWM_FREQ, PWM_RESOLUTION);
  ledcSetup(PWM_RED, PWM_FREQ, PWM_RESOLUTION);
  ledcSetup(PWM_GREEN, PWM_FREQ, PWM_RESOLUTION);
  pinMode(IR_PIN, OUTPUT);

  ledcAttachPin(WHITE_PIN, PWM_WHITE);
  ledcAttachPin(RED_PIN, PWM_RED);
  ledcAttachPin(GREEN_PIN, PWM_GREEN);

  sleep(1);
  ledcWrite(PWM_GREEN, 0);
  ledcWrite(PWM_WHITE, 0);
  ledcWrite(PWM_RED, 0);
  digitalWrite(IR_PIN, LOW);
 
  // set up buttons, LCD, RTC, and SD
  init_buttons(&encoder);
  lcd = init_lcd(lcd);
  fs::FS SD = init_SD(lcd);  
  rtc = InitRTC(rtc, cur_time);
  // rtc.adjust(DateTime(__DATE__, __TIME__));
  
  // show intro screen
  printIntro(lcd,rtc,cur_time);
  getCurrentTime(rtc, cur_time);
  prev_day = cur_time->day;
  sleep(1);

  // get file name to decode (intro screen)
  char* filename = getFiles(lcd, SD, encoder);

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

  GetCurrentTime(rtc, cur_time);
  int cur_day = cur_time->day;

  // add to elapsed time
  if (cur_day != prev_day){
    days_elapsed ++;
    prev_day = cur_day;
  }

  // iterate through all the flybox events 
  bool is_done = true;

  Event* current_event = FlyBoxEvents->root;
  for (int i = 0; i < FlyBoxEvents->n_events; i++) {
    // check if we are during the event
    bool previous_state = current_event->is_active;

    check_to_run_event(current_event, cur_time, days_elapsed);

    //check to start running event
    if (current_event->is_active){
      int device = current_event->device;
      int frequency = current_event->frequency;
      int intensity = current_event->intensity;
      run_event(device, frequency, intensity);

      updateStatusDisplay(device, frequency, true, LightStatus, lcd);
    }
    
    // check the end time
    if (previous_state == true && current_event->is_active == false){
      int device = current_event->device;
      kill_event(device);
      updateStatusDisplay(device, 0, false, LightStatus, lcd);
    }

    Time* end_time = current_event->stop;
    int end_total_min = end_time->day*60*24 + end_time->hour*60 + end_time->min;
    int cur_total_min = days_elapsed*60*24 + cur_time->hour*60 + cur_time->min;

    if (end_total_min > cur_total_min){
      is_done = false;
    }

    current_event = current_event->next;
  }
  
  if (is_done){
    lcd.clear();
    digitalWrite(IR_PIN, LOW);
    writeLCD(lcd,"Finished!", 5,1);
    for (;;){
    }
  }  
}

// Device is the JSON device group#, frequency is Hz
void run_event(int device, int frequency, int intensity){
  
  int pwm_intensity = (pow(intensity, 3) / 1000000)* MAX_DUTY_CYCLE;

  int pin = Pins[device].Pin;
  bool is_on = Pins[device].is_on;
  if (frequency == 0){
    ledcWrite(pin, pwm_intensity);
    Pins[device].is_on = true;
    return;
  } 
  else{
    unsigned long current_time = millis();
    int duration = 500/frequency;
    if (current_time - prev_time >= duration){
      prev_time = current_time;
      if (is_on){
        ledcWrite(pin, 0);
        Pins[device].is_on = false;
      } else{
        Pins[device].is_on = true;
        ledcWrite(pin, pwm_intensity);
      }
    }
  }
}

void kill_event(int device){
  int pin = Pins[device].Pin;
  ledcWrite(pin, 0);
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