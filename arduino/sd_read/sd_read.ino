#include "header.h"

const char *filename = "/profile.txt";

File myFile;

String json_str = "";

void setup()
{
  Serial.begin(115200);
  if(!SD.begin(5)){
    Serial.println("Card Mount Failed");
    return;
  }
  uint8_t cardType = SD.cardType();

  if(cardType == CARD_NONE){
    Serial.println("No SD card attached");
    return;
  }

  Serial.print("SD Card Type: ");
  if(cardType == CARD_MMC){
    Serial.println("MMC");
  } else if(cardType == CARD_SD){
    Serial.println("SDSC");
  } else if(cardType == CARD_SDHC){
    Serial.println("SDHC");
  } else {
    Serial.println("UNKNOWN");
  }

  uint64_t cardSize = SD.cardSize() / (1024 * 1024);
  Serial.printf("SD Card Size: %lluMB\n", cardSize);
  
  //open file for reading
  myFile = SD.open(filename);
  if (myFile) {
    while (myFile.available()){
      json_str += (char)myFile.read();
    }
    // close the file:
    myFile.close();
  } else {
  	// if the file didn't open, print an error:
    Serial.println("error opening profile.txt");
  }
  
  int json_len = json_str.length();

  char* json_array = new char[json_len + 1];
  strcpy(json_array, json_str.c_str());

  StaticJsonDocument<256> doc;

  DeserializationError error = deserializeJson(doc, json_array);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  EventList* FlyBoxEvents = NewEventList();


  for (JsonObject Event_JSON : doc["Events"].as<JsonArray>()) {

    const char* device = Event_JSON["Device"]; // "red_led", "white_led", "red_led"
    int frequency = Event_JSON["Frequency"]; // 0, 0, 5
    const char* start = Event_JSON["Start"]; // "00:00", "00:00", "09:00"
    const char* stop = Event_JSON["Stop"]; // "09:00", "12:00", "24:00"

    Time* time_start = ConvertTime(start);
    Time* time_stop = ConvertTime(stop);

    Event* event = NewEvent(device, frequency, time_start, time_stop);
    EventNode* event_node = NewEventNode(event);

    AddEvent(FlyBoxEvents, event_node);

  }

  EventNode* current_event = FlyBoxEvents->root;
  for (int i = 0; i < FlyBoxEvents->n_events; i ++){
    Serial.println(current_event->current->device);
    Serial.println(current_event->current->frequency);
    Serial.println(current_event->current->start->hour);
    Serial.println(current_event->current->start->minute);

    current_event = current_event->next;
  }


}



void loop(){

}
