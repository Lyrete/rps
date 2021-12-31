import React from 'react';
import { io, Socket} from 'socket.io-client';
import GameRow from './GameRow';

interface IProps {
}

interface IState {
  games: Array<Game>;
  socket?: Socket
}

export interface Game {
  gameId: string;
  type: String;
  playerA: {
    name: String;
    played?: String;
  }
  playerB: {
    name: String;
    played?: String;
  }
  t: Number;
}

class GameList extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);        
    this.state = {games: []};    
  }

  componentDidMount() {
    const socket: Socket = io('http://localhost:4000');
    socket.on('game', (msg) => {
      const game: Game = msg.gamedata;
      if(game.type === 'GAME_BEGIN'){        
        this.newGame(game);
      }else if(game.type === 'GAME_RESULT'){
        this.resolveGame(game);
      }
    });
    this.setState({socket: socket});
  }

  componentWillUnmount() {
    this.state.socket?.close();
  }

  newGame(game: Game) {
    var previous: Array<Game> = this.state.games;
    this.setState({games: [game].concat(previous)});
  }

  resolveGame(game: Game) {
    this.setState({games: this.state.games.map(function(element: Game){
      if(element.gameId === game.gameId){
        return game;
      }
      return element;
    })});

    //Show result for 5s and then delete
    /* setTimeout(() => {
      var updated: Array<Game> = this.state.games.filter(g => g.gameId !== game.gameId);
      this.setState({games: updated});
    }, 5000); */ 
  }

  renderResult = (game: Game) => {
    if(game.playerA.played){
      return "Game Finished";
    }else{
      return "In progress"
    }
  };

  render(){
    return (<div className='flex-col justify-center text-center divide-y divide-gray-700 max-h-96 overflow-y-auto'>
        {this.state.games.map(function(game: Game, index: number){
            return(<GameRow key={index} game={game} />)
        })}
    </div>)
  } 
}

export default GameList;