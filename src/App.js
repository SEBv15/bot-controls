import React, {Component} from 'react';
import logo from './logo.svg';
import './App.scss'; 
import serial from './serial';
import controls from './controls'
import SerialWrite from './components/SerialWrite'
import ChangePort from './components/ChangePort'
import Servo from './components/Servo'
import Weapon from './components/Weapon'
import Vibrator from './components/Vibrator'

class App extends Component {
  state = {"serial": ""}
  componentDidMount() {
    serial.subscribe((data) => {
      this.setState({serial: data})
    })
    document.addEventListener("keydown", this.handleKeyDown);
    setTimeout(() => {
      window.require("electron").ipcRenderer.on('keyDown', (e, letter) => {
        document.dispatchEvent(new KeyboardEvent('keydown', {'ctrlKey':true,'keyCode': 87}))
      })
    }, 1000)
  }
  handleKeyDown = (e) => {
    if (document.activeElement.nodeName != "INPUT") {
      console.log(e.keyCode, e.ctrlKey)
      switch(e.keyCode) {
        // w
        case 87:
          controls.sendMove(false, e.ctrlKey)
          break;
        // a
        case 65:
          controls.sendTurn(true)
          break;
        // s
        case 83:
          controls.sendMove(true, e.ctrlKey)
          break;
        // d
        case 68:
          controls.sendTurn(false)
          break;
        // space
        case 32:
          controls.sendWeapon(false)
          break;
        // shift
        case 16:
          controls.sendWeapon(true)
          break;
        default:
          return;
      }
      e.preventDefault()
    }
  }
  render() {
    return (
      <div className="App">
        <div className="top" /*style={{"-webkit-app-region": "drag"}}*/>
          <ChangePort />
          <span className="spacer">|</span>
          <SerialWrite />
        </div>
        <div className="mainview">
          <div className="row">
            <div className="box"><Servo letter="a" position="frontleft" /></div>
            <div className="box"><Vibrator letter="f" /></div>
            <div className="box"><Servo letter="b" position="frontright" /></div>
          </div>
          <div className="row">
            <div className="box"></div>
            <div className="box"><Weapon letter="e"/></div>
            <div className="box"></div>
          </div>
          <div className="row">
            <div className="box"><Servo letter="c" position="backleft" /></div>
            <div className="box"></div>
            <div className="box"><Servo letter="d" position="backright" /></div>
          </div>
        </div>
        <div className="logs">
          <span>{this.state.serial}</span>
        </div>
      </div>
    );
  }
}



export default App;
