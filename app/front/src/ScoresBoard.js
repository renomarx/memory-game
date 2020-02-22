import React from 'react';
import moment from 'moment';

// Composant affichant les meilleurs scores
// Prend en props un tableau de scores 'scores'
class ScoresBoard extends React.Component {
  render() {
    // On construit un tableau (JSX) contenant les scores à afficher
    let scores = []
    for (let i in this.props.scores) {
      // Variable déclarée uniquement pour faciliter la manipulation
      let score = this.props.scores[i]
      // moment est un package très utilisé et très pratique pour manipuler des dates / temps
      let dateFormatted = moment(score.createdAt).format('DD/MM/YYYY à HH:mm:ss')
      scores.push(
        <li className="score" key={i}>
          Le {dateFormatted} : <b>{score.duration / 1000} secondes</b>
        </li>
      )
    }
    return (
      <div className="scores-board">
        <div className="scores-title">
          Meilleurs scores:
        </div>
        <ol className="scores-list">
          {scores}
        </ol>
      </div>
    )
  }
}

export default ScoresBoard;
