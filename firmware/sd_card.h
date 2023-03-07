#ifndef sd_card_h
#define sd_card_h

void listDir(fs::FS& fs, const char* dirname, uint8_t levels);
void createDir(fs::FS& fs, const char* path);
void removeDir(fs::FS& fs, const char* path);
void readFile(fs::FS& fs, const char* path);
void writeFile(fs::FS& fs, const char* path, const char* message);
void appendFile(fs::FS& fs, const char* path, const char* message);
void renameFile(fs::FS& fs, const char* path1, const char* path2);
void deleteFile(fs::FS& fs, const char* path);
void testFileIO(fs::FS& fs, const char* path);

fs::FS init_SD(LiquidCrystal_I2C lcd); // SD Card
char* getFiles(LiquidCrystal_I2C lcd, fs::FS& fs, ESP32Encoder encoder) ;

#endif