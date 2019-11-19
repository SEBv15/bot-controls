import Weapon from './Weapon'
import Vibrator from './Vibrator'
import Servo from './Servo'

var servos = {
    "frontleft": null,
    "frontright": null,
    "backleft": null,
    "backright": null
}
var vibrators = []
var weapon = null

var activeKeys = {}

// timeouts
var calculateMovementTimeout;
var weaponSpinTimeout = 0;

var moving = false;

function calculateMovement() {
    clearTimeout(calculateMovementTimeout)
    if (activeKeys["space"] || activeKeys["shift"]) {
        calculateMovementTimeout = setTimeout(calculateMovement, 100)
    }

    // Weapon
    if (Date.now() - weaponSpinTimeout > 100) {
        weaponSpinTimeout = Date.now()
        if (activeKeys["space"] && !activeKeys["shift"]) {
            weapon.spinUp()
        } else if (activeKeys["shift"] && !activeKeys["space"]) {
            weapon.spinDown()
        }
    }

    moving = false
    // Servos
    if (activeKeys["w"] && !activeKeys["s"]) {
        if (activeKeys["a"] && !activeKeys["d"]) {
            turnLeft(false)
        } else if (!activeKeys["a"] && activeKeys["d"]) {
            turnRight(false)
        } else {
            for (var [keys, servo] of Object.entries(servos)) {
                servo.forward()
                moving = true
            }
        }
    } else if (activeKeys["s"] && !activeKeys["w"]) {
        if (activeKeys["a"] && !activeKeys["d"]) {
            turnLeft(false, true)
        } else if (!activeKeys["a"] && activeKeys["d"]) {
            turnRight(false, true)
        } else {
            for (var [keys, servo] of Object.entries(servos)) {
                servo.backward()
                moving = true
            }
        }        
    } else if (activeKeys["a"] && !activeKeys["d"]) {
        turnLeft(true)
    } else if (activeKeys["d"] && !activeKeys["a"]) {
        turnRight(true)
    } else {
        for (var [keys, servo] of Object.entries(servos)) {
            servo.off()
        }
    }

    // Vibrators
    for (var vibrator of vibrators) {
        vibrator[(moving?(activeKeys["ctrl"]?"fast":"normal"):"off")]()
    }
}

function turnLeft(sharp = true, backward = false) {
    servos["frontright"][backward?"backward":"forward"]()
    servos["backright"][backward?"backward":"forward"]()
    servos["frontleft"][sharp?"backward":"off"]()
    servos["backleft"][sharp?"backward":"off"]()
    moving = true;
}
function turnRight(sharp = true, backward = false) {
    servos["frontright"][sharp?"backward":"off"]()
    servos["backright"][sharp?"backward":"off"]()
    servos["frontleft"][backward?"backward":"forward"]()
    servos["backleft"][backward?"backward":"forward"]()
    moving = true;
}

function onKey(key) {
    activeKeys[key] = true
    calculateMovement()
}

function offKey(key) {
    activeKeys[key] = false
    calculateMovement()
}

function addWeapon(which, callback) {
    weapon = new Weapon(which, callback)
    return weapon
}

function addServo(which, position, callback) {
    servos[position] = new Servo(which, callback)
    return servos[position]
}

function addVibrator(which, callback) {
    var vib = new Vibrator(which, callback)
    vibrators.push(vib)
    return vib
}

export default {
    onKey,
    offKey,
    addServo,
    addWeapon,
    addVibrator
}