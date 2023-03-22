#include "../../firmware.h"


/**
 * @brief Display all of the files found on the SD card and allow the user to scroll between options
 * 
 * @param fs SD Card
 * @param encoder ESP32Encoder 
 * @return char* A character array containing the name of the test file
 */
char* selectFiles(fs::FS& fs, ESP32Encoder encoder) {
  int indicator = 0;
  int select = 0;
  int disp = 0;

  // get list of files
  char* files[100];

  File root = fs.open("/");
  if (!root) {
    Serial.println("Failed to open directory");
    clearLCD();
    writeLCD("Oops!", 7, 0);
    writeLCD("Something went wrong", 0, 1);
    writeLCD("Press knob to",3,2);
    writeLCD("restart",6, 3);
    for (;;){
      if (knobIsPressed()){
        reset();
      }
    }
  }
  if (!root.isDirectory()) {
    Serial.println("Not a directory");
    clearLCD();
    writeLCD("Oops!", 7, 0);
    writeLCD("Something went wrong", 0, 1);
    writeLCD("Try restarting box", 0, 3);
    for (;;){
    }
  }
  File file = root.openNextFile();
  int level = 0;
  while (file) {
    if (file.isDirectory()) {
    } else {
      files[level] = (char*)malloc(100 * sizeof(char));
      strcpy(files[level], file.name());
      level++;
    }
    file = root.openNextFile();
  }
  int numFiles = level - 1;
  if (numFiles < 0){
    writeLCD("Error: No files", 0, 0);
    writeLCD("found on SD card", 0, 1);
    for (; ;){
    }
  }  
  long originalPosition = getRotaryInfo(&encoder);
  for (;;) {
    long newPosition = getRotaryInfo(&encoder);
    bool up = (newPosition < originalPosition);
    bool down = (newPosition > originalPosition);
    originalPosition = newPosition;
    int enter = !digitalRead(SW);
    if (up) {
      clearLCD();
      indicator--;
      select--;
    } else if (down) {
      clearLCD();
      indicator++;
      select++;
    }
    if (select == -1) {
      select = 0;
    }
    if (select == numFiles + 1) {
      select = numFiles;
    }
    if (indicator == -1) {
      indicator = 0;
      disp--;
    }
    if (indicator == numFiles + 1){
      indicator = numFiles;
    }
    if (indicator == 4) {
      indicator = 3;
      disp++;
    }
    if (disp == -1) {
      disp = 0;
    }
    if (disp == numFiles - 2 && numFiles != 2) {
      disp = numFiles - 3;
    }
    writeLCD("-", 0, indicator);
    for (int idx = 0; idx < 4; idx ++){
      if (disp + idx > numFiles){
        break;
      }
      writeLCD(files[disp + idx], 2, idx);
    }
    if (enter) {
      clearLCD();
      char* filename = (char*)malloc((strlen(files[select]) + 1) * sizeof(char));
      strcpy(filename, "/");
      strcat(filename, files[select]);
      return filename;
    }
  }
}