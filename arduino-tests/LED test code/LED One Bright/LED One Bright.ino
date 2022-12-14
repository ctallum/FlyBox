// color swirl! connect an RGB LED to the PWM pins as indicated
// in the #defines
// public domain, enjoy!
 
#define WHITEPIN 26
#define REDPIN 25
#define GREENPIN 27
#define IRPIN 33

#define brightness 100 //255 max

void setup() {
  Serial.begin(9600); // start the serial port and set the baud rate
  pinMode(REDPIN, OUTPUT);
  pinMode(GREENPIN, OUTPUT);
  pinMode(WHITEPIN, OUTPUT);
  pinMode(IRPIN, OUTPUT);
}
 
 
void loop() {
  analogWrite(GREENPIN, brightness);
  delay(50);
 }