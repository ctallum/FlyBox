#ifndef HEADER_FILE_NAME
#define HEADER_FILE_NAME

#include "FS.h"
#include "SD.h"
#include "SPI.h"
#include <ArduinoJson.h>
#include <string.h>
#include "header.h"

typedef struct Time{
  int hour;
  int minute;
};

typedef struct Event{
  const char* device;
  int frequency;
  Time* start;
  Time* stop;
};
 
typedef struct EventNode{
  Event* current;
  EventNode* next;
};

typedef struct EventList{
  EventNode* root;
  int n_events;
};



void listDir(fs::FS &fs, const char * dirname, uint8_t levels);
void createDir(fs::FS &fs, const char * path);
void removeDir(fs::FS &fs, const char * path);
void readFile(fs::FS &fs, const char * path);
void writeFile(fs::FS &fs, const char * path, const char * message);
void appendFile(fs::FS &fs, const char * path, const char * message);
void renameFile(fs::FS &fs, const char * path1, const char * path2);
void deleteFile(fs::FS &fs, const char * path);
void testFileIO(fs::FS &fs, const char * path);

Event* NewEvent(const char* device, int frequency, Time* start, Time* stop);
EventNode* NewEventNode(Event* event);
EventList* NewEventList();

Time* ConvertTime(const char* time);

void AddEvent(EventList* s, EventNode* n);

#endif 