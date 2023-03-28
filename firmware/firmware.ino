#include "firmware.h"

// set up some global variables for hardware
RTC_DS3231 rtc;
ESP32Encoder encoder;
LiquidCrystal_I2C lcd(0x27, 20, 4);

EventList* FlyBoxEvents;

// set up some global variables for timing stuff
int previousDay;
unsigned int daysElapsed = 0;
int finalEventEndMinute;
int firstEventStartMinute;

Time* currentFlyTime = initTime();

// make a dict sort of object so I can use json number to get pin
PinStatus* Pins[3] = {initPinStatus(PWM_RED), 
                      initPinStatus(PWM_GREEN), 
                      initPinStatus(PWM_WHITE)};

// used to determine if a section of lights are running an event
void setup() {
  Serial.begin(115200);

  // Initialize lights, buttons, LCD, and RTC chip
  initLights();
  initButtons(&encoder);
  lcd = initLCD(lcd);
  rtc = initRTC(rtc);

  // get current clock time
  updateCurrentTime(currentFlyTime);
  
  // show intro screen
  printIntro(currentFlyTime);

  previousDay = currentFlyTime->day;

  fs::FS SD = initSD();  
  sleep(1);

  // get file name to decode (intro screen)
  char* filename = selectFiles(SD, encoder);

  // decode the file via json deserialization
  FlyBoxEvents = decodeJSONFile(filename);

  // Turn on IR light for whole flybox test run
  digitalWrite(IR_PIN, HIGH);

  firstEventStartMinute = getFirstEventStart(FlyBoxEvents);
  finalEventEndMinute = getLastEventEnd(FlyBoxEvents);

  // start status screen
  initStatus();
}

void loop() {
  // get current time from RTC chip

  updateCurrentTime(currentFlyTime);
  int currentDay = currentFlyTime->day;

  // add to elapsed time
  if (currentDay != previousDay){
    daysElapsed ++;
    previousDay = currentDay;
  }

  // iterate through all the flybox events 
  bool testIsDone = true;

  Event* currentEvent = FlyBoxEvents->root;
  for (int i = 0; i < FlyBoxEvents->nEvents; i++) {
    // check if we are during the event
    bool previousState = currentEvent->isActive;

    checkToRunEvent(currentEvent, currentFlyTime, daysElapsed);

    //check to start running event
    if (currentEvent->isActive){
      runEvent(Pins,currentEvent);
      updateStatusDisplay(currentEvent, Pins);
    }
    
    // check the end time
    if (previousState == true && currentEvent->isActive == false){
      killEvent(Pins, currentEvent->device);
      updateStatusDisplay(currentEvent, Pins);
    }

    Time* currentEventEndTime = currentEvent->stop;
    int currentEventEndMinute = currentEventEndTime->day*60*24 + currentEventEndTime->hour*60 + currentEventEndTime->min;
    int currentTimeMinTotal = daysElapsed*60*24 + currentFlyTime->hour*60 + currentFlyTime->min;
    updateStatusPercentAndTime(currentTimeMinTotal, firstEventStartMinute, finalEventEndMinute, currentFlyTime);

    if (currentEventEndMinute > currentTimeMinTotal){
      testIsDone = false;
    }

    currentEvent = currentEvent->next;
  }
  
  if (testIsDone){
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
