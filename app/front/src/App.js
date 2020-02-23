import React from 'react';
import './App.css';
import MemoryGame from './MemoryGame.js';

// Composant principal
// cardsNumber correspond au nombre de cartes différentes sur le plateau (max 18)
// maxTime correspond au temps limite pour une partie
function App() {
  return (
    <div className="App">
      <MemoryGame cardsNumber={18} maxTime={300000} />
    </div>
  );
}

export default App;
