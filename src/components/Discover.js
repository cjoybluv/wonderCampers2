import React, { Component } from 'react';

import { SelectField, MenuItem, List, ListItem } from 'material-ui';

import './Discover.css';
import searchTables from '../helpers/searchTables';
import mt_lake from '../images/mt_lake.jpg';


const styles = {
 width200: {
    width: 200,
  },
};

class Discover extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      selectedState: '', 
      recareas: []
    };
  }

  componentWillReceiveProps(update) {
    this.setState({
      isFetching: update.discoverProps.isFetching,
      recareas: update.discoverProps.recareas
    });
  }

  handleChange = (event, index, value) => {
    this.setState({selectedState: value});
    this.setState({isFetching: true});
    this.props.fetchRecAreas(value);
  }

  
  render() {
    const { isFetching, recareas, selectedState } = this.state;

    return (
      <div className="container">
        <span className="col-4">
          <div className="container">
            <SelectField
              style={styles.width200}
              floatingLabelText="Select State"
              value={selectedState}
              onChange={this.handleChange}
            >
              {searchTables.usStates.map((st, idx) => {
                return (
                  <MenuItem key={idx} value={st.abbreviation} primaryText={st.name} />
                )              
              })}
            </SelectField>
          </div>
        </span>
        <span className="col-8">
          {isFetching &&
            <h3>
              Recreational Areas in <strong>{ selectedState }</strong>:
              <div>
                <strong>LOADING...</strong>
              </div>
            </h3>
          }
          {!isFetching && !recareas.length &&
            <div>

              <h3>Welcome to Wonder Campers - Discover App.</h3>
              <p>This page lets you search the national Recreational Areas government database.</p>
              <ul>
                <li>Begin by selecting a State</li>
                <li>Then browse Recreational Area results by scrolling the results pane</li>
                <li>Click a Rec. Area to see details</li>
                <li>Browse Facilities in three ways</li>
                <ul>
                  <li>Select a Recreational Area</li>
                  <li>Enter a Search Term</li>
                  <li>Search by Miles from Place Name</li>
                </ul>
                <li>Filter your Results by:</li>
                <ul>
                  <li>Check "Camping Only?" to reduce to only those with camping</li>
                  <li>Check off Activites to reduce to only those with at least one checked activity</li>
                </ul>
              </ul>
              <div><img src={mt_lake} height="250" alt="mountain lake" /></div>
            </div>
          }
          {!isFetching && recareas.length &&
            <div>
               <h3>
                Recreational Areas in <strong>{ selectedState }</strong>: ({ recareas.length })
              </h3>
              <div>
                <List>
                  {recareas.map((recarea, i) =>
                    <ListItem key={i}>
                      <div>
                        <h3>{recarea.RecAreaName} </h3>
                      </div>
                    </ListItem>
                  )}
                </List>
              </div>      
            </div>
          }
        </span>
      </div>
    )
  }

};

export default Discover;