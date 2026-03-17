# MQTT Topics Documentation

## Overview
This document describes all MQTT topics used in the SmartPay RFID Wallet Management System for communication between the ESP8266 device, backend server, and mobile application.

## Team ID
All topics are prefixed with the team identifier: `iot_shield_2026`

## Topic Structure
```
rfid/{team_id}/{category}/{action}
```

---

## 📡 MQTT Topics

### 1. Card Status Topic
**Topic**: `rfid/iot_shield_2026/card/status`

**Direction**: ESP8266 → Backend

**Purpose**: Publishes card detection events when an RFID card is scanned

**Payload Example**:
```json
{
  "uid": "A1B2C3D4",
  "balance": 50.0,
  "status": "detected",
  "device": "ESP8266_RFID",
  "ts": 1710691200
}
```

**Fields**:
- `uid` (string): Unique card identifier (hex format)
- `balance` (number): Simulated balance on device
- `status` (string): Always "detected" for card scans
- `device` (string): Device identifier
- `ts` (number): Unix timestamp

---

### 2. Card Balance Topic
**Topic**: `rfid/iot_shield_2026/card/balance`

**Direction**: Backend → ESP8266

**Purpose**: Sends updated balance information to the device

**Payload Example**:
```json
{
  "uid": "A1B2C3D4",
  "new_balance": 150.0,
  "timestamp": "2024-03-17T10:30:00Z"
}
```

**Fields**:
- `uid` (string): Card identifier
- `new_balance` (number): Updated balance amount
- `timestamp` (string): ISO timestamp

---

### 3. Top-Up Command Topic
**Topic**: `rfid/iot_shield_2026/card/topup`

**Direction**: Backend → ESP8266

**Purpose**: Notifies device of successful top-up transactions

**Payload Example**:
```json
{
  "uid": "A1B2C3D4",
  "amount": 100.0,
  "previousBalance": 50.0,
  "newBalance": 150.0,
  "timestamp": "2024-03-17T10:30:00Z"
}
```

**Fields**:
- `uid` (string): Card identifier
- `amount` (number): Amount added
- `previousBalance` (number): Balance before top-up
- `newBalance` (number): Balance after top-up
- `timestamp` (string): ISO timestamp

---

### 4. Payment Command Topic
**Topic**: `rfid/iot_shield_2026/card/pay`

**Direction**: Backend → ESP8266

**Purpose**: Sends payment confirmation to device

**Payload Example**:
```json
{
  "uid": "A1B2C3D4",
  "amount": 25.0,
  "previousBalance": 150.0,
  "newBalance": 125.0,
  "status": "approved",
  "timestamp": "2024-03-17T10:35:00Z"
}
```

**Fields**:
- `uid` (string): Card identifier
- `amount` (number): Amount deducted
- `previousBalance` (number): Balance before payment
- `newBalance` (number): Balance after payment
- `status` (string): "approved" or "declined"
- `timestamp` (string): ISO timestamp

---

### 5. Device Health Topic
**Topic**: `rfid/iot_shield_2026/device/health`

**Direction**: ESP8266 → Backend

**Purpose**: Periodic health reports from the device (every 60 seconds)

**Payload Example**:
```json
{
  "status": "online",
  "device": "ESP8266_RFID",
  "team": "iot_shield_2026",
  "ip": "192.168.1.100",
  "rssi": -45,
  "free_heap": 32768,
  "uptime": 3600,
  "ts": 1710691200
}
```

**Fields**:
- `status` (string): Device status ("online")
- `device` (string): Device identifier
- `team` (string): Team ID
- `ip` (string): Device IP address
- `rssi` (number): WiFi signal strength (dBm)
- `free_heap` (number): Available memory (bytes)
- `uptime` (number): Uptime in seconds
- `ts` (number): Unix timestamp

---

### 6. Device Status Topic (Last Will & Testament)
**Topic**: `rfid/iot_shield_2026/device/status`

**Direction**: ESP8266 ↔ Backend

**Purpose**: Device online/offline status with LWT (Last Will and Testament)

**Payload Example (Online)**:
```json
{
  "status": "online",
  "timestamp": "2024-03-17T10:00:00Z"
}
```

**Payload Example (Offline - LWT)**:
```json
{
  "status": "offline",
  "timestamp": "2024-03-17T12:00:00Z"
}
```

**Fields**:
- `status` (string): "online" or "offline"
- `timestamp` (string): ISO timestamp

**QoS**: 1 (At least once delivery)
**Retain**: true (Last message is retained by broker)

---

## 🔄 Message Flow Diagrams

### Card Scan Flow
```
ESP8266                Backend              Mobile App
   |                      |                      |
   |-- card/status ------>|                      |
   |                      |-- WebSocket -------->|
   |                      |   (card-scanned)     |
   |                      |                      |
```

### Top-Up Flow
```
Mobile App           Backend              ESP8266
   |                      |                      |
   |-- POST /topup ------>|                      |
   |                      |-- card/topup ------->|
   |<-- WebSocket --------|                      |
   |   (topup-success)    |                      |
```

### Payment Flow
```
Mobile App           Backend              ESP8266
   |                      |                      |
   |-- POST /pay -------->|                      |
   |                      |-- card/pay --------->|
   |<-- WebSocket --------|                      |
   |   (payment-success)  |                      |
```

### Health Monitoring
```
ESP8266                Backend
   |                      |
   |-- device/health ---->|
   |   (every 60s)        |
   |                      |
```

---

## 🔧 MQTT Configuration

### Broker Details
- **Host**: `broker.benax.rw` (157.173.101.159)
- **Port**: 1883 (non-TLS)
- **Protocol**: MQTT v3.1.1

### Client IDs
- **ESP8266**: `ESP8266_iot_shield_2026_{chip_id}`
- **Backend**: `backend_iot_shield_2026_{timestamp}`

### QoS Levels
- Card events: QoS 0 (Fire and forget)
- Device status (LWT): QoS 1 (At least once)
- Commands: QoS 0 (Fire and forget)

### Retained Messages
- `device/status`: Retained (for LWT)
- All other topics: Not retained

---

## 🧪 Testing MQTT Topics

### Using mosquitto_sub (Subscribe)
```bash
# Subscribe to all topics
mosquitto_sub -h broker.benax.rw -t "rfid/iot_shield_2026/#" -v

# Subscribe to card status only
mosquitto_sub -h broker.benax.rw -t "rfid/iot_shield_2026/card/status" -v

# Subscribe to device health
mosquitto_sub -h broker.benax.rw -t "rfid/iot_shield_2026/device/health" -v
```

### Using mosquitto_pub (Publish)
```bash
# Simulate card scan
mosquitto_pub -h broker.benax.rw \
  -t "rfid/iot_shield_2026/card/status" \
  -m '{"uid":"A1B2C3D4","balance":50.0,"status":"detected","device":"TEST","ts":1710691200}'

# Simulate top-up command
mosquitto_pub -h broker.benax.rw \
  -t "rfid/iot_shield_2026/card/topup" \
  -m '{"uid":"A1B2C3D4","amount":100,"newBalance":150}'
```

---

## 📊 Topic Usage Statistics

| Topic | Direction | Frequency | QoS | Retained |
|-------|-----------|-----------|-----|----------|
| card/status | ESP→Backend | On card scan | 0 | No |
| card/balance | Backend→ESP | On balance update | 0 | No |
| card/topup | Backend→ESP | On top-up | 0 | No |
| card/pay | Backend→ESP | On payment | 0 | No |
| device/health | ESP→Backend | Every 60s | 0 | No |
| device/status | Both | On connect/disconnect | 1 | Yes |

---

## 🔒 Security Considerations

1. **No Authentication**: Current setup uses open MQTT broker
2. **No Encryption**: Messages sent in plain text
3. **Topic Validation**: Backend validates all incoming messages
4. **Team Isolation**: Topics prefixed with team ID

### Production Recommendations
- Enable MQTT authentication (username/password)
- Use TLS/SSL encryption (port 8883)
- Implement ACL (Access Control Lists)
- Add message signing/verification
- Rate limiting on topics

---

## 🐛 Troubleshooting

### Device Not Publishing
1. Check WiFi connection
2. Verify MQTT broker address
3. Check topic names match exactly
4. Monitor serial output for errors

### Backend Not Receiving
1. Verify MQTT client connected
2. Check subscription topics
3. Test with mosquitto_sub
4. Check broker logs

### Messages Not Reaching Mobile App
1. Verify WebSocket connection
2. Check Socket.IO event names
3. Monitor browser console
4. Test backend endpoints directly

---

## 📝 Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-03-17 | Initial documentation |

---

**Team**: iot_shield_2026  
**Last Updated**: March 17, 2024
