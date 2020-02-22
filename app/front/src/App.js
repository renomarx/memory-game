import React from 'react';
import moment from 'moment';
import './App.css';
import MemoryGame from './MemoryGame.js';


function App() {
  return (
    <div className="App">
      <MemoryGame cardsNumber={4} maxTime={20000} />
    </div>
  );
}

export default App;
