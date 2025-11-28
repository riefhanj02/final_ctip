from ultralytics import YOLO
import cv2
import math
import serial
import serial.tools.list_ports
import time
import requests
import json
from datetime import datetime
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

# ================== GPS Reverse Geocoding ==================
def get_address_from_coords(lat, lng):
    """Convert GPS coordinates to readable address using Nominatim (OpenStreetMap)"""
    try:
        geolocator = Nominatim(user_agent="motion_detection_system")
        location = geolocator.reverse(f"{lat}, {lng}", timeout=10)
        
        if location:
            return location.address
        else:
            return "Address not found"
    except GeocoderTimedOut:
        return "Geocoding service timed out"
    except GeocoderServiceError:
        return "Geocoding service error"
    except Exception as e:
        return f"Error: {str(e)}"

# ================== GPS Data Storage ==================
class GPSData:
    """Store latest GPS information"""
    def __init__(self):
        self.lat = None
        self.lng = None
        self.altitude = None
        self.speed = None
        self.satellites = None
        self.address = None
        self.last_update = None
        # Last known valid coordinates (persisted while GPS lock is present)
        self.last_valid_lat = None
        self.last_valid_lng = None
    
    def update(self, lat=None, lng=None, altitude=None, speed=None, satellites=None):
        """Update GPS data"""
        if lat is not None:
            self.lat = lat
            # store as last valid when a real latitude is parsed
            self.last_valid_lat = lat
        if lng is not None:
            self.lng = lng
            # store as last valid when a real longitude is parsed
            self.last_valid_lng = lng
        if altitude is not None:
            self.altitude = altitude
        if speed is not None:
            self.speed = speed
        if satellites is not None:
            self.satellites = satellites
        self.last_update = time.time()
        
        # Get address when we have valid coordinates (always update if coords change)
        if self.lat is not None and self.lng is not None:
            # Update address when coordinates change or if not yet fetched
            if self.address is None:
                print(f"🗺️  Getting address for {self.lat:.6f}, {self.lng:.6f}...")
                self.address = get_address_from_coords(self.lat, self.lng)
            elif hasattr(self, '_last_address_lat') and hasattr(self, '_last_address_lng'):
                # Check if coordinates changed significantly (more than ~100m)
                if abs(self.lat - self._last_address_lat) > 0.001 or abs(self.lng - self._last_address_lng) > 0.001:
                    print(f"🗺️  Updating address for new location {self.lat:.6f}, {self.lng:.6f}...")
                    self.address = get_address_from_coords(self.lat, self.lng)
                    self._last_address_lat = self.lat
                    self._last_address_lng = self.lng
            else:
                # First time address fetch
                self._last_address_lat = self.lat
                self._last_address_lng = self.lng
    
    def has_location(self):
        """Check if we have valid GPS coordinates"""
        return self.lat is not None and self.lng is not None

    def get_best_location(self):
        """Return the best available location tuple (lat,lng) or (None,None).

        Preference order:
        1. Current locked GPS (`self.lat`, `self.lng`) if present
        2. Last known valid coordinates (`last_valid_lat`, `last_valid_lng`)
        3. (None, None)
        """
        if self.has_location():
            return (self.lat, self.lng)
        if self.last_valid_lat is not None and self.last_valid_lng is not None:
            return (self.last_valid_lat, self.last_valid_lng)
        return (None, None)
    
    def print_info(self):
        """Print formatted GPS information"""
        if not self.has_location():
            print("📍 GPS: No valid location data")
            return
        
        print("\n" + "="*60)
        print("📍 GPS LOCATION INFORMATION")
        print("="*60)
        print(f"Latitude:    {self.lat:.6f}°")
        print(f"Longitude:   {self.lng:.6f}°")
        if self.altitude is not None:
            print(f"Altitude:    {self.altitude:.1f} m")
        if self.speed is not None:
            print(f"Speed:       {self.speed:.1f} km/h")
        if self.satellites is not None:
            print(f"Satellites:  {self.satellites}")
        if self.address:
            print(f"\n📮 Address:\n{self.address}")
        print("="*60 + "\n")

# Global GPS data object
gps_data = GPSData()

# ================== API Configuration ==================
# Common local paths to try. The project lives under `htdocs/Admin(Expo)/...` in this workspace,
# so requests from Python to `http://localhost/smartplant_admin/...` may fail. We try several
# possible base URLs (including URL-encoded parentheses) and will attempt each when sending.
API_BASE_CANDIDATES = [
    "http://localhost/SMARTPLANT-ADMIN-EXPO/backend",     
    "http://localhost/smartplant-admin-expo/backend",       
    "http://localhost:8081/SMARTPLANT-ADMIN-EXPO/backend",  
]

API_SENSOR_ENDPOINT = "/iot.php?mode=sensor"
API_ALERT_ENDPOINT = "/iot.php?mode=alert"

def try_post_with_fallback(path_suffix, json_payload, timeout=5):
    """Try posting to each candidate base URL until one succeeds.

    Returns the successful Response object, or raises the last exception.
    """
    last_exc = None
    for base in API_BASE_CANDIDATES:
        url = base.rstrip('/') + path_suffix
        try:
            print(f"Attempting POST to: {url}")
            resp = requests.post(url, json=json_payload, timeout=timeout)
            # Return on success (2xx)
            if 200 <= resp.status_code < 300:
                print(f"Success POST -> {url} (status {resp.status_code})")
                return resp
            else:
                print(f"Received status {resp.status_code} from {url}: {resp.text}")
        except requests.exceptions.RequestException as e:
            print(f"Request to {url} failed: {e}")
            last_exc = e

    # If we get here, nothing succeeded
    if last_exc:
        raise last_exc
    raise RuntimeError('All POST attempts returned non-2xx responses')

# ================== Sensor send rate limit (for near-real-time) ==================
# Send at most once every N seconds when sensor updates arrive from Arduino
SENSOR_SEND_INTERVAL = 5  # seconds (adjustable)
last_sensor_sent = 0

# Global sensor data storage
latest_sensor_data = {
    'temperature': None,
    'humidity': None
}

# ================== Find Arduino Port ==================
def find_arduino_port():
    """Automatically find the Arduino port"""
    ports = serial.tools.list_ports.comports()
    for port in ports:
        if 'USB' in port.description or 'Arduino' in port.description or 'CH340' in port.description:
            return port.device
    return None

# ================== Camera Setup ==================
def setup_camera():
    print("Attempting to open camera...")
    cap = None
    
    # Try multiple methods to open camera
    for i in range(3):
        print(f"Trying camera index {i}...")
        cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)
        if cap.isOpened():
            print(f"Success! Camera {i} opened.")
            break
        cap.release()

    # If CAP_DSHOW didn't work, try without it
    if cap is None or not cap.isOpened():
        print("Trying without CAP_DSHOW...")
        for i in range(3):
            cap = cv2.VideoCapture(i)
            if cap.isOpened():
                print(f"Success! Camera {i} opened.")
                break
            cap.release()

    # Check if we successfully opened a camera
    if not cap.isOpened():
        print("ERROR: Could not open any camera!")
        print("Please check:")
        print("1. Camera permissions in Windows Settings")
        print("2. No other apps are using the camera")
        print("3. Camera drivers are installed")
        return None

    # Set resolution
    cap.set(3, 640)
    cap.set(4, 480)
    return cap

# ================== YOLO Detection Function ==================
def run_detection(max_duration=10, no_person_timeout=5):
    """Run YOLO detection for specified duration (seconds)
    
    Args:
        max_duration: Maximum time to run detection (default 10 seconds)
        no_person_timeout: Time to wait before closing if no person detected (default 5 seconds)
    """
    print("\n=== STARTING OBJECT DETECTION ===")
    
    # Print GPS location at start of detection (if available)
    if gps_data.has_location():
        print("\n📍 Current GPS Location:")
        gps_data.print_info()
    else:
        print("\n⚠️  GPS data not yet available - detection will proceed without location")
    
    cap = setup_camera()
    if cap is None:
        return
    
    # Load model
    print("Loading YOLO model...")
    model = YOLO("yolov8n.pt") # Load pre-trained model
    print("Model loaded!")

    # Object classes
    classNames = ["person", "bicycle", "car", "motorbike", "aeroplane", "bus", "train", "truck", "boat",
                  "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
                  "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella",
                  "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", "kite", "baseball bat",
                  "baseball glove", "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup",
                  "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli",
                  "carrot", "hot dog", "pizza", "donut", "cake", "chair", "sofa", "pottedplant", "bed",
                  "diningtable", "toilet", "tvmonitor", "laptop", "mouse", "remote", "keyboard", "cell phone",
                  "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors",
                  "teddy bear", "hair drier", "toothbrush"]

    print(f"Detection will run for max {max_duration} seconds.")
    print(f"Will close after {no_person_timeout} seconds if no person detected.")
    print("Press 'q' to quit early.\n")
    
    start_time = time.time()
    detected_objects = set()
    person_detected = False
    person_detected_ever = False
    
    while True:
        elapsed_time = time.time() - start_time
        
        # Check if max duration exceeded
        if elapsed_time > max_duration:
            print(f"\nMax detection duration ({max_duration}s) reached. Stopping...")
            break
        
        # Check if no person timeout exceeded
        if not person_detected_ever and elapsed_time > no_person_timeout:
            print(f"\nNo person detected after {no_person_timeout}s. Closing early...")
            break
            
        success, img = cap.read()
        
        if not success:
            print("Failed to read frame")
            break
        
        results = model(img, stream=True)# Process webcam frame

        # Reset person detection for this frame
        person_detected = False

        # Process detections
        for r in results:
            boxes = r.boxes

            for box in boxes:
                # Bounding box
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

                # Draw box
                cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 3)

                # Confidence
                confidence = math.ceil((box.conf[0]*100))/100

                # Class name
                cls = int(box.cls[0])
                obj_name = classNames[cls]
                detected_objects.add(obj_name)
                
                # Check if person detected
                if obj_name == "person":
                    person_detected = True
                    person_detected_ever = True
                
                # Display object label
                org = [x1, y1]
                font = cv2.FONT_HERSHEY_SIMPLEX
                fontScale = 0.7
                color = (0, 0, 255) if obj_name == "person" else (255, 0, 0)  # Red for person
                thickness = 2

                label = f"{obj_name} {confidence}"
                cv2.putText(img, label, org, font, fontScale, color, thickness)

        # Show remaining time
        if person_detected_ever:
            remaining = int(max_duration - elapsed_time)
            cv2.putText(img, f"Time left: {remaining}s", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        else:
            remaining = int(no_person_timeout - elapsed_time)
            cv2.putText(img, f"Closing in: {remaining}s (no person)", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 165, 255), 2)
        
        # Show person detection status
        if person_detected:
            cv2.putText(img, "PERSON DETECTED!", (10, 70), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        # Show GPS coordinates on video feed (bottom left) - only if available
        y_offset = img.shape[0] - 10
        if gps_data.has_location():
            # Format latitude/longitude in readable format
            lat_dir = "N" if gps_data.lat >= 0 else "S"
            lng_dir = "E" if gps_data.lng >= 0 else "W"
            lat_abs = abs(gps_data.lat)
            lng_abs = abs(gps_data.lng)
            
            gps_text = f"Lat: {lat_abs:.6f}{lat_dir}, Lng: {lng_abs:.6f}{lng_dir}"
            cv2.putText(img, gps_text, (10, y_offset), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
            
            # Show readable location if address is available
            if gps_data.address:
                # Truncate address if too long for display
                addr_display = gps_data.address[:50] + "..." if len(gps_data.address) > 50 else gps_data.address
                cv2.putText(img, f"Location: {addr_display}", (10, y_offset - 20), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 255), 1)
                y_offset_start = y_offset - 45
            else:
                y_offset_start = y_offset - 25
            
            # Show altitude if available
            if gps_data.altitude is not None:
                alt_text = f"Altitude: {gps_data.altitude:.1f}m"
                cv2.putText(img, alt_text, (10, y_offset_start), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
                y_offset_start -= 20
            
            # Show satellites if available
            if gps_data.satellites is not None:
                sat_text = f"Satellites: {gps_data.satellites}"
                cv2.putText(img, sat_text, (10, y_offset_start), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
        else:
            # Show "No GPS" message
            cv2.putText(img, "GPS: Waiting for signal...", (10, y_offset), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 165, 0), 2)

        cv2.imshow('Motion-Triggered Detection', img)
        if cv2.waitKey(1) == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    
    print("\n=== DETECTION COMPLETE ===")
    if detected_objects:
        print(f"Objects detected: {', '.join(detected_objects)}")
        if person_detected_ever:
            print("✅ Person was detected during scan")
            # Send alert to API
            send_person_alert()
        else:
            print("❌ No person detected")
    else:
        print("No objects detected.")
    
    # Print final GPS location if available
    if gps_data.has_location():
        print("\n📍 Detection Location:")
        gps_data.print_info()
    else:
        print("\n⚠️  GPS location was not available during this detection")
    
    print("=" * 40 + "\n")

# ================== NMEA Sentence Parsing ==================
def parse_nmea_coordinate(nmea_coord, hemisphere):
    """Convert NMEA DDMM.MMMM format to decimal degrees"""
    try:
        # NMEA format: DDMM.MMMM where DD=degrees, MM.MMMM=minutes
        coord_float = float(nmea_coord)
        degrees = int(coord_float / 100)
        minutes = coord_float - (degrees * 100)
        decimal_degrees = degrees + (minutes / 60.0)
        
        # Apply hemisphere sign (S and W are negative)
        if hemisphere.upper() in ['S', 'W']:
            decimal_degrees = -decimal_degrees
            
        return decimal_degrees
    except (ValueError, TypeError):
        return None

def parse_nmea_sentence(line):
    """Parse NMEA GPS sentences (GPGLL, GPRMC, etc.) and extract coordinates"""
    global gps_data
    
    try:
        # Check if line starts with $ (NMEA sentence)
        if not line.startswith('$'):
            return False
            
        # Remove checksum if present
        if '*' in line:
            line = line.split('*')[0]
        
        # Split by comma
        parts = line.split(',')
        if len(parts) < 2:
            return False
            
        sentence_type = parts[0]
        
        # Parse GPGLL sentence: $GPGLL,lat,N/S,lng,E/W,time,A/D*checksum
        if sentence_type == '$GPGLL':
            if len(parts) >= 6 and parts[1] and parts[3]:  # Check if coords exist
                lat_raw = parts[1]
                lat_hem = parts[2]
                lng_raw = parts[3]
                lng_hem = parts[4]
                status = parts[5] if len(parts) > 5 else ''
                
                # Only parse if status is 'A' (valid fix)
                if status.upper() == 'A':
                    lat = parse_nmea_coordinate(lat_raw, lat_hem)
                    lng = parse_nmea_coordinate(lng_raw, lng_hem)
                    
                    if lat is not None and lng is not None:
                        print(f"✓ Parsed GPGLL: Lat={lat:.6f}°, Lng={lng:.6f}°")
                        gps_data.update(lat=lat, lng=lng)
                        return True
                        
        # Parse GPRMC sentence: $GPRMC,time,status,lat,N/S,lng,E/W,speed,course,date,,,,
        elif sentence_type == '$GPRMC':
            if len(parts) >= 7 and parts[3] and parts[5]:  # Check if coords exist
                status = parts[2]  # 'A' = valid, 'V' = invalid
                lat_raw = parts[3]
                lat_hem = parts[4]
                lng_raw = parts[5]
                lng_hem = parts[6]
                speed_knots = parts[7] if len(parts) > 7 and parts[7] else None
                
                # Only parse if status is 'A' (valid fix)
                if status.upper() == 'A':
                    lat = parse_nmea_coordinate(lat_raw, lat_hem)
                    lng = parse_nmea_coordinate(lng_raw, lng_hem)
                    
                    if lat is not None and lng is not None:
                        print(f"✓ Parsed GPRMC: Lat={lat:.6f}°, Lng={lng:.6f}°")
                        gps_data.update(lat=lat, lng=lng)
                        
                        # Parse speed (knots to km/h)
                        if speed_knots:
                            try:
                                speed_kmh = float(speed_knots) * 1.852
                                gps_data.update(speed=speed_kmh)
                            except ValueError:
                                pass
                        return True
                        
        # Parse GPGGA sentence for altitude: $GPGGA,time,lat,N/S,lng,E/W,quality,numSV,HDOP,alt,M,sep,M,diffAge,diffStation*checksum
        elif sentence_type == '$GPGGA':
            if len(parts) >= 10 and parts[2] and parts[4]:  # Check if coords exist
                quality = parts[6] if len(parts) > 6 else '0'
                lat_raw = parts[2]
                lat_hem = parts[3]
                lng_raw = parts[4]
                lng_hem = parts[5]
                altitude_str = parts[9] if len(parts) > 9 else None
                num_satellites = parts[7] if len(parts) > 7 else None
                
                # Quality: 0=no fix, 1=GPS fix, 2=DGPS fix
                if quality and quality != '0':
                    lat = parse_nmea_coordinate(lat_raw, lat_hem)
                    lng = parse_nmea_coordinate(lng_raw, lng_hem)
                    
                    if lat is not None and lng is not None:
                        print(f"✓ Parsed GPGGA: Lat={lat:.6f}°, Lng={lng:.6f}°")
                        gps_data.update(lat=lat, lng=lng)
                        
                        # Parse altitude
                        if altitude_str:
                            try:
                                altitude = float(altitude_str)
                                gps_data.update(altitude=altitude)
                            except ValueError:
                                pass
                                
                        # Parse number of satellites
                        if num_satellites:
                            try:
                                satellites = int(num_satellites)
                                gps_data.update(satellites=satellites)
                            except ValueError:
                                pass
                        return True
                        
    except (ValueError, IndexError, AttributeError) as e:
        # Silently fail for NMEA parsing errors (normal for incomplete sentences)
        pass
    
    return False

# ================== Parse Arduino GPS Data ==================
def parse_gps_line(line):
    """Parse GPS data from Arduino serial output (both formatted and NMEA sentences)"""
    global gps_data
    
    # First try NMEA sentence parsing
    if parse_nmea_sentence(line):
        return
    
    # Then try formatted GPS_* lines
    try:
        # Debug: print what we're trying to parse
        if "GPS_" in line:
            print(f"[GPS Parser] Parsing: {line}")
        
        if "GPS_LAT:" in line:
            lat_str = line.split("GPS_LAT:")[1].strip()
            lat = float(lat_str)
            print(f"✓ Parsed Latitude: {lat}")
            gps_data.update(lat=lat)
            
        elif "GPS_LNG:" in line:
            lng_str = line.split("GPS_LNG:")[1].strip()
            lng = float(lng_str)
            print(f"✓ Parsed Longitude: {lng}")
            gps_data.update(lng=lng)
            
        elif "GPS_ALTITUDE:" in line:
            alt_str = line.split("GPS_ALTITUDE:")[1].strip().replace(" m", "")
            altitude = float(alt_str)
            print(f"✓ Parsed Altitude: {altitude}")
            gps_data.update(altitude=altitude)
            
        elif "GPS_SPEED:" in line:
            speed_str = line.split("GPS_SPEED:")[1].strip().replace(" km/h", "")
            speed = float(speed_str)
            print(f"✓ Parsed Speed: {speed}")
            gps_data.update(speed=speed)
            
        elif "GPS_SATELLITES:" in line:
            satellites = int(line.split("GPS_SATELLITES:")[1].strip())
            print(f"✓ Parsed Satellites: {satellites}")
            gps_data.update(satellites=satellites)
            
    except (ValueError, IndexError) as e:
        # Only print error for formatted GPS lines, not NMEA (normal to have many unparseable NMEA lines)
        if "GPS_" in line:
            print(f"❌ GPS Parse Error for line '{line}': {e}")

# ================== Parse Arduino Sensor Data ==================
def parse_sensor_line(line):
    """Parse temperature and humidity from Arduino serial output"""
    global latest_sensor_data
    
    try:
        if "Temperature:" in line:
            # Format: "Temperature: 25.50 °C  |  Humidity: 60.00 %"
            parts = line.split("Temperature:")[1].strip()
            temp_str = parts.split("°C")[0].strip()
            temp = float(temp_str)
            latest_sensor_data['temperature'] = temp
            
        if "Humidity:" in line:
            parts = line.split("Humidity:")[1].strip()
            hum_str = parts.split("%")[0].strip()
            humidity = float(hum_str)
            latest_sensor_data['humidity'] = humidity
            
    except (ValueError, IndexError) as e:
        print(f"❌ Sensor Parse Error for line '{line}': {e}")

# ================== Send Sensor Reading to API ==================
def send_sensor_reading():
    """Send current sensor reading to PHP API"""
    try:
        payload = {
            'temperature': latest_sensor_data.get('temperature'),
            'humidity': latest_sensor_data.get('humidity'),
            'gps_latitude': gps_data.lat,
            'gps_longitude': gps_data.lng,
            'gps_altitude': gps_data.altitude,
            'gps_speed': gps_data.speed,
            'gps_satellites': gps_data.satellites
        }

        resp = try_post_with_fallback(API_SENSOR_ENDPOINT, payload, timeout=5)
        if resp is not None and 200 <= resp.status_code < 300:
            print("✅ Sensor reading sent to API")
    except Exception as e:
        print(f"❌ Failed to send sensor reading to API: {e}")

# ================== Send Person Detection Alert to API ==================
def send_person_alert():
    """Send person detection alert with GPS location to PHP API"""
    best_lat, best_lng = gps_data.get_best_location()
    
    # TIMESTAMP: Capture when alert is sent from device
    device_timestamp = datetime.utcnow().isoformat()
    
    try:
        payload = {
            'alert_type': 'person_detected',
            'gps_latitude': best_lat,
            'gps_longitude': best_lng,
            'gps_altitude': gps_data.altitude,
            'gps_address': gps_data.address,
            'confidence_score': None,
            'device_timestamp': device_timestamp  # ADD THIS
        }
        
        print(f"[LATENCY] Sending alert at {device_timestamp}")
        resp = try_post_with_fallback(API_ALERT_ENDPOINT, payload, timeout=5)
        if resp is not None and 200 <= resp.status_code < 300:
            print("🚨 Person detection alert sent to admin dashboard!")
    except Exception as e:
        print(f"❌ Failed to send alert to API: {e}")

# ================== Arduino Monitor Thread ==================
def monitor_arduino(arduino_port, max_duration=10, no_person_timeout=5):
    """Monitor Arduino serial for motion trigger and GPS data"""
    try:
        ser = serial.Serial(arduino_port, 115200, timeout=1)
        print(f"Connected to Arduino on {arduino_port}")
        print("GPS data will be collected in background...")
        print("Motion detection is ACTIVE - camera will trigger immediately!\n")
        
        time.sleep(2)  # Wait for Arduino to initialize
        
        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8', errors='ignore').strip()
                
                # Continue parsing GPS data in background
                parse_gps_line(line)
                
                # Parse sensor data (temperature, humidity)
                if "Temperature:" in line or "Humidity:" in line:
                    parse_sensor_line(line)
                    # Send sensor reading immediately with rate limit
                    try:
                        now = time.time()
                        # use global last_sensor_sent variable
                        global last_sensor_sent
                        if latest_sensor_data.get('temperature') is not None and (now - last_sensor_sent) >= SENSOR_SEND_INTERVAL:
                            send_sensor_reading()
                            last_sensor_sent = now
                    except Exception as e:
                        print(f"Error while attempting immediate sensor POST: {e}")
                
                # Show GPS status updates when coordinates are first received
                if "GPS_LAT:" in line or "GPS_LNG:" in line:
                    if gps_data.has_location():
                        print(f"📍 GPS LOCKED: {gps_data.lat:.6f}°, {gps_data.lng:.6f}°")
                        # Print full GPS info on first lock
                        if gps_data.last_update is not None and time.time() - gps_data.last_update < 2:
                            gps_data.print_info()
                
                # Print all Arduino messages (except GPS lines and NMEA sentences to reduce spam)
                if "GPS_" not in line and not line.startswith('$'):
                    print(f"[Arduino] {line}")
                
                # Send sensor reading when we have complete data (every 10 seconds from Arduino)
                if "========================================" in line and latest_sensor_data.get('temperature') is not None:
                    send_sensor_reading()
                
                # Check for motion trigger - NO GPS WAIT REQUIRED!
                if "TRIGGER_CAMERA" in line:
                    print("\n" + "="*50)
                    print("🚨 MOTION DETECTED - STARTING CAMERA!")
                    if gps_data.has_location():
                        print("✅ GPS data available")
                    else:
                        print("⚠️  GPS data not yet available (will continue anyway)")
                    print("="*50)
                    
                    run_detection(max_duration, no_person_timeout)
                    print("Waiting for next motion detection...\n")
                    
    except serial.SerialException as e:
        print(f"Error connecting to Arduino: {e}")
    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        if 'ser' in locals():
            ser.close()

# ================== Main Program ==================
if __name__ == "__main__":
    print("="*50)
    print("Motion-Triggered Object Detection System")
    print("with GPS Location Tracking")
    print("="*50)
    
    # Find Arduino
    arduino_port = find_arduino_port()
    
    if arduino_port is None:
        print("\nArduino not found! Available ports:")
        ports = serial.tools.list_ports.comports()
        for port in ports:
            print(f"  - {port.device}: {port.description}")
        
        manual_port = input("\nEnter port manually (e.g., COM3) or press Enter to exit: ")
        if manual_port:
            arduino_port = manual_port
        else:
            exit()
    
    print(f"\nUsing Arduino port: {arduino_port}")
    
    # Configure detection times
    max_duration = 10  # Maximum detection time
    no_person_timeout = 5  # Close after this many seconds if no person
    
    print(f"Max detection duration: {max_duration} seconds")
    print(f"No-person timeout: {no_person_timeout} seconds\n")
    
    # Start monitoring
    monitor_arduino(arduino_port, max_duration, no_person_timeout)