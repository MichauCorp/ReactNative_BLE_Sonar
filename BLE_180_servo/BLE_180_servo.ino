#include <ArduinoBLE.h>
#include <Servo.h>

#define SERVICE_UUID "19B10000-E8F2-537E-4F6C-D104768A1214"
#define ANGLE_CHARACTERISTIC_UUID "19B10002-E8F2-537E-4F6C-D104768A1215"

BLEService myService(SERVICE_UUID);
BLEStringCharacteristic angleCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify, 20);

Servo myServo;

const int servoPin = 0;  // Adjust this to your actual servo pin
const int servoMinPos = 0;
const int servoMaxPos = 180;
int currentPos = 90;
bool rotatingClockwise = true;
unsigned long lastRotationTime = 0;
const int rotationInterval = 15;  // Time between each degree of rotation (ms)

void setup() {
  Serial.begin(9600);
  
  if (!BLE.begin()) {
    Serial.println("Starting BLE failed!");
    while (1);
  }

  BLE.setLocalName("BLE Servo");
  BLE.setAdvertisedService(myService);

  myService.addCharacteristic(angleCharacteristic);

  BLE.addService(myService);
  BLE.advertise();

  myServo.attach(servoPin);
  myServo.write(currentPos);

  Serial.println("BLE Servo Device Ready");
}

void loop() {
  BLEDevice central = BLE.central();

  if (central) {
    Serial.print("Connected to central: ");
    Serial.println(central.address());

    while (central.connected()) {
      if (millis() - lastRotationTime >= rotationInterval) {
        rotateServo();
        lastRotationTime = millis();
      }
    }

    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
    myServo.write(90);  // Return to center position
    currentPos = 90;
    updateAngleCharacteristic();
  }
}

void rotateServo() {
  if (rotatingClockwise) {
    currentPos++;
    if (currentPos >= servoMaxPos) {
      rotatingClockwise = false;
    }
  } else {
    currentPos--;
    if (currentPos <= servoMinPos) {
      rotatingClockwise = true;
    }
  }
  myServo.write(currentPos);
  updateAngleCharacteristic();
}

void updateAngleCharacteristic() {
  angleCharacteristic.writeValue(String(currentPos));
  Serial.print("Angle sent: ");
  Serial.println(currentPos);
}
