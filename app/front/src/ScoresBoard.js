import React from 'react';
import moment from 'moment';

class ScoresBoard extends React.Component {

  render() {
    let scores = []
    for (let i in this.props.scores) {
      let score = this.props.scores[i]
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
