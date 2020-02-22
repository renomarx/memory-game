import React from 'react';
import Card from './Card.js';

// Composant affichant le plateau de cartes
// Prend en props :
// - Un tableau de cards 'cards'
// - Une fonction à appeler lorsqu'on clique sur une carte 'ClickCard'
// - Le nombre de cartes différentes du jeu 'cardsNumber'
class MemoryBoard extends React.Component {
  renderCard(i) {
    // Ici on instancie le composant Card en lui passant la fonction 'ClickCard' venant de nos propres props
    return <Card card={this.props.cards[i]} key={i} ClickCard={this.props.ClickCard} />;
  }

  renderCards() {
    let cards = [];
    // Nombre total de cartes = nombre de cartes différentes * 2
    for (let i = 0; i < this.props.cardsNumber * 2; i++) {
      cards.push(this.renderCard(i));
    }
    return cards
  }

  render() {
    return (
      <div className="board">
        {this.renderCards()}
      </div>
    );
  }
}

export default MemoryBoard;
