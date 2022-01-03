import React from 'react';
import { Game } from './GameList';

interface GameProps {
    game: Game;
}

interface Player {
    name: string;
    played?: string;
}

interface GameState {
    finished: boolean;
    winner: Player | false;
    loser?: Player;
}

class GameRow extends React.Component<GameProps, GameState> {
    constructor(props: GameProps){
        super(props);
        this.state = {finished: false, winner: false} 
    }
    
    checkWinner(){
        let choices: string[] = ["ROCK", "PAPER", "SCISSORS"];

        if(!this.props.game.playerA.played){
            return false;
        }        

        if(choices[(choices.indexOf(this.props.game.playerA.played) + 1) % 3] === this.props.game.playerB.played){
            return this.props.game.playerB;
        }

        if(choices[(choices.indexOf(this.props.game.playerA.played) + 2) % 3] === this.props.game.playerB.played){
            return this.props.game.playerA;
        }

        return false;
    }

    render(){
        const color: string = this.checkWinner() ? 'bg-green-600' : 'bg-yellow-400';
        return (<li className={`px-6 py-2 border-b border-gray-200 w-full ${color}`}>
                {this.props.game.playerA.name} ({this.props.game.playerA.played}) vs ({this.props.game.playerB.played}) {this.props.game.playerB.name}            
            </li>)
    }
}

export default GameRow;