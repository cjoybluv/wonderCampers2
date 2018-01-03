import React, { Component } from 'react';
import { 
  Paper
} from 'material-ui';

import Checklist from '../components/Checklist';

class Forms extends Component {
  render() {
    return (
      <div className="container">
        <Paper className="trip">
          <p>
            List of Forms!
          </p>
        </Paper>
        <Checklist />
      </div>
    )
  }

};


export default Forms;
