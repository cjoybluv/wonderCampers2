import React, { Component } from 'react';
import { Paper } from 'material-ui';

class Trips extends Component {
  render() {
    return (
      <div className="container">
        <Paper className="trip">
          <p>
            Let's take a trip!
          </p>
        </Paper>
      </div>
    )
  }

};

export default Trips;
