import React, { Component } from 'react';
import { Paper } from 'material-ui';

import './Home.css';
import Home_girlHandPaint from '../images/Home_girlHandPaint.jpg';
// import Home_campleaders_group from '../images/Home_campleaders_group.jpg';
import Splash_LovingOutdoors from '../images/Splash-LovingOutdoors.jpg';
import Home_girlscanoe from '../images/Home_girlscanoe.jpg';

class Home extends Component {
  render() {
    return (
      <div className="container">
        <Paper className="Home">
          <p>
            Wonder Campers is a REI micro-site supporting the thousands of volunteers who plan camping
            and outdoor events for inner city youth. The site includes planning tools to Discover,
            Plan and Share adventures. The concept also extends REI’s successful loyalty program,
            allowing Members to ‘donate’ their REI dividends toward gear and supplies
            for aspiring campers in need.
          </p>
        </Paper>

        <div className="home-pictures">
          <span>
            <img src={Home_girlHandPaint} alt="Girl with hand paint" style={{width: 250}} />
            {/* <img src={Home_campleaders_group} alt="campleaders group" style={{width: 250}} /> */}
          </span>
          <span>
            <img src={Splash_LovingOutdoors} alt="loving outdoors" style={{width: 300}} />
          </span>
          <span>
            <img src={Home_girlscanoe} alt="girls canoe" style={{width: 500}} />
          </span>
        </div>
      </div>
    )
  }

};

export default Home;
