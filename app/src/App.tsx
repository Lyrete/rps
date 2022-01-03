import React from 'react';
import './App.css';
import GameList from './components/GameList';



function App() {
  return (
    <div className="App flex justify-center mx-auto space-x-3">       
      <GameList />
      <div className="bg-red-900 w-80 justify-center text-center">        
      </div>
    </div>
  );
}

export default App;
