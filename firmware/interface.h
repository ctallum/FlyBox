#pragma once

// libraries 
#include "FS.h"
#include "SD.h"
#include "SPI.h"
#include <string.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>


#define BUTTON_UP 15
#define BUTTON_DOWN 13
#define BUTTON_ENTER 4

// file management 
void listDir(fs::FS& fs, const char* dirname, uint8_t levels);
void createDir(fs::FS& fs, const char* path);
void removeDir(fs::FS& fs, const char* path);
void readFile(fs::FS& fs, const char* path);
void writeFile(fs::FS& fs, const char* path, const char* message);
void appendFile(fs::FS& fs, const char* path, const char* message);
void renameFile(fs::FS& fs, const char* path1, const char* path2);
void deleteFile(fs::FS& fs, const char* path);
void testFileIO(fs::FS& fs, const char* path);

// init functions
LiquidCrystal_I2C init_lcd(LiquidCrystal_I2C lcd); // LCD
fs::FS init_SD(LiquidCrystal_I2C lcd); // SD Card
void init_buttons(); // Buttons

// misc. 
void writeLCD(LiquidCrystal_I2C lcd, char* s, int x, int y);
char* getFiles(LiquidCrystal_I2C lcd, fs::FS& fs);
