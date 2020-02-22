import React from 'react';

class Card extends React.Component {
  render() {
    let card = this.props.card;
    if (card === undefined) {
      return (
        <div className="card">
        </div>
      );
    }
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
