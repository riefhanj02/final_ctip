"""
GPS Testing Tool - Test if your GPS is receiving data
Run this separately to check GPS without camera/detection
"""

import serial
import serial.tools.list_ports
import time
from geopy.geocoders import Nominatim

class GPSMonitor:
    def __init__(self):
        self.lat = None
        self.lng = None
        self.altitude = None
        self.speed = None
        self.satellites = None
        self.updates = 0
        
    def update(self, field, value):
        if field == "lat":
            self.lat = value
        elif field == "lng":
            self.lng = value
        elif field == "altitude":
            self.altitude = value
        elif field == "speed":
            self.speed = value
        elif field == "satellites":
            self.satellites = value
        self.updates += 1
        
    def display(self):
        print("\n" + "="*60)
        print(f"📡 GPS STATUS (Updates: {self.updates})")
        print("="*60)
        
        if self.lat is None or self.lng is None:
            print("❌ NO GPS DATA RECEIVED")
            print("\nPossible reasons:")
            print("  • You're indoors (GPS needs clear sky view)")
            print("  • GPS module not connected")
            print("  • Using simulated data (check Arduino code)")
        else:
            print(f"✅ GPS ACTIVE")
            print(f"Latitude:    {self.lat:.6f}°")
            print(f"Longitude:   {self.lng:.6f}°")
            
            if self.altitude is not None:
                print(f"Altitude:    {self.altitude:.1f} m")
            if self.speed is not None:
                print(f"Speed:       {self.speed:.1f} km/h")
            if self.satellites is not None:
                print(f"Satellites:  {self.satellites}")
                if self.satellites < 4:
                    print("  ⚠️  Low satellite count (need 4+ for good fix)")
            
            # Try to get address
            try:
                geolocator = Nominatim(user_agent="gps_test_tool")
                location = geolocator.reverse(f"{self.lat}, {self.lng}", timeout=5)
                if location:
                    print(f"\n📮 Location: {location.address}")
            except:
                pass
                
        print("="*60)

def find_arduino():
    ports = serial.tools.list_ports.comports()
    for port in ports:
        if 'USB' in port.description or 'Arduino' in port.description or 'CH340' in port.description:
            return port.device
    return None

def parse_line(line, gps):
    try:
        if "GPS_LAT:" in line:
            lat = float(line.split("GPS_LAT:")[1].strip())
            gps.update("lat", lat)
            return True
        elif "GPS_LNG:" in line:
            lng = float(line.split("GPS_LNG:")[1].strip())
            gps.update("lng", lng)
            return True
        elif "GPS_ALTITUDE:" in line:
            alt = float(line.split("GPS_ALTITUDE:")[1].strip().replace(" m", ""))
            gps.update("altitude", alt)
            return True
        elif "GPS_SPEED:" in line:
            speed = float(line.split("GPS_SPEED:")[1].strip().replace(" km/h", ""))
            gps.update("speed", speed)
            return True
        elif "GPS_SATELLITES:" in line:
            sats = int(line.split("GPS_SATELLITES:")[1].strip())
            gps.update("satellites", sats)
            return True
    except:
        pass
    return False

def main():
    print("="*60)
    print("🛰️  GPS TESTING TOOL")
    print("="*60)
    print("This tool monitors GPS data from your Arduino.")
    print("Press Ctrl+C to exit.\n")
    
    # Find Arduino
    port = find_arduino()
    if port is None:
        print("❌ Arduino not found!")
        print("\nAvailable ports:")
        for p in serial.tools.list_ports.comports():
            print(f"  • {p.device}: {p.description}")
        
        port = input("\nEnter port manually (e.g., COM3): ")
        if not port:
            return
    
    print(f"✅ Connected to: {port}\n")
    print("Waiting for GPS data...\n")
    
    gps = GPSMonitor()
    last_display = 0
    
    try:
        ser = serial.Serial(port, 115200, timeout=1)
        time.sleep(2)
        
        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8', errors='ignore').strip()
                
                # Parse GPS data
                if parse_line(line, gps):
                    # Display every 3 seconds
                    if time.time() - last_display > 3:
                        gps.display()
                        last_display = time.time()
                
                # Show all Arduino output
                if line and not line.startswith("GPS_"):
                    print(f"[Arduino] {line}")
                    
    except KeyboardInterrupt:
        print("\n\n👋 Exiting GPS test tool...")
    except Exception as e:
        print(f"\n❌ Error: {e}")
    finally:
        if 'ser' in locals():
            ser.close()

if __name__ == "__main__":
    main()