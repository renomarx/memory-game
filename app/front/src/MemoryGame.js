import React from 'react';
import './App.css';
import ScoresBoard from './ScoresBoard.js';
import MemoryBoard from './MemoryBoard.js';
import MemoryTimer from './MemoryTimer.js';
import { getRandomInt } from './utils.js';
import { APIUrl } from './config.js';

// Composant gérant la logique du jeu memory
class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    // On commence par mélanger les cartes
    let cards = this.shuffleCards()

    // On initialise le state
    this.state = {
      cards: cards, // cartes mélangées
      firstCardTurned: null, // Première carte tournée sur un tour
      secondCardTurned: null, // Seconde carte tournée sur un tour
      cardsWon: {}, // Cartes gagnées
      time: 0, // Temps écoulé
      scoresLoaded: false, // Si les scores sont chargés depuis le serveur
      scores: [] // Tableau des 3 meilleurs scores
    };

    // Permet d'accéder aux propriétés et méthodes de la classe depuis ces méthodes
    this.ClickCard = this.ClickCard.bind(this);
    this.shuffleCards = this.shuffleCards.bind(this);
    this.checkWin = this.checkWin.bind(this);
    this.checkLoose = this.checkLoose.bind(this);
    this.reset = this.reset.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);

    // Variable contenant l'id du timer généré par setInterval
    this.timer = null;
  }

  // Au montage du composant, on va chercher les meilleurs scores sur le serveur
  componentDidMount() {
    this.fetchBestScores()
  }

  // Fonction allant chercher les scores sur le serveur
  fetchBestScores() {
    fetch(APIUrl + "/scores?limit=3")
      .then(res => res.json())
      .then(
        (scores) => {
          this.setState({
            scoresLoaded: true,
            scores: scores
          });
        },
        (error) => {
          // Si il y a une erreur, on loggue mais on ne coupe pas le script,
          // car on peut jouer quand même
          console.error(error)
        }
      )
  }

  // Fonction mélangeant les cartes
  shuffleCards() {
    let cardsTotal = this.props.cardsNumber * 2
    if (cardsTotal > 36) {
      console.error("Le jeu ne peut tourner qu'avec 36 cartes (18 différentes) maximum")
    }
    let cards = [];
    // On commence par générer le tableau de toutes les valeurs possibles, en double:
    // Petit trick utilisé:
    // si on a 18 cartes différentes demandées, on génère des valeurs jusqu'à 18 * 2 = 36
    let availableValues = [...Array(cardsTotal).keys()]; // Ex: [0,1,2,3,...,34,35]
    // Nous allons générer autant de cartes que nécessaire
    for (let i = 0; i < cardsTotal; i++) {
      // Une card est un objet contenant 3 propriétés:
      // - pos : sa position sur le plateau
      // - turned : son état (retourné ou non)
      // - val : sa valeur (fruit correspondant)
      let card = {pos: i, turned: false};
      // On choisit une valeur random parmi toutes celles possibles
      let r = getRandomInt(availableValues.length);
      // Suite du petit trick:
      // La valeur de la carte est la valeur random % 2
      // Ainsi 17 = 17 mais 35 = 17 aussi
      // Permet donc d'avoir sur le plateau exactement 2 cartes de même valeur
      card.val = availableValues[r] % this.props.cardsNumber;
      cards.push(card);
      // Enfin, on supprime la valeur random utilisée des valeurs possibles
      availableValues.splice(r, 1);
    }
    return cards
  }

  // Fonction déclenchée lorsqu'on clique sur une carte
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

    // Si le timer n'est pas lancé, on le démarre (1er click)
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
        this.setState({cards: newCards, cardsWon: newCardsWon, secondCardTurned: cardClicked}, () => this.checkWin());
      }
    } else {
      // Aucune carte n'est retournée, la carte cliquée devient la première carte retournée
      this.setState({cards: newCards, firstCardTurned: cardClicked});
    }
  }

  // Méthode détectant si on a a gagné et si oui lançant les actions nécessaires
  checkWin() {
    if (Object.keys(this.state.cardsWon).length === this.props.cardsNumber) {
      this.stopTimer()
      // On envoie le score au serveur web
      this.sendScore()
      // La fonction alert() bloquant tout changement d'état et re-rendering,
      // on préfère la lancer après quelques millisecondes, pour que React ait le temps de re-render
      setTimeout(() => {
        alert(`Vous avez gagné en ${this.state.time / 1000} secondes !!!`);
        this.reset();
      }, 100)
    }
  }

  // Méthode détectant si on a a perdu et si oui lançant les actions nécessaires
  checkLoose() {
    // Si le timer n'a pas déjà été stoppé, et que le temps est supérieur au temps limite
    if (this.timer != null && this.state.time >= this.props.maxTime) {
      this.stopTimer()
      setTimeout(() => {
        alert("Vous avez perdu....");
        this.reset();
      }, 200)
    }
  }

  // Méthode réinitialisant le plateau de cartes
  reset() {
    this.stopTimer() // Au cas où
    let cards = this.shuffleCards()
    this.setState({
      cards: cards,
      firstCardTurned: null,
      secondCardTurned: null,
      cardsWon: {},
      time: 0,
    });
  }

  // Lance le timer
  startTimer() {
    // setInterval permet d'appeler une fonction à intervalle régulier
    // ici 200 millisecondes
    this.timer = setInterval(() => {
      this.setState({time: this.state.time + 200})
      this.checkLoose()
    }, 200);
  }

  // Arrête le timer
  stopTimer() {
    // Si il n'a pas déjà été arrêté et si il est lancé
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  sendScore() {
    // On crée l'objet score
    let score = {
      duration: this.state.time
    }
    // On l'envoie au serveur via une requête POST, en json
    fetch(APIUrl + "/scores", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(score)
    })
      .then(res => res.json())
      .then(
        (score) => {
          // Afin de rafraichir la liste des meilleurs scores, on rappelle le fetch
          this.fetchBestScores()
        },
        (error) => {
          console.error("L'envoi du score au serveur a échoué.", error)
        }
      )
  }

  render() {
    // Le pourcentage de la barre de progression est calculé en fonction du temps passé et du temps max
    // On s'assure aussi que ce pourcentage ne dépasse pas 100 grâce à la fonction Math.min
    return (
      <div className="Game">
        {this.state.time === 0 ? <ScoresBoard scores={this.state.scores} /> : null}
        <MemoryBoard cards={this.state.cards} ClickCard={this.ClickCard} cardsNumber={this.props.cardsNumber} />
        <MemoryTimer percentage={Math.min(this.state.time / this.props.maxTime * 100, 100)} />
      </div>
    );
  }
}

export default MemoryGame;
