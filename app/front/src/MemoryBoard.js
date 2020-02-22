import React from 'react';
import Card from './Card.js';

class MemoryBoard extends React.Component {
  renderCard(i) {
    return <Card card={this.props.cards[i]} key={i} ClickCard={this.props.ClickCard} />;
  }

  renderCards() {
    let cards = [];
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
