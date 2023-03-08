#include "firmware.h"

// set up some global variables for hardware
RTC_DS3231 rtc;
ESP32Encoder encoder;
LiquidCrystal_I2C lcd(0x27, 20, 4);

EventList* FlyBoxEvents;

// set up some global variables for timing stuff
int prev_day;
unsigned int days_elapsed = 0;
int final_event_min;
int first_event_min;

Time* cur_time = initTime();

// make a dict sort of object so I can use json number to get pin
PinStatus* Pins[3] = {initPinStatus(PWM_RED), 
                      initPinStatus(PWM_GREEN), 
                      initPinStatus(PWM_WHITE)};

// used to determine if a section of lights are running an event
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
  initButtons(&encoder);
  lcd = initLCD(lcd);
  fs::FS SD = initSD();  
  rtc = initRTC(rtc);
  updateCurrentTime(cur_time);
  // rtc.adjust(DateTime(__DATE__, __TIME__));
  
  // show intro screen
  printIntro(cur_time);
  updateCurrentTime(cur_time);
  prev_day = cur_time->day;
  sleep(1);

  // get file name to decode (intro screen)
  char* filename = selectFiles(SD, encoder);

  // decode the file via json deserialization
  FlyBoxEvents = decodeJSONFile(filename);

  // Turn on IR light for whole flybox test run
  digitalWrite(IR_PIN, HIGH);

  first_event_min = getFirstEventStart(FlyBoxEvents);
  final_event_min = getLastEventEnd(FlyBoxEvents);

  // start status screen
  initStatus();
}

void loop() {
  // get current time from RTC chip

  updateCurrentTime(cur_time);
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

    checkToRunEvent(current_event, cur_time, days_elapsed);

    //check to start running event
    if (current_event->is_active){
      runEvent(Pins,current_event);
      updateStatusDisplay(current_event, Pins);
    }
    
    // check the end time
    if (previous_state == true && current_event->is_active == false){
      killEvent(Pins, current_event->device);
      updateStatusDisplay(current_event, Pins);
    }

    

    Time* end_time = current_event->stop;
    int end_total_min = end_time->day*60*24 + end_time->hour*60 + end_time->min;
    int cur_total_min = days_elapsed*60*24 + cur_time->hour*60 + cur_time->min;

    updateStatusPercent(cur_total_min, first_event_min, final_event_min);

    if (end_total_min > cur_total_min){
      is_done = false;
    }

    current_event = current_event->next;
  }
  
  if (is_done){
    lcd.clear();
    digitalWrite(IR_PIN, LOW);
    writeLCD("Finished!", 5,0);
    writeLCD("Press knob to",3,2);
    writeLCD("restart",6, 3);
    for (;;){
      if (knobIsPressed()){
        reset();
      }
    }
  }  
}
