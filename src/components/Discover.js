import React, { Component } from 'react';

import { 
  SelectField, 
  MenuItem, 
  List, 
  ListItem, 
  Divider, 
  Dialog,
  FlatButton,
  Chip
} from 'material-ui';

import {Card, CardText} from 'material-ui/Card';

import './Discover.css';
import searchTables from '../helpers/searchTables';
import mt_lake from '../images/mt_lake.jpg';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { 
    images[item.replace('./', '')] = r(item); 
    return true;
  });
  return images;
}

const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));

const styles = {
 width200: {
    width: 200,
  },
  chip: {
    margin: 4,
    display: "inline-block"
  },
};

class Discover extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      selectedState: '', 
      recareas: [],
      recAreaOpen: false
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

  activityIconListItem = (activity, i) => {
    const iconName = 'acticon-'+activity.ActivityID.toString()+'.png';
    return (
      <section className="activity-icon" key={i} >
        <img src={images[iconName]} alt={activity.ActivityName} />
        <span className="activity-label">{activity.ActivityName}</span>
      </section> 
    )
  }

  openRecArea = (recArea) => {
    this.setState({
      recAreaOpen: true,
      recArea
    });
  }

  closeRecArea = () => {
    this.setState({recAreaOpen: false});
  }
  
  renderRecAreas() {
    const { recareas } = this.state;
    return (
      <List>
        {recareas.map((recarea, i) =>
          <div key={i} >
            <ListItem onClick={this.openRecArea.bind(this,recarea)} >
              <div recarea={recarea} >
                <h4>{recarea.RecAreaName} ({recarea.FACILITY ? recarea.FACILITY.length : 'N/A'})</h4>
                <p dangerouslySetInnerHTML={{__html: recarea.RecAreaDescription}} />
                {recarea.ACTIVITY.map(this.activityIconListItem)}
              </div>
              {(i+1 !== recareas.length) && <Divider />}
            </ListItem>
          </div>
        )}
      </List>
    )
  }

  renderRecAreaModal() {
    const { recArea, recAreaOpen } = this.state;
    if (!recAreaOpen) {
      return null;
    }
    return (
      <div className="modal">
        <h3>{recArea.RecAreaName} ({recArea.FACILITY.length})</h3>

        <div>
          <div className="col-6">
            <Card ng-if="recArea.RECAREAADDRESS[0].City">
              <CardText>
                {recArea.RECAREAADDRESS[0].RecAreaStreetAddress1} <br/>
                {recArea.RECAREAADDRESS[0].City}, {recArea.RECAREAADDRESS[0].AddressStateCode}   {recArea.RECAREAADDRESS[0].PostalCode} <br/>
                {recArea.RecAreaEmail} {recArea.RecAreaPhone}<br/>
                {recArea.RecAreaMapURL &&
                  <button href={recArea.RecAreaMapURL} target="_blank">Goto Map</button>
                }
              </CardText>
            </Card>
          </div>
          <div className="col-6" ng-if="recArea.MEDIA && recArea.MEDIA[0].MediaType=='Image'">
            <img src={recArea.MEDIA[0].URL} alt="" />
          </div>
        </div>        
        <Chip style={styles.chip}>
          ACTIVITY: {recArea.ACTIVITY.length}
        </Chip>
        <Chip style={styles.chip}>
          FACILITY: {recArea.FACILITY.length}
        </Chip>
        <Chip style={styles.chip}>
          LINK: {recArea.LINK.length}
        </Chip>
        <Chip style={styles.chip}>
          MEDIA: {recArea.MEDIA.length}
        </Chip>
        <Chip style={styles.chip}>
          EVENT: {recArea.EVENT.length}
        </Chip>




      </div>
    )
  }

  render() {
    const { isFetching, recareas, selectedState, recAreaOpen } = this.state;

    const modalActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeRecArea}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.closeRecArea}
      />,
    ];

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
                {this.renderRecAreas()}
              </div>      
            </div>
          }
        </span>
        <Dialog
          actions={modalActions}
          title="Recreational Area:"
          modal={false}
          open={recAreaOpen}
          onRequestClose={this.closeRecArea}
          autoScrollBodyContent={true}
        >
          {this.renderRecAreaModal()}
        </Dialog>
      </div>
    )
  }

};

export default Discover;
