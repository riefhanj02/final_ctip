#include <Arduino.h>
#include "DHT.h"

// ================== DHT11 Section ==================
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
unsigned long lastDHTRead = 0;
const unsigned long dhtInterval = 10000; // 10 seconds

// ================== Motion Sensor + LED Section ==================
const uint8_t led = 26;
const uint8_t motionSensor = 27;
bool motionDetected = false;
unsigned long lastMotionTime = 0;
const unsigned long motionCooldown = 3000; // 3 seconds after each detection

// ================== SIMULATED GPS DATA ==================
// Swinburne University of Technology Sarawak Campus
// Jalan Simpang Tiga, Kuching, Sarawak
const float SIM_LAT = 1.5258;
const float SIM_LNG = 110.3542;
const float SIM_ALTITUDE = 20.0;
const float SIM_SPEED = 0.0;
const int SIM_SATELLITES = 8;

// ================== Function to send GPS data ==================
void sendGPSData() {
  Serial.println("GPS: SIMULATION MODE");
  Serial.print("GPS_LAT: ");
  Serial.println(SIM_LAT, 6);
  Serial.print("GPS_LNG: ");
  Serial.println(SIM_LNG, 6);
  Serial.print("GPS_ALTITUDE: ");
  Serial.print(SIM_ALTITUDE);
  Serial.println(" m");
  Serial.print("GPS_SPEED: ");
  Serial.print(SIM_SPEED);
  Serial.println(" km/h");
  Serial.print("GPS_SATELLITES: ");
  Serial.println(SIM_SATELLITES);
}

// ================== Setup ==================
void setup() {
  Serial.begin(115200);
  Serial.println("\n=== Multi-Sensor System Starting ===");
  Serial.println("⚠️  GPS SIMULATION MODE - Using fake coordinates");
  
  // ---- DHT Setup ----
  dht.begin();
  Serial.println("DHT11 sensor initialized.");
  
  // ---- PIR Setup ----
  pinMode(motionSensor, INPUT);
  pinMode(led, OUTPUT);
  digitalWrite(led, LOW);
  Serial.println("Warming up PIR sensor (30s)...");
  delay(30000);
  Serial.println("PIR sensor ready!");
  
  // SEND GPS DATA IMMEDIATELY ON STARTUP
  Serial.println("\n========================================");
  Serial.println("📍 INITIAL GPS DATA");
  Serial.println("========================================");
  sendGPSData();
  Serial.println("========================================\n");
  
  Serial.println("System ready!\n");
}

// ================== Loop ==================
void loop() {
  unsigned long now = millis();
  
  // ---------- Motion Sensor Logic ----------
  int motionState = digitalRead(motionSensor);
  if (motionState == HIGH && !motionDetected && (now - lastMotionTime > motionCooldown)) {
    motionDetected = true;
    digitalWrite(led, HIGH);
    Serial.println("[MOTION DETECTED!]");
    
    // Send trigger signal to Python
    Serial.println("TRIGGER_CAMERA");
    lastMotionTime = now;
    delay(3000); // pause detection for 3 seconds
    digitalWrite(led, LOW);
    motionDetected = false;
  }
  
  // ---------- DHT + Simulated GPS Data (every 10s) ----------
  if (now - lastDHTRead >= dhtInterval) {
    lastDHTRead = now;
    
    // --- DHT11 readings ---
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    
    Serial.println("========================================");
    Serial.print("[Time: ");
    Serial.print(now / 1000);
    Serial.println("s]");
    
    if (isnan(h) || isnan(t)) {
      Serial.println("DHT11: Failed to read!");
    } else {
      Serial.print("Temperature: ");
      Serial.print(t);
      Serial.print(" °C  |  Humidity: ");
      Serial.print(h);
      Serial.println(" %");
    }
    
    // --- SIMULATED GPS data ---
    sendGPSData();
    
    Serial.println("========================================\n");
  }
}