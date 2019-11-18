#include <Servo.h> 

const int numServos = 4;
const int numVibrators = 1;

Servo servos[numServos];

Servo weapon;
Servo vibrators[numVibrators];

int servoPins[numServos] = {10,11,12,13};
int weaponPin = 2;
int weaponTarget = 0;
int vibratorPins[numVibrators] = {3};
int vibratorTargets[numVibrators] = {0};
int minMotorPulseRate = 1000; // default: 544
int maxMotorPulseRate = 2000; // default: 2400
int throttleChangeDelay = 15; // how fast to accelerate the motors
long throttleChangeTimer = millis();

void setup() {
  
  Serial.begin(115200);
  //Serial.setTimeout(500);

  // attach motors
  for (int i = 0; i < numServos; i++) {
    servos[i].attach(servoPins[i]);
  }
  
  weapon.attach(weaponPin, minMotorPulseRate, maxMotorPulseRate);
  // Write a minimum value (most ESCs require this correct startup)
  weapon.write(0);
    
  for (int i = 0; i < numVibrators; i++) {
    vibrators[i].attach(vibratorPins[i], minMotorPulseRate, maxMotorPulseRate);
    vibrators[i].write(0);
  }
}

void loop() {

  // Wait for some input
  if (Serial.available() > 0) {
    
    // Read the new throttle value
    char which = (char) Serial.read();
    // check if char one of a-f
    if ((int) which >= (int) 'a' && (int) which <= (int) 'f') {
      int throttle = normalizeThrottle( Serial.parseInt() );
      
      // Change throttle to the new value
      if (getMotorType(which) == 's') {
        servos[(int) which - (int) 'a'].write(throttle);   
      } else if (getMotorType(which) == 'w') {
        weaponTarget = throttle;
      } else if (getMotorType(which) == 'v') {
        vibratorTargets[(int) which - (int) 'f'] = throttle;
      }
      
      // Print it out
      Serial.print("Setting throttle for motor ");
      Serial.print(which);
      Serial.print(" to ");
      Serial.println(throttle);
    }
  }

  // Update motor throttles like specified in throttleChangeDelay
  if (millis() - throttleChangeTimer > throttleChangeDelay) {
    throttleChangeTimer = millis();
    changeThrottle(weapon, weaponTarget);
    for (int i = 0; i < numVibrators; i++) {
      changeThrottle(vibrators[i], vibratorTargets[i]);
    }
  }
}

// returns true if throttle changed
boolean changeThrottle(Servo &servo, int target) {
  int throttle = servo.read();
  if (throttle < target) {
    servo.write(throttle + 1);
    return true;
  }
  if (throttle > target) {
    servo.write(throttle - 1);
    return true;
  }
  return false;
}

// returns s: servo, w: weapon, v: vibrator
char getMotorType(char which) {
  if ((int) which >= (int) 'a' && (int) which <= (int) 'd') {
    return 's';
  } else if (which == 'e') {
    return 'w';
  } else {
    return 'v';
  }
}

int readThrottle(char which) {
  int throttle;
  if (getMotorType(which) == 's') {
    throttle = servos[(int) which - (int) 'a'].read();
  }
  if (getMotorType(which) == 'w') {
    throttle = weapon.read();
  }
  if (getMotorType(which) == 'v') {
    throttle = vibrators[(int) which - (int) 'f'].read();
  }
  
  /*Serial.print("Current throttle for esc ");
  Serial.print(which);
  Serial.print(" is ");
  Serial.println(throttle);*/
  
  return throttle;
}

// Ensure the throttle value is between 0 - 180
int normalizeThrottle(int value) {
  if( value < 0 )
    return 0;
  if( value > 180 )
    return 180;
  return value;
}
