#ifndef HEADER_FILE_NAME
#define HEADER_FILE_NAME

#include "FS.h"
#include "SD.h"
#include "SPI.h"
#include <ArduinoJson.h>
#include <string.h>
#include "header.h"
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <RTClib.h>

#define BUTTON_UP 15
#define BUTTON_DOWN 13
#define BUTTON_ENTER 4

typedef struct Time {
  int hour;
  int minute;
};

typedef struct Event {
  int device;
  int frequency;
  unsigned long start;
  unsigned long stop;
};

typedef struct EventNode {
  Event* current;
  EventNode* next;
};

typedef struct EventList {
  EventNode* root;
  int n_events;
};



void listDir(fs::FS& fs, const char* dirname, uint8_t levels);
void createDir(fs::FS& fs, const char* path);
void removeDir(fs::FS& fs, const char* path);
void readFile(fs::FS& fs, const char* path);
void writeFile(fs::FS& fs, const char* path, const char* message);
void appendFile(fs::FS& fs, const char* path, const char* message);
void renameFile(fs::FS& fs, const char* path1, const char* path2);
void deleteFile(fs::FS& fs, const char* path);
void testFileIO(fs::FS& fs, const char* path);

Event* NewEvent(int device, int frequency, unsigned long start, unsigned long stop);
EventNode* NewEventNode(Event* event);
EventList* NewEventList();

Time* ConvertTime(const char* time);

void AddEvent(EventList* s, EventNode* n);

EventList* DecodeFile(const char* filename);
LiquidCrystal_I2C init_lcd();
void writeLCD(LiquidCrystal_I2C lcd, char* s, int x, int y);
char* getFiles(LiquidCrystal_I2C lcd, fs::FS& fs);
fs::FS init_SD(LiquidCrystal_I2C lcd);


void init_buttons();
#endif