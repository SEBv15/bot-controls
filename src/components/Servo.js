import React, {Component} from 'react';
import serial from './../serial';
import servo from './servo.svg';
import Toggle from 'react-toggle'
import "react-toggle/style.css";
import controls from './../controls'

export default class Servo extends Component {
    constructor(props) {
        super(props)
        var servo = controls.addServo(this.props.letter, this.props.position, (servoState) => {
            this.setState({servoState})
        })
        this.state = {
            servo: servo,
            servoState: ""
        }
        this.state = {...this.state, ...this.state.servo.getData()}
    }
    handleForwardOffChange = (event) => {
        var normalized = Math.min(180, Math.max(0, event.target.value))
        this.setState({forwardOff: normalized});
        this.state.servo.setPosValue("forwardOff", normalized)
    }
    handleForwardChange = (event) => {
        var normalized = Math.min(180, Math.max(0, event.target.value))
        this.setState({forward: normalized});
        this.state.servo.setPosValue("forward", normalized)
    }
    handleBackwardOffChange = (event) => {
        var normalized = Math.min(180, Math.max(0, event.target.value))
        this.setState({backwardOff: normalized});
        this.state.servo.setPosValue("backwardOff", normalized)
    }
    handleBackwardChange = (event) => {
        var normalized = Math.min(180, Math.max(0, event.target.value))
        this.setState({backward: normalized});
        this.state.servo.setPosValue("backward", normalized)
    }
    handleOffChange = (event) => {
        var normalized = Math.min(180, Math.max(0, event.target.value))
        this.setState({off: normalized});
        this.state.servo.setPosValue("off", normalized)
    }
    handleCheeseChange = (e) => {
        this.setState({twoLegs: e.target.checked})
        this.state.servo.setPosValue("twoLegs", e.target.checked)
    }
    render() {
        return (
            <div className="servo">
                <img src={servo} />
                <div className="controls">
                    <h2>Servo {this.props.letter.toUpperCase()}</h2>
                    <div className="togglemode">
                        <Toggle
                            id={'mode-toggle'+this.props.letter}
                            defaultChecked={this.state.twoLegs}
                            onChange={this.handleCheeseChange} />
                        <label htmlFor={'mode-toggle'+this.props.letter}>Two Legs</label>
                    </div>
                    <span className="servoPositionsTitle">Servo Positions</span>
                    {(this.state.twoLegs)?null:(<label>
                        <input className="forwardOff" type="text" value={this.state.forwardOff}  onChange={this.handleForwardOffChange} />
                        <span class={this.state.servoState == "forwardOff"?"underline":""}>Forward Off</span>
                    </label>)}
                    <label>
                        <input className="forward" type="text" value={this.state.forward} onChange={this.handleForwardChange} />
                        <span class={this.state.servoState == "forward"?"underline":""}>Forward</span>
                    </label>
                    <label>
                        <input className="backward" type="text" value={this.state.backward} onChange={this.handleBackwardChange} />
                        <span class={this.state.servoState == "backward"?"underline":""}>Backwards</span>
                    </label>
                    {(this.state.twoLegs)?null:(<label>
                        <input className="backwardOff" type="text" value={this.state.backwardOff} onChange={this.handleBackwardOffChange} />
                        <span class={this.state.servoState == "backwardOff"?"underline":""}>Backward Off</span>
                    </label>)}
                    {(this.state.twoLegs)?(<label>
                        <input className="off" type="text" value={this.state.off} onChange={this.handleOffChange} />
                        <span class={this.state.servoState == "off"?"underline":""}>Off</span>
                    </label>):null}
                </div>
            </div>
        )
    }
}