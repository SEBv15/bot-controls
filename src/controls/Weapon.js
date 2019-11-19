import serial from './../serial';

export default class Weapon {
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
    getMaxSpeed() {
        return this._maxSpeed
    }
    setStep(step) {
        this._step = step
        this._storeSettings()
    }
    _setSpeed(speed) {
        if (speed == this._speed) return
        this._speed = speed
        serial.write(this._which+this._speed)
        if (this._callback) {
            this._callback(this._speed)
        }
    }
    getSpeed() {
        return this._speed
    }
    spinUp() {
        this._setSpeed(Math.min(this._maxSpeed, this._speed + this._step))
    }
    spinDown() {
        this._setSpeed(Math.max(0, this._speed - this._step))
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