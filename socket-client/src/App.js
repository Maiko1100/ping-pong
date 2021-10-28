import React, { Component } from "react";
import io from "socket.io-client";
import './App.css'
// import Scoreboard  from 'components/Scoreboard'
const socket = io("http://localhost:3002");

class App extends Component {
    constructor() {
        super();
        this.state = {
            player1: undefined,
            player2: undefined
        };
    }
    componentDidMount() {
        socket.on("score", this.handleData.bind(this));
        socket.on("wonSet", this.wonSet.bind(this));
        socket.on("wonGame", this.wonGame.bind(this));
        socket.on("notCheckedIn", this.notCheckedIn.bind(this));
        socket.on("playerCheckin", this.playerCheckIn.bind(this));
    }
    handleData(data) {
        this.setState({
            player1: data[1].value.name,
            player2: data[2].value.name,
            scoreP1: data[data.currentSetText.value].value[1],
            scoreP2: data[data.currentSetText.value].value[2],
            service: data[data.currentSetText.value].value.service,
            matchPoint: data[data.currentSetText.value].value.matchPoint,
            currentSetText: data.currentSetText.value,
            setWinner: null
        
        });
    }
    playerCheckIn(data){
        this.setState({
        player1: data[1].value.name,
        player2: data[2].value.name,
    });
    }
    notCheckedIn(data){
        console.log(data);
    }
    wonSet(data){
        console.log(data);
        let setWinner = "player"+data[data.currentSetText.value].value.won
        this.setState({
            player1: data[1].value.name,
            player2: data[2].value.name,
            scoreP1: data[data.currentSetText.value].value[1],
            scoreP2: data[data.currentSetText.value].value[2],
            currentSetText: data.currentSetText.value,        
            setWinner
        });
        
    }
    wonGame(data){
        let gameWinner = "player"+data[data.currentSetText.value].value.won
        this.setState({
            player1: data[1].value.name,
            player2: data[2].value.name,
            scoreP1: data[data.currentSetText.value].value[1],
            scoreP2: data[data.currentSetText.value].value[2],        
            gameWinner
        });
    }

    render() {
        return (
            <div className="maincontainer">
             <h1>{this.state.setWinner && "Winner of "+this.state.currentSetText +" is "+this.state[this.state.setWinner] }</h1>
             <h1>{this.state.gameWinner && "Winner is "+this.state[this.state.gameWinner] }</h1>
                <div className="half-page">
                
                    <h1>player 1</h1>
                    <h1>{this.state.matchPoint == 1 && "Matchpoint" }</h1>
                    <h1>{this.state.service == 1 && "serving" }</h1>
                    <h1>{this.state.player1}</h1>
                    <h1>{this.state.scoreP1}</h1>
                </div>
                <div className="half-page">
                    <h1>player 2</h1>
                    <h1>{this.state.matchPoint == 2 && "Matchpoint" }</h1>
                    <h1>{this.state.service == 2 && "serving" }</h1>
                    <h1>{this.state.player2}</h1>
                    <h1>{this.state.scoreP2}</h1>
                </div>
                {/* <Scoreboard> </Scoreboard> */}
            </div>
        );
    }
}
export default App;
