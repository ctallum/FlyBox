// color swirl! connect an RGB LED to the PWM pins as indicated
// in the #defines
// public domain, enjoy!
 
#define WHITEPIN 3
#define REDPIN 4
#define GREENPIN 2
#define IRPIN 5

#define brightness 255 //255 max

void setup() {
  Serial.begin(9600); // start the serial port and set the baud rate
  pinMode(REDPIN, OUTPUT);
  pinMode(GREENPIN, OUTPUT);
  pinMode(WHITEPIN, OUTPUT);
  pinMode(IRPIN, OUTPUT);
}
 
 
void loop() {
  analogWrite(IRPIN, brightness);
  delay(50);
 }