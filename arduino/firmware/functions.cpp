#include "header.h"

void listDir(fs::FS& fs, const char* dirname, uint8_t levels) {
  Serial.printf("Listing directory: %s\n", dirname);

  File root = fs.open(dirname);
  if (!root) {
    Serial.println("Failed to open directory");
    return;
  }
  if (!root.isDirectory()) {
    Serial.println("Not a directory");
    return;
  }

  File file = root.openNextFile();
  while (file) {
    if (file.isDirectory()) {
      Serial.print("  DIR : ");
      Serial.println(file.name());
      if (levels) {
        listDir(fs, file.name(), levels - 1);
      }
    } else {
      Serial.print("  FILE: ");
      Serial.print(file.name());
      Serial.print("  SIZE: ");
      Serial.println(file.size());
    }
    file = root.openNextFile();
  }
}

void createDir(fs::FS& fs, const char* path) {
  Serial.printf("Creating Dir: %s\n", path);
  if (fs.mkdir(path)) {
    Serial.println("Dir created");
  } else {
    Serial.println("mkdir failed");
  }
}

void removeDir(fs::FS& fs, const char* path) {
  Serial.printf("Removing Dir: %s\n", path);
  if (fs.rmdir(path)) {
    Serial.println("Dir removed");
  } else {
    Serial.println("rmdir failed");
  }
}

void readFile(fs::FS& fs, const char* path) {
  Serial.printf("Reading file: %s\n", path);

  File file = fs.open(path);
  if (!file) {
    Serial.println("Failed to open file for reading");
    return;
  }

  Serial.print("Read from file: ");
  while (file.available()) {
    Serial.write(file.read());
  }
  file.close();
}

void writeFile(fs::FS& fs, const char* path, const char* message) {
  Serial.printf("Writing file: %s\n", path);

  File file = fs.open(path, FILE_WRITE);
  if (!file) {
    Serial.println("Failed to open file for writing");
    return;
  }
  if (file.print(message)) {
    Serial.println("File written");
  } else {
    Serial.println("Write failed");
  }
  file.close();
}

void appendFile(fs::FS& fs, const char* path, const char* message) {
  Serial.printf("Appending to file: %s\n", path);

  File file = fs.open(path, FILE_APPEND);
  if (!file) {
    Serial.println("Failed to open file for appending");
    return;
  }
  if (file.print(message)) {
    Serial.println("Message appended");
  } else {
    Serial.println("Append failed");
  }
  file.close();
}

void renameFile(fs::FS& fs, const char* path1, const char* path2) {
  Serial.printf("Renaming file %s to %s\n", path1, path2);
  if (fs.rename(path1, path2)) {
    Serial.println("File renamed");
  } else {
    Serial.println("Rename failed");
  }
}

void deleteFile(fs::FS& fs, const char* path) {
  Serial.printf("Deleting file: %s\n", path);
  if (fs.remove(path)) {
    Serial.println("File deleted");
  } else {
    Serial.println("Delete failed");
  }
}

void testFileIO(fs::FS& fs, const char* path) {
  File file = fs.open(path);
  static uint8_t buf[512];
  size_t len = 0;
  uint32_t start = millis();
  uint32_t end = start;
  if (file) {
    len = file.size();
    size_t flen = len;
    start = millis();
    while (len) {
      size_t toRead = len;
      if (toRead > 512) {
        toRead = 512;
      }
      file.read(buf, toRead);
      len -= toRead;
    }
    end = millis() - start;
    Serial.printf("%u bytes read for %u ms\n", flen, end);
    file.close();
  } else {
    Serial.println("Failed to open file for reading");
  }


  file = fs.open(path, FILE_WRITE);
  if (!file) {
    Serial.println("Failed to open file for writing");
    return;
  }

  size_t i;
  start = millis();
  for (i = 0; i < 2048; i++) {
    file.write(buf, 512);
  }
  end = millis() - start;
  Serial.printf("%u bytes written for %u ms\n", 2048 * 512, end);
  file.close();
}

Event* NewEvent(int device, int frequency, unsigned long start, unsigned long stop) {
  struct Event* event = (struct Event*)malloc(sizeof(struct Event));

  event->device = device;
  event->frequency = frequency;
  event->start = start;
  event->stop = stop;

  return event;
}

EventNode* NewEventNode(Event* event) {
  struct EventNode* node = (struct EventNode*)malloc(sizeof(struct EventNode));

  node->current = event;
  node->next = NULL;

  return node;
}

EventList* NewEventList() {
  struct EventList* list = (struct EventList*)malloc(sizeof(struct EventList));

  list->root = NULL;
  list->n_events = NULL;

  return list;
}


void AddEvent(EventList* s, EventNode* n) {
  if (s->root == NULL) {
    s->root = n;
  } else {
    EventNode* current_node = s->root;
    while (current_node->next != NULL) {
      current_node = current_node->next;
    }
    current_node->next = n;
  }
  s->n_events++;
}

EventList* DecodeFile(const char* filename) {
  EventList* FlyBoxEvents = NewEventList();
  StaticJsonDocument<256> doc;

  File myFile = SD.open(filename);
  if (myFile) {

    myFile.find("[");
    do {
      DeserializationError error = deserializeJson(doc, myFile);
      if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
      }

      int device = atoi(doc["group"]);
      // int string_len = strlen(device);

      // char* const_device = (char*)malloc(string_len * sizeof(char));
      // strcpy(const_device, device);

      int frequency = doc["itemProps"]["frequency"];
      unsigned long start = doc["start"];
      unsigned long stop = doc["end"];

      // Time* time_start = ConvertTime(start);
      // Time* time_stop = ConvertTime(stop);

      Event* event = NewEvent(device, frequency, start/1000, stop/1000);
      EventNode* event_node = NewEventNode(event);

      AddEvent(FlyBoxEvents, event_node);

    } while (myFile.findUntil(",", "]"));
  }
  return FlyBoxEvents;
}

LiquidCrystal_I2C init_lcd() {
  LiquidCrystal_I2C lcd(0x27, 20, 4);

  lcd.init();
  lcd.clear();
  lcd.backlight();  // Make sure backlight is on
  return lcd;
}

void writeLCD(LiquidCrystal_I2C lcd, char* s, int x, int y) {
  lcd.setCursor(x, y);
  lcd.print(s);
}

char* getFiles(LiquidCrystal_I2C lcd, fs::FS& fs) {

  int indicator = 0;
  int prev_up = 0;
  int prev_down = 0;
  int select = 0;
  int disp = 0;

  // get list of files
  char* files[100];

  File root = fs.open("/");
  if (!root) {
    Serial.println("Failed to open directory");
    return "";
  }
  if (!root.isDirectory()) {
    Serial.println("Not a directory");
    return "";
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

  for (;;) {
    int up = !digitalRead(BUTTON_UP);
    int down = !digitalRead(BUTTON_DOWN);
    int enter = !digitalRead(BUTTON_ENTER);
    
    if (up && prev_up == 0) {
      lcd.clear();
      indicator--;
      select--;
      prev_up = 1;
      Serial.println("UP");
    } else if (down && prev_down == 0) {
      lcd.clear();
      indicator++;
      select++;
      prev_down = 1;
      Serial.println("DOWN");
    }
    if (!up && prev_up == 1) {
      prev_up = 0;
    }
    if (!down && prev_down == 1) {
      prev_down = 0;
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
      writeLCD(lcd, files[select], 0, 0);

      char* filename = (char*)malloc((strlen(files[select]) + 1) * sizeof(char));
      strcpy(filename, "/");
      strcat(filename, files[select]);
      return filename;
    }
  }
}

fs::FS init_SD(LiquidCrystal_I2C lcd) {
  if (!SD.begin(5)) {
    Serial.println("Card Mount Failed");
    writeLCD(lcd, "Card Mount Failed", 0, 0);
    return SD;
  }
  uint8_t cardType = SD.cardType();

  if (cardType == CARD_NONE) {
    writeLCD(lcd, "No SD card attached", 0, 0);
    return SD;
  }

  return SD;
}

void init_buttons(){
  pinMode(BUTTON_UP, INPUT_PULLUP);
  pinMode(BUTTON_DOWN, INPUT_PULLUP);
  pinMode(BUTTON_ENTER, INPUT_PULLUP);
}