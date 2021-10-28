import React, { Component } from "react";
import io from 'socket.io-client';
const socket = io('http://localhost:3000');

class Scoreboard extends Component {
  constructor() {
    super();
    this.state = {
      score: 0,
    };

  }
  componentDidMount(){
    socket.on('chat message', this.handleData.bind(this))
  }

  handleData(data){
    this.setState({
      score:data
    })

  }

  render() {

    return (
      <div style={{ textAlign: "center" }}>
          <button onClick={this.test.bind(this)}>test</button>
      </div>
    )
  }
}
export default Scoreboard;