#include <OneWire.h>
#include <DallasTemperature.h>
#include <LiquidCrystal.h>

uint8_t temp_sensor_pin = 5;
float celcius;


OneWire oneWire(temp_sensor_pin);
DallasTemperature sensors(&oneWire);


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:

  sensors.requestTemperatures(); 
  delay(1000);
  celcius = sensors.getTempCByIndex(0);
  Serial.println(celcius);
}
