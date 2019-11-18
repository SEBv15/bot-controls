# Robot Controls
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
| - | - | - | - | - |
| Front Left | 140 | 110 | 50 | 30 |
| Front Right | 40 | 70 | 125 | 140 |
| Rear Left | 140 | 120 | 60 | 30 |
| Rear Right | 46 | 60 | 120 | 150 |

## Keyboard Control
To control the robot simply unfocus any input field and use the following key combinations
| Key Combo | Action |
| - | - |
| `W` | Forward |
| `Ctrl+W` | Vibrator Max Speed + Forward |
| `S` | Backwards |
| `Ctrl+S` | Vibrator Max Speed + Backwards |
| `A` | Only right legs down -> Turn Left |
| `D` | Only left legs down -> Turn Right |
| `Space` | Spin Weapon Up |
| `Shift` | Spin Weapon Down |