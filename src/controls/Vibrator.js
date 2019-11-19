import serial from './../serial';

export default class Vibrator {
    constructor(which, callback) {
        this._which = which
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
        if(this._callback) {
            this._callback("normal")
        }
    }
    fast() {
        serial.write(this._which+this._max)
        clearTimeout(this._timeout)
        if(this._callback) {
            this._callback("max")
        }
    }
}