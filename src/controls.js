import serial from './serial';

var keyTimeout = 100;

var servos = {
    "frontleft": null,
    "frontright": null,
    "backleft": null,
    "backright": null
}
var vibrators = []
var weapon = null

class Servo {
    constructor(which, stateChangeCallback, resetAfter = keyTimeout) {
        this._which = which
        this._dataFromLocalStorage()
        this._storeSettings()
        this._resetAfter = resetAfter
        this._callback = stateChangeCallback
        if (this._twoLegs) {
            this._position = "_off"
        } else {
            this._position = "_forwardOff"
        }
        serial.write(which+this[this._position])
    }
    _dataFromLocalStorage() {
        var data = JSON.parse(localStorage.getItem(this._which + "Servo"));
        if (!data) {
            localStorage.setItem(this._which+"Servo", "{}")
            data = {}
        }
        this._twoLegs = data.twoLegs || false
        this._forward = data.forward || 60
        this._forwardOff = data.forwardOff || 0
        this._backward = data.backward || 120
        this._backwardOff = data.backwardOff || 180
        this._off = data.off || 0
    }
    _storeSettings() {
        localStorage.setItem(this._which+"Servo", JSON.stringify({
            twoLegs: this._twoLegs,
            forward: this._forward,
            forwardOff: this._forwardOff,
            backward: this._backward,
            backwardOff: this._backwardOff,
            off: this._off
        }))
    }
    setPosValue(name, value) {
        this['_'+name] = value
        if (this._position == '_'+name) {
            serial.write(this._which+value)
        }
        this._storeSettings();
    }
    getData() {
        return JSON.parse(localStorage.getItem(this._which + "Servo"));
    }
    forward() {
        this._position = "_forward"
        serial.write(this._which+this._forward)
        clearTimeout(this._timeout)
        this._timeout = setTimeout(() => {
            this.off()
            this._timeout = null
        }, (this._timeout)?this._resetAfter:this._resetAfter*5)
        if (this._callback) {
            this._callback(this._position.substr(1))
        }
    }
    backward() {
        this._position = "_backward"
        serial.write(this._which+this._backward)
        clearTimeout(this._timeout)
        this._timeout = setTimeout(() => {
            this.off()
            this._timeout = null
        }, (this._timeout)?this._resetAfter:this._resetAfter*5)
        if (this._callback) {
            this._callback(this._position.substr(1))
        }
    }
    off() {
        if (!this._twoLegs && this._position.indexOf("Off") < 0) {
            this._position = this._position + "Off"
            serial.write(this._which+this[this._position])
        } else if (this._twoLegs) {
            this._position = "_off"
            serial.write(this._which+this[this._position])
        }
        if (this._callback) {
            this._callback(this._position.substr(1))
        }
    }
}

class Vibrator {
    constructor(which, callback, resetAfter = keyTimeout) {
        this._which = which
        this._resetAfter = resetAfter
        this._callback = callback
        this._dataFromLocalStorage()
        this._storeSettings()
    }
    setPosValue(name, value) {
        this['_'+name] = value
        if (this._position == '_'+name) {
            serial.write(this._which+value)
        }
        this._storeSettings()
    }
    _dataFromLocalStorage() {
        var data = JSON.parse(localStorage.getItem(this._which + "Vibrator"));
        if (!data) {
            localStorage.setItem(this._which+"Vibrator", "{}")
            data = {}
        }
        this._normal = data.normal || 60
        this._max = data.max || 80
    }
    getData() {
        return JSON.parse(localStorage.getItem(this._which + "Vibrator"));
    }
    _storeSettings() {
        localStorage.setItem(this._which+"Vibrator", JSON.stringify({
            normal: this._normal,
            max: this._max
        }))
    }
    off() {
        serial.write(this._which+0);
        if(this._callback) {
            this._callback("off")
        }
    }
    normal() {
        serial.write(this._which+this._normal)
        clearTimeout(this._timeout)
        this._timeout = setTimeout(() => {
            this.off()
            this._timeout = null
        }, (this._timeout)?this._resetAfter:this._resetAfter*5)
        if(this._callback) {
            this._callback("normal")
        }
    }
    fast() {
        serial.write(this._which+this._max)
        clearTimeout(this._timeout)
        this._timeout = setTimeout(() => {
            this.off()
            this._timeout = null
        }, (this._timeout)?this._resetAfter:this._resetAfter*5)
        if(this._callback) {
            this._callback("max")
        }
    }
}

/**
 * Move Bot Forward and Backwards.
 * 
 * @param {Boolean} back Move Backwards (default: false)
 * @param {Boolean} fast Move extra fast
 */
function sendMove(back = false, fast = false) {
    for(var [key, servo] of Object.entries(servos)) {
        console.log(key, servo)
        if (!servo) {
            continue;
        }
        if (!back) {
            servo.forward();
        } else {
            servo.backward();
        }
    }
    for(var vib of vibrators) {
        if (!fast) {
            vib.normal()
        } else {
            vib.fast()
        }
    }
}

class Weapon {
    constructor(which, callback) {
        this._which = which
        this._callback = callback
        this._speed = 0
        this._dataFromLocalStorage()
        this._storeSettings()
    }
    setMaxSpeed(maxSpeed) {
        this._maxSpeed = Math.min(180, Math.max(0, maxSpeed))
        this._storeSettings()
        if (this._speed > this._maxSpeed) {
            this._setSpeed(this._maxSpeed)
        }
    }
    setStep(step) {
        this._step = step
        this._storeSettings()
    }
    _setSpeed(speed) {
        this._speed = speed
        serial.write(this._which+this._speed)
        if (this._callback) {
            this._callback(this._speed)
        }
    }
    spinUp() {
        this._setSpeed(Math.min(this._maxSpeed, this._speed + 20))
    }
    spinDown() {
        this._setSpeed(Math.max(0, this._speed - 20))
    }
    _dataFromLocalStorage() {
        var data = JSON.parse(localStorage.getItem(this._which + "Weapon"));
        if (!data) {
            localStorage.setItem(this._which+"Weapon", "{}")
            data = {}
        }
        this._maxSpeed = data.maxSpeed || 180
        this._step = data.step || 20
    }
    _storeSettings() {
        localStorage.setItem(this._which+"Weapon", JSON.stringify({
            maxSpeed: this._maxSpeed,
            step: this._step
        }))
    }
    getData() {
        return JSON.parse(localStorage.getItem(this._which + "Weapon"));
    }
}

/**
 * Turn left or right.
 * 
 * @param {Boolean} left turn left (default: false)
 */
function sendTurn(left = false) {
    if (left) {
        servos.backright.forward()
        servos.frontright.forward()
    } else {
        servos.backleft.forward()
        servos.frontleft.forward()
    }
    for(var vib of vibrators) {
        vib.normal()
    }
}

/**
 * Spin Weapon up or down
 * @param {Boolean} down Spin weapon down (default: false)
 */
function sendWeapon(down = false) {
    if (down) {
        weapon.spinDown()
    } else {
        weapon.spinUp()
    }
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
    sendMove,
    sendTurn,
    sendWeapon,
    addServo,
    addVibrator,
    addWeapon
}