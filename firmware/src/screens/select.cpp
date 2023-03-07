#include "../../firmware.h"


// get run file from user interface
char* SelectFiles(LiquidCrystal_I2C lcd, fs::FS& fs, ESP32Encoder encoder) {
  int indicator = 0;
  int select = 0;
  int disp = 0;

  // get list of files
  char* files[100];

  File root = fs.open("/");
  if (!root) {
    Serial.println("Failed to open directory");
<<<<<<< HEAD
    lcd.clear();
    writeLCD(lcd, "Oops!", 7, 0);
    writeLCD(lcd, "Something went wrong", 0, 1);
    writeLCD(lcd, "Try restarting box", 0, 3);
    for (;;){
    }
  }
  if (!root.isDirectory()) {
    Serial.println("Not a directory");
    lcd.clear();
    writeLCD(lcd, "Oops!", 7, 0);
    writeLCD(lcd, "Something went wrong", 0, 1);
    writeLCD(lcd, "Try restarting box", 0, 3);
    for (;;){
    }
=======
    return "";
  }
  if (!root.isDirectory()) {
    Serial.println("Not a directory");
    return "";
>>>>>>> afb1cc6170be149d73719c1995fedb97c4529764
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

  int n_files = level - 1;
<<<<<<< HEAD

  if (n_files < 0){
    writeLCD(lcd, "Error: No files", 0, 0);
    writeLCD(lcd, "found on SD card", 0, 1);
    for (; ;){
    }
  }

  Serial.println(n_files);
=======
>>>>>>> afb1cc6170be149d73719c1995fedb97c4529764
  
  long originalPosition = get_rotary_info(&encoder);
  
  for (;;) {

    long newPosition = get_rotary_info(&encoder);

    bool up = (newPosition < originalPosition);
    bool down = (newPosition > originalPosition);

    originalPosition = newPosition;

    int enter = !digitalRead(SW);
    
    if (up) {
      lcd.clear();
      indicator--;
      select--;
      Serial.println("UP");
    } else if (down) {
      lcd.clear();
      indicator++;
      select++;
      Serial.println("DOWN");
    }
    if (indicator == -1) {
      indicator = 0;
      disp--;
    }
    if (indicator == n_files + 1){
      indicator = n_files;
    }
    if (indicator == 4) {
      indicator = 3;
      disp++;
    }
    if (select == -1) {
      select = 0;
    }
    if (select == n_files + 1) {
      select = n_files;
    }

    if (disp == -1) {
      disp = 0;
    }
    if (disp == n_files - 2) {
      disp = n_files - 3;
    }

    writeLCD(lcd, "-", 0, indicator);

    for (int idx = 0; idx < 4; idx ++){
      if (disp + idx > n_files){
        break;
      }
      writeLCD(lcd, files[disp + idx], 2, idx);
    }


    if (enter) {
      lcd.clear();

      char* filename = (char*)malloc((strlen(files[select]) + 1) * sizeof(char));
      strcpy(filename, "/");
      strcat(filename, files[select]);
      return filename;
    }
  }
}