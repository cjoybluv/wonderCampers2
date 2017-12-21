import React, { Component } from 'react';
import { Paper } from 'material-ui';

class Home extends Component {
  render() {
    return (
      <Paper className="Home">
        <p>
          Wonder Campers is a REI micro-site supporting the thousands of volunteers who plan camping
          and outdoor events for inner city youth. The site includes planning tools to Discover,
          Plan and Share adventures. The concept also extends REI’s successful loyalty program,
          allowing Members to ‘donate’ their REI dividends toward gear and supplies
          for aspiring campers in need.
        </p>
      </Paper>
    )
  }

};

export default Home;
