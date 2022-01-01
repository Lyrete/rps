import React from 'react';
import { io, Socket} from 'socket.io-client';
import GameRow from './GameRow';

interface IProps {
}

interface IState {
  games: Map<string, Game>;
  history: Array<Game>;
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
  _id?: string;
}

class GameList extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);        
    this.state = {games: new Map(), history: []};    
  }

  componentDidMount() {
    const socket: Socket = io('http://localhost:4000');

    socket.on('recent', (msg) => {
      this.setState({games: new Map([...this.state.games, ...msg])})
    })

    socket.on('history', (msg: Array<Game>) => {
      this.setState({history: msg})
    })

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
    this.state.games.set(game.gameId, game);
    this.setState({games:this.state.games});
  }

  resolveGame(game: Game) {
    this.state.games.set(game.gameId, game);
    this.setState({games:this.state.games});
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
        {[...this.state.games].reverse().map(function(value, index){
            return(<GameRow key={index} game={value[1]} />)
        })}
    </div>)
  } 
}

export default GameList;