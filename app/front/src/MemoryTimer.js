import React from 'react';

// Composant affichant la barre de progression
// Prend en props un 'percentage' indiquant le pourcentage de completion actuel
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

export default MemoryTimer;
