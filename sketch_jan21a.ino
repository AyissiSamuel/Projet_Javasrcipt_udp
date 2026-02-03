#include "DHT.h"

// ===== DHT11 =====
#define DHTPIN A0
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// ===== HC-SR04 =====
#define TRIG_PIN A3
#define ECHO_PIN A4
#define VCC_PIN  A2
#define GND_PIN  A5

long duree;
float distance;

void setup() {
  Serial.begin(9600);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(VCC_PIN, OUTPUT);
  pinMode(GND_PIN, OUTPUT);

  digitalWrite(VCC_PIN, HIGH);
  digitalWrite(GND_PIN, LOW);

  dht.begin();
}

void loop() {
  // ---- Distance ----
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  duree = pulseIn(ECHO_PIN, HIGH, 30000);
  distance = duree * 0.034 / 2;

  // ---- Temp / Hum ----
  float humidite = dht.readHumidity();
  float temperature = dht.readTemperature();

  // ---- JSON ----
  Serial.print("{\"distance\":");
  Serial.print(distance);
  Serial.print(",\"temperature\":");
  Serial.print(temperature);
  Serial.print(",\"humidite\":");
  Serial.print(humidite);
  Serial.println("}");

  delay(1000);
}
