# SmartPlant IoT System

## Overview
This IoT system monitors sensors (temperature, humidity) and detects motion using a camera with YOLO object detection. When a person is detected, it sends alerts to the admin dashboard with GPS location and timestamp.

## Setup Instructions

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Database Setup
Run the `Database.sql` file in your MySQL database to create the necessary tables:
- `iot_sensor_readings` - Stores temperature, humidity, and GPS data
- `iot_motion_alerts` - Stores motion detection alerts with GPS location

### 3. Configure API Endpoint
Edit `main.py` and update the `API_BASE_URL` if your PHP API is hosted at a different location:
```python
API_BASE_URL = "http://localhost/smartplant_admin/api"  # Change if needed
```

### 4. Run the System
```bash
python main.py
```

The system will:
- Connect to Arduino via serial port
- Monitor sensor readings (temperature, humidity) every 10 seconds
- Send sensor data to the PHP API
- When motion is detected, trigger the camera
- If a person is detected, send an alert with GPS location to the admin dashboard

## How It Works

1. **Arduino** sends sensor data (temperature, humidity) and GPS coordinates via serial
2. **Python script** parses the data and:
   - Sends sensor readings to PHP API every 10 seconds
   - Monitors for motion triggers
   - When motion detected, runs YOLO detection
   - If person detected, sends alert with GPS location to PHP API
3. **PHP API** stores data in MySQL database
4. **Admin Dashboard** displays sensor readings and alerts in real-time

## API Endpoints

The PHP API (`iot.php`) provides:
- `POST /iot.php?mode=sensor` - Receive sensor readings
- `POST /iot.php?mode=alert` - Receive motion alerts
- `GET /iot.php?mode=stats` - Get statistics
- `GET /iot.php?mode=readings` - Get sensor readings
- `GET /iot.php?mode=alerts` - Get motion alerts
- `PUT /iot.php?id={id}` - Mark alert as read

## Troubleshooting

- **Arduino not found**: Check COM port and update `find_arduino_port()` function
- **API connection failed**: Verify `API_BASE_URL` is correct and PHP server is running
- **Camera not opening**: Check camera permissions and ensure no other app is using it

