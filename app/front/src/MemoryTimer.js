import React from 'react';

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
