#include <DS3231.h>
DS3231  rtc(SDA, SCL);
Time  t;
int solenoidpin = 5;
int entrainpin = 6;
int greenpin = 11;
int redpin = 10;
int entrainment = 254;
int red;
int green;
const long interval = 100; // 100ms, 5Hz
unsigned long previousTime = 0;

void setup() {
  rtc.begin();
  pinMode(6,OUTPUT);
  pinMode(10,OUTPUT);
  pinMode(11,OUTPUT);
  pinMode(5,OUTPUT);
  analogWrite(greenpin,255);
  digitalWrite(redpin,HIGH);
  digitalWrite(solenoidpin,LOW);
  analogWrite(entrainpin,entrainment); 
}

void loop() {
  t = rtc.getTime();
  if (t.hour == 9) {
      analogWrite(entrainpin, 254);
    } 
    if (t.hour == 21) {
      analogWrite(entrainpin, 255);
    }
    
  // Set red LED stimulation
  
  if (t.date == 1 && (t.hour >= 9 && t.hour < 21)) {
      unsigned long currentTime = millis();
      if (currentTime - previousTime >= interval) {
      previousTime = currentTime;
      if (red == HIGH) {
        red = LOW;
      } else {
        red = HIGH;
      }
      digitalWrite(redpin,red);
      }
  }

  else if (t.date == 4 && t.hour >= 9) {
      unsigned long currentTime = millis();
      if (currentTime - previousTime >= interval) {
      previousTime = currentTime;
      if (red == HIGH) {
        red = LOW;
      } else {
        red = HIGH;
      }
      digitalWrite(redpin,red); 
      }
  }

  else if (t.date == 5 && t.hour < 9) {
      unsigned long currentTime = millis();
      if (currentTime - previousTime >= interval) {
      previousTime = currentTime;
      if (red == HIGH) {
        red = LOW;
      } else {
        red = HIGH;
      }
      digitalWrite(redpin,red); 
      }
  }

  else{
  digitalWrite(redpin, HIGH);
  }
  }
