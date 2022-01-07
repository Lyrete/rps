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

        //Still in progress
        if(!this.props.game.playerA.played){
            return 'bg-grey';
        }        

        if(choices[(choices.indexOf(this.props.game.playerA.played) + 1) % 3] === this.props.game.playerB.played){
            return 'bg-gradient-to-r from-red-700 to-green-700';
        }

        if(choices[(choices.indexOf(this.props.game.playerA.played) + 2) % 3] === this.props.game.playerB.played){
            return 'bg-gradient-to-l from-red-700 to-green-700';
        }

        //draw
        return 'bg-yellow-400';
    }

    render(){
        const color: string = this.checkWinner();
        return (<li className={`flex flex-col justify-center font-bold px-6 py-2 my-2 w-full rounded-md ${color}`}>
            <div className='flex justify-center'>{this.props.game.t}</div>
                <div className='flex justify-center w-full'>
                    <div className='flex-grow'>{this.props.game.playerA.name}</div>
                    <div className='flex-grow'>vs</div>
                    <div>{this.props.game.playerB.name}</div>
                </div>
                <div className='flex justify-center w-full'>
                    ({this.props.game.playerA.played})
                    ({this.props.game.playerB.played})
                </div> 
            </li>)
    }
}

export default GameRow;