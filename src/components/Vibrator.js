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
        var normalized = Math.min(180, Math.max(0, event.target.value))
        this.setState({normal: normalized});
        this.state.vibrator.setPosValue("normal", normalized)
    }
    handleMaxSpeedChange = (event) => {
        var normalized = Math.min(180, Math.max(0, event.target.value))
        this.setState({max: normalized});
        this.state.vibrator.setPosValue("max", normalized)
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