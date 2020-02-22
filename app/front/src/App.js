import React from 'react';
import './App.css';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

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

class MemoryTimer extends React.Component {
  render() {
    return (
      <div className="timer">
        <div className="progress-bar">
          <div className="filler" style={{width: this.props.percentage + '%'}}>
          </div>
        </div>
      </div>
    );
  }
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    let cards = this.shuffleCards()
    console.log(cards);
    this.state = {
      cards: cards,
      firstCardTurned: null,
      secondCardTurned: null,
      cardsWon: {},
      time: 0
    };
    this.ClickCard = this.ClickCard.bind(this);
    this.shuffleCards = this.shuffleCards.bind(this);
    this.checkWinOrLoose = this.checkWinOrLoose.bind(this);
    this.reset = this.reset.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);

    this.timer = null;
    this.time = 0;
  }

  shuffleCards() {
    let cardsTotal = this.props.cardsNumber * 2
    if (cardsTotal > 36) {
      console.error("Le jeu ne peut tourner qu'avec 36 cartes (18 différentes) maximum")
    }
    let cards = [];
    let availableValues = [...Array(cardsTotal).keys()]; // [0,1,2,3,...,34,35]
    for (let i = 0; i < cardsTotal; i++) {
      let card = {pos: i, turned: false};
      let r = getRandomInt(availableValues.length);
      card.val = availableValues[r] % this.props.cardsNumber;
      cards.push(card);
      availableValues.splice(r, 1);
    }
    return cards
  }

  ClickCard(i) {
    // Toujours cloner le state pour changer d'état
    // Pour les objets, on utilise newState = { ...state } pour cloner un objet
    // Pour les tableaux, on peut utiliser la méthode slice
    let newCardsWon = { ...this.state.cardsWon };
    let newCards = this.state.cards.slice();

    // Avant d'accéder à un index d'un tableau, vérifier qu'il existe bien
    if (newCards[i] === undefined) {
      // Ne devrait pas se produire
      return
    }
    if (newCards[i].turned) {
      // La carte est déjà retournée, on sort
      return
    }

    if (this.timer === null) {
      this.startTimer()
    }

    // On récupère la carte sur laquelle on a cliqué
    let cardClicked = newCards[i];

    // On retourne la carte sur laquelle on vient de cliquer
    cardClicked.turned = true;

    if (this.state.firstCardTurned != null) {
      // La première carte est déjà retournée
      if (this.state.secondCardTurned != null) {
        // 2 cartes sont déjà retournées, on vient de clicker sur une 3ème
        if (!newCardsWon[this.state.firstCardTurned.val]) {
          // Si elles ne sont pas gagnées, on les retourne à l'envers
          newCards[this.state.firstCardTurned.pos].turned = false;
          newCards[this.state.secondCardTurned.pos].turned = false;
        }
        // La carte cliquée devient la 1ere carte retournée
        this.setState({cards: newCards, firstCardTurned: cardClicked, secondCardTurned: null});
      } else {
        // La première carte est déjà retournée, on vient de retourner la 2ème
        if (cardClicked.val === this.state.firstCardTurned.val) {
          // Les 2 cartes sont les mêmes, on les marque comme gagnées
          newCardsWon[cardClicked.val] = true;
        }
        // La carte retournée devient la 2ème carte retournée
        this.setState({cards: newCards, cardsWon: newCardsWon, secondCardTurned: cardClicked});
      }
    } else {
      // Aucune carte n'est retournée, la carte cliquée devient la première carte retournée
      this.setState({cards: newCards, firstCardTurned: cardClicked});
    }
  }

  checkWinOrLoose() {
    if (this.state.time >= this.props.maxTime) {
      this.stopTimer()
      setTimeout(() => {
        alert("Vous avez perdu....");
        this.reset();
      }, 200)
    } else if (Object.keys(this.state.cardsWon).length === this.props.cardsNumber) {
      this.stopTimer()
      // TODO : send score
      // La fonction alert() bloquant tout changement d'état et re-rendering,
      // on préfère la lancer après quelques millisecondes, pour que React ait le temps de re-render
      setTimeout(() => {
        alert("Vous avez gagné !!!");
        this.reset();
      }, 100)
    }
  }

  componentDidUpdate() {
    this.checkWinOrLoose();
  }

  reset() {
    let cards = this.shuffleCards()
    this.stopTimer()
    this.setState({
      cards: cards,
      firstCardTurned: null,
      secondCardTurned: null,
      cardsWon: {},
      time: 0,
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.setState({time: this.state.time + 200})
    }, 200);
  }

  stopTimer() {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  render() {
    return (
      <div className="Game">
        <MemoryBoard cards={this.state.cards} ClickCard={this.ClickCard} cardsNumber={this.props.cardsNumber} />
        <MemoryTimer percentage={Math.min(this.state.time / this.props.maxTime * 100, 100)} />
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <MemoryGame cardsNumber={4} maxTime={20000} />
    </div>
  );
}

export default App;
