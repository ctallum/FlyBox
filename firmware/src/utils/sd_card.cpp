#include "../../firmware.h"

/**
 * @brief Initialize the SD card reader and wait until the user inserts a valid card
 * 
 * @return fs::FS 
 */
fs::FS initSD() {
  if (!SD.begin(5)) {
    writeLCD("No SD card detected!", 0, 0);
    writeLCD("Please insert SD",0, 2);
    writeLCD("into box.",0, 3);
    // if cannot find card, keep attempting to find card
    for(;;){
      if (SD.begin(5)){
        clearLCD();
        break;
      }
    }
    return SD;
  }
  uint8_t cardType = SD.cardType();

  if (cardType == CARD_NONE) {
    writeLCD("No SD card detected", 0, 0);
    writeLCD("Please insert SD",0, 2);
    writeLCD("into box.",0, 3);
    for (;;){
      // if cannot find card, keep attempting to find card
      if (cardType != CARD_NONE){
        clearLCD();
        break;
      }
    }
    return SD;
  }
  return SD;
}


