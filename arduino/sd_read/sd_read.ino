#include "header.h"

unsigned long sec_elapsed = 0;

void setup() {
  Serial.begin(115200);

  pinMode(BUTTON_UP, INPUT_PULLUP);
  pinMode(BUTTON_DOWN, INPUT_PULLUP);
  pinMode(BUTTON_ENTER, INPUT_PULLUP);

  LiquidCrystal_I2C lcd = init_lcd();

  fs::FS SD = init_SD(lcd);

  char* filename = getFiles(lcd, SD);

  EventList* FlyBoxEvents = DecodeFile(filename);

  EventNode* current_event = FlyBoxEvents->root;
  for (int i = 0; i < FlyBoxEvents->n_events; i++) {
    Serial.println(current_event->current->device);
    Serial.println(current_event->current->frequency);
    Serial.print(current_event->current->start->hour);
    Serial.println(current_event->current->start->minute);
    Serial.print(current_event->current->stop->hour);
    Serial.println(current_event->current->stop->minute);

    current_event = current_event->next;
  }
}


void loop() {
  if 
}