import React from 'react';
import './App.css';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class Card extends React.Component {
  render() {
    console.log(this.props.card);
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
        <div className={"card-front card-front-" + card.pos}>
          {card.pos} : {card.val}
        </div>
        :
        <div className="card-back">
          {/* TODO */}
        </div>
        }
      </div>
    );
  }
}


class MemoryBoard extends React.Component {
  renderCard(i) {
    return <Card card={this.props.cards[i]} key={i} ClickCard={this.props.ClickCard} />;
  }

  renderCardsRow(i) {
    let cards = [];
    let firstIndex = i * 6;
    for (let x = firstIndex; x < firstIndex+6; x++) {
      cards.push(this.renderCard(x));
    }
    return (
      <div className="cards-row">
        {cards}
      </div>
    )
  }

  render() {
    return (
      <div className="board">
        {this.renderCardsRow(0)}
        {this.renderCardsRow(1)}
        {this.renderCardsRow(2)}
        {this.renderCardsRow(3)}
        {this.renderCardsRow(4)}
        {this.renderCardsRow(5)}
      </div>
    );
  }
}

class MemoryTimer extends React.Component {
  render() {
    return (
      <div>
        TIMER
      </div>
    );
  }
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    let cards = [];
    let availableValues = [...Array(36).keys()];
    for (let i = 0; i < 36; i++) {
      let card = {pos: i, turned: false};
      let r = getRandomInt(availableValues.length);
      card.val = availableValues[r] % 18;
      cards.push(card);
      availableValues.splice(r, 1);
    }
    console.log(cards);
    this.state = {
      cards: cards,
      firstCardTurned: null,
      secondCardTurned: null,
      cardsWon: {},
    };
    this.ClickCard = this.ClickCard.bind(this);
  }

  ClickCard(i) {
    let newCards = this.state.cards.slice();
    if (newCards[i] === undefined) {
      // Ne devrait pas se produire
      return
    }
    if (newCards[i].turned) {
      // La carte est déjà retournée, on sort
      return
    }
    let newCardsWon = {...this.state.cardsWon};
    let cardTurned = newCards[i]

    // On retourne la carte sur laquelle on vient de cliquer
    newCards[i].turned = true;

    if (this.state.firstCardTurned != null) {
      // La première carte est déjà retournée
      if (this.state.secondCardTurned != null) {
        // 2 cartes sont déjà retournées, on vient de clicker sur une 3ème
        if (!newCardsWon[this.state.firstCardTurned.val]) {
          // Si elles ne sont pas gagnées, on les retourne
          newCards[this.state.firstCardTurned.pos].turned = false
          newCards[this.state.secondCardTurned.pos].turned = false
        }
        // La carte retournée devient la 1ere carte retournée
        this.setState({cards: newCards, firstCardTurned: cardTurned, secondCardTurned: null})
      } else {
        // La première carte est déjà retournée, on vient de retourner la 2ème
        if (cardTurned.val === this.state.firstCardTurned.val) {
          // Les 2 cartes sont les mêmes, on les marque comme gagnées
          newCardsWon[cardTurned.val] = true
        }
        // La carte retournée devient la 2ème carte retournée
        this.setState({cards: newCards, cardsWon: newCardsWon, secondCardTurned: cardTurned})
      }
    } else {
      this.setState({cards: newCards, firstCardTurned: cardTurned})
    }
    // TODO : check if won
  }

  render() {
    return (
      <div className="Game">
        <MemoryBoard cards={this.state.cards} ClickCard={this.ClickCard} />
        <MemoryTimer/>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <MemoryGame/>
    </div>
  );
}

export default App;
