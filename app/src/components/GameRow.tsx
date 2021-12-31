import React from 'react';
import { Game } from './GameList';

interface GameProps {
    game: Game
}

class GameRow extends React.Component<GameProps> {
    constructor(props: GameProps){
        super(props);
        this.setState({game: props.game});
    }

    render(){
        return (<div>
                {this.props.game.playerA.name} ({this.props.game.playerA.played}) vs ({this.props.game.playerB.played}) {this.props.game.playerB.name}            
            </div>)
    }
}

export default GameRow;