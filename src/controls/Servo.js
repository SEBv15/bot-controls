import serial from './../serial';

export default class Servo {
    constructor(which, stateChangeCallback) {
        this._which = which
        this._dataFromLocalStorage()
        this._storeSettings()
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
        if (this._callback) {
            this._callback(this._position.substr(1))
        }
    }
    backward() {
        this._position = "_backward"
        serial.write(this._which+this._backward)
        clearTimeout(this._timeout)
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