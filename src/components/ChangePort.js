import React, {Component} from 'react';
import serial from './../serial';

export default class ChangePort extends Component {
    constructor(props) {
      super(props);
      this.state = {value: 'COM8'};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      event.preventDefault();
      serial.changePort(this.state.value)
    }
    render() {
      return (
        <div className="changeport">
          <form onSubmit={this.handleSubmit}>
            <label>
              Port
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Change" />
          </form>
        </div>
      )
    }
  }