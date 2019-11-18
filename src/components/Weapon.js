import React, {Component} from 'react';
import serial from './../serial';
import weapon from './weapon.svg';
import controls from '../controls';

export default class Weapon extends Component {

    constructor(props) {
        super(props)
        var weapon = controls.addWeapon(this.props.letter, (newSpeed) => {
            this.setState({speed: newSpeed})
        })
        this.state = {
            weapon,
            speed: 0
        }
        this.state = {...this.state, ...this.state.weapon.getData()}
    }
    handleMaxSpeedChange = (event) => {
        var newSpeed = Math.min(180, Math.max(0, event.target.value))
        this.setState({maxSpeed: newSpeed});
        this.state.weapon.setMaxSpeed(newSpeed)
    }
    render() {
        return (
            <div class="weapon">
                <img src={weapon} />
                <div className="controls">
                    <h2>Weapon {this.props.letter.toUpperCase()}</h2>
                    <label>
                        <input className="maxSpeed" type="text" value={this.state.maxSpeed} onChange={this.handleMaxSpeedChange} />
                        <span class={this.state.speed == this.state.maxSpeed?"underline":""}>Max Speed</span>
                    </label>
                    <div class="progressbar">
                        <div class="filler" style={{width: (this.state.speed/this.state.maxSpeed*100)+"%"}}></div>
                        <span>Current Speed</span>
                    </div>
                </div>
            </div>
        )
    }
}