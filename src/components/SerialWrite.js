import React, {Component} from 'react';
import serial from './../serial';

export default class SerialWrite extends Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      event.preventDefault();
      serial.write(this.state.value)
      this.setState({value: ""})
    }
    render() {
      return (
        <div className="serialwrite">
          <form onSubmit={this.handleSubmit}>
            <label>
              Serial Input
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Send" />
          </form>
        </div>
      )
    }
  }