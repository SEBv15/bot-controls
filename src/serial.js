/**
 * This looks like shit, because it is, but there is a reason behind it.
 * 
 * window.require("electron") is not immediately available for some reason 
 * so I am creating dummy functionality for subscribe and write that gets replaced 
 * with the actual functions once serialport has loaded.
 */

var callbacks = []
var parser = null
var port = null
var subscribe = function(callback) {
    callbacks.push(callback)
    if (parser) {
        parser.on('data', callback)
    }
}
var writePort = null;
var write = function(data) {
    if (writePort) {
        writePort(data)
    }
};
var SerialPort
var changePort = function(cport) {
    console.log(port)
    try {
        port.close()
    } catch(e) {
        console.log(e)
    }
    port = new SerialPort(cport, { baudRate: 115200 })
    port.on("error", function(err) {
        console.warn(err)
    })
    writePort = port.write
    port.pipe(parser)
    for (var callback of callbacks) {
        parser.on('data', callback)
    }
    console.log("Port changed to", cport)
}
setTimeout(function() {
    console.log("CONNECTING TO COM8")
    const electron = window.require('electron');
    SerialPort = electron.remote.require('serialport');
    const Readline = electron.remote.require('@serialport/parser-readline')
    port = new SerialPort("COM8", { baudRate: 115200 })
    port.write("a70")

    port.on("error", function(err) {
        console.warn(err)
    })

    writePort = port.write

    parser = new Readline()
    port.pipe(parser)

    for (var callback of callbacks) {
        parser.on('data', callback)
    }

    parser.on('data', line => console.log(`> ${line}`))
},1000);
export default {
    subscribe,
    write,
    changePort
}