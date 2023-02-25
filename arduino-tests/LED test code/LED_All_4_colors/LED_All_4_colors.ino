// color swirl! connect an RGB LED to the PWM pins as indicated
// in the #defines
// public domain, enjoy!
 
#define WHITEPIN 3
#define REDPIN 4
#define GREENPIN 2
#define IRPIN 6
 
#define FADESPEED 1     // make this higher to slow down
#define VALUEJUMP 1     // make this higher to speeeeeeeed up even more

#define dimmest 0 //0 min
#define brightest 255//255 max

void setup() {
  Serial.begin(9600); // start the serial port and set the baud rate
  pinMode(REDPIN, OUTPUT);
  pinMode(GREENPIN, OUTPUT);
  pinMode(WHITEPIN, OUTPUT);
  pinMode(IRPIN, OUTPUT);
}
 
 
void loop() {
  int r, g, i, w;
 
 // Red Fade
  for (r = dimmest; r < brightest + 1; r = r + VALUEJUMP) { 
    analogWrite(REDPIN, r);
    delay(FADESPEED);
    Serial.println("RED");
  } 
  for (r = brightest; r >= dimmest;  r = r - VALUEJUMP) { 
    analogWrite(REDPIN, r);
    delay(FADESPEED);
    Serial.println("RED");

  } // Green Fade
  for (g = dimmest; g < brightest + 1; g = g + VALUEJUMP) { 
    analogWrite(GREENPIN, g);
    delay(FADESPEED);
    Serial.println("GREEN");
  } 
  for (g = brightest; g >= dimmest; g = g - VALUEJUMP) { 
    analogWrite(GREENPIN, g);
    delay(FADESPEED);
    Serial.println("GREEN");

  } 
   // IR Fade
  for (i = dimmest; i < brightest + 1; i = i + VALUEJUMP) { 
    analogWrite(IRPIN, i);
    delay(FADESPEED);
    Serial.println("IR");
  } 
  for (i = brightest; i >= dimmest; i = i - VALUEJUMP) { 
    analogWrite(IRPIN, i);
    delay(FADESPEED);
    Serial.println("IR");
  } 

   // White Fade
  for (w = dimmest; w < brightest + 1; w = w + VALUEJUMP) { 
    analogWrite(WHITEPIN, w);
    delay(FADESPEED);
    
    Serial.println("WHITE");
  } 
  for (w = brightest; w >= dimmest; w = w - VALUEJUMP) { 
    analogWrite(WHITEPIN, w);
    delay(FADESPEED);
    
    Serial.println("WHITE");
  }


}