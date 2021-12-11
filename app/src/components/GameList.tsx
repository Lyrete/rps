import React from 'react';
import { io, Socket} from 'socket.io-client';

interface IProps {
}

interface IState {
  games: Array<Game>;
  socket?: Socket
}

interface Game {
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
    })
  }

  newGame(game: Game) {
    const updated: Array<Game> = this.state.games.concat(game);
    this.setState({games: updated});
  }

  resolveGame(game: Game) {
    var updated: Array<Game> = this.state.games.filter(g => g.gameId !== game.gameId)
    updated = [game].concat(updated);
    this.setState({games: updated});

    //Show result for 5s and then delete
    setTimeout(() => {
      var updated: Array<Game> = this.state.games.filter(g => g.gameId !== game.gameId);
      this.setState({games: updated});
    }, 10000); 
  }

  renderResult = (game: Game) => {
    if(game.playerA.played){
      return "Game Finished";
    }else{
      return "In progress"
    }
  };

  render(){
    return (<div>
        {this.state.games.map(function(game: Game){
            var msg: string;
            if(game.playerA.played){
              msg = "Game Finished";
            }else{
              msg = "In progress"
            }
            return (
            <div key={game.gameId} className='text-red-900'>
              <div>{game.playerA.name} vs {game.playerB.name}</div>
              <div>{msg}</div>
            </div>)
        })}
    </div>)
  } 
}

export default GameList;