# Robot Controls

## Running windows build
Go to the releases tab and download the zip file containing the executable

## Running Dev Version
I created this on windows, so I don't know if it will run on other platforms

To run this project install the dependecies first
```
$ yarn
```
Then run
```
$ npm run dev
```
to start react and launch electron.

### Optional: Launching react and electron seperately
```
$ npm start
$ npm run electron
```
## Arduino Code
This program in `arduino-code/` is written for the Romeo BLE Mini using external ESCs for the vibration and weapon motors.

The communication with the board is intended to happen through a dongle similar to the [Bluno Link](https://www.dfrobot.com/product-1220.html) which provides a serial port and handles all the BLE bullshit for you.

## Building the program for Windows
```
$ npm run build
$ npm run pack:win64
```
The exe will be in `dist/win`

## Position Settings
All fields range from 0 to 180.

What works for my bot is

| Servo Position | Forward Off | Forward | Backward | Backward Off |
| --- | --- | --- | --- | --- |
| Front Left | 140 | 110 | 50 | 30 |
| Front Right | 40 | 70 | 125 | 140 |
| Rear Left | 140 | 120 | 60 | 30 |
| Rear Right | 46 | 60 | 120 | 150 |

## Keyboard Control
To control the robot simply unfocus any input field and use the following key combinations

| Key Combo | Action |
| --- | --- |
| `W` | Forward |
| `S` | Backwards |
| `A` | Turn Left |
| `D` | Turn Right |
| `Space` | Spin Weapon Up |
| `Shift` | Spin Weapon Down |
| `Ctrl` | Set vibration speed to max |
