import React from 'react';

// Composant affichant une carte
// Prend en props :
// - Une carte 'card'
// - Une fonction à appeler lorsqu'on clique sur la carte 'ClickCard'
class Card extends React.Component {
  render() {
    let card = this.props.card;
    // La classe de la carte est détectée dynamiquement en fonction de sa valeur
    // Ce qui permet d'associer une valeur et une image (voir App.css)
    return (
      <div className="card" onClick={() => this.props.ClickCard(card.pos)}>
        {card.turned
        ?
        <div className={"card-front card-front-" + card.val}>
        </div>
        :
        <div className="card-back">
        </div>
        }
      </div>
    );
  }
}

export default Card;
