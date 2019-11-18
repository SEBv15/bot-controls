import React, {Component} from 'react';
import serial from './../serial';
import vibrator from './vibrator.svg';
import controls from '../controls';

export default class Vibrator extends Component {
    constructor(props) {
        super(props)
        var vibrator = controls.addVibrator(this.props.letter, (vibState) => {
            this.setState({vibratorState: vibState})
        })
        this.state = {
            vibrator
        }
        this.state = {...this.state, ...this.state.vibrator.getData()}
    }
    handleSpeedChange = (event) => {
        this.setState({normal: event.target.value});
        this.state.vibrator.setPosValue("normal", event.target.value)
    }
    handleMaxSpeedChange = (event) => {
        this.setState({max: event.target.value});
        this.state.vibrator.setPosValue("max", event.target.value)
    }
    render() {
        return (
            <div class="vibrator">
                <img src={vibrator} />
                <div className="controls">
                    <h2>Vibrator {this.props.letter.toUpperCase()}</h2>
                    <label>
                        <input className="speed" type="text" value={this.state.normal} onChange={this.handleSpeedChange} />
                        <span className={this.state.vibratorState == "normal"?"underline":""}>Speed</span>
                    </label>
                    <label>
                        <input className="maxSpeed" type="text" value={this.state.max} onChange={this.handleMaxSpeedChange} />
                        <span className={this.state.vibratorState == "max"?"underline":""}>Max Speed</span>
                    </label>
                </div>
            </div>
        )
    }
}