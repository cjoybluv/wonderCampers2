import React, { Component } from 'react';

import { 
  SelectField, 
  MenuItem, 
  List, 
  ListItem, 
  Divider, 
  Dialog,
  FlatButton,
  Chip,
  Paper,
  TextField
} from 'material-ui';
import {Card, CardText} from 'material-ui/Card';

// import ShowMore from 'react-show-more';
// import Truncate from 'react-truncate';

import './Discover.css';
import searchTables from '../helpers/searchTables';
import { char20, prepareURL } from '../helpers/utilities';
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
 width100: {
    width: "100%"
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
      recAreaOpen: false,
      selectedRecArea: null,
      facilities: [],
      searchQuery: ''
    };
  }

  componentWillReceiveProps(update) {
    this.setState({
      isFetching: update.discoverProps.isFetching,
      recareas: update.discoverProps.recareas,
      facilities: update.discoverProps.facilities
    });
  }

  handleStateSelect = (event, index, value) => {
    this.setState({selectedState: value});
    this.setState({isFetching: true});
    this.props.fetchRecAreas(value);
  }

  handleRecAreaSelect = (event, index, value) => {
    this.setState({selectedRecArea: value});
    this.props.setRecArea(value);
    this.props.fetchFacilities(value);
  }

  handleQuery = (event) => {
    this.setState({searchQuery: event.target.value});
  }

  submitQuery = () => {
    const { selectedState, searchQuery } = this.state;
    this.props.fetchFacilitiesQuery(selectedState,searchQuery);
  }

  activityIconListItem = (activity, i) => {
    const iconName = 'acticon-'+activity.ActivityID.toString()+'.png';
    return (
      <section className="activity-icon" key={i} >
        <img src={images[iconName]} alt={activity.ActivityName} />
        <span className="activity-label">{char20(activity.ActivityName)}</span>
      </section> 
    )
  }

  openRecArea = (recArea) => {
    this.setState({
      recAreaOpen: true,
      recArea
    });
    this.props.setRecarea(recArea);
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

        <div className="recarea-address">
          <div className="col-6">
            <Card>
              <CardText>
                {recArea.RECAREAADDRESS[0].RecAreaStreetAddress1} <br/>
                {recArea.RECAREAADDRESS[0].City}, {recArea.RECAREAADDRESS[0].AddressStateCode}   {recArea.RECAREAADDRESS[0].PostalCode} <br/>
                {recArea.RecAreaEmail} {recArea.RecAreaPhone}<br/>
                {recArea.RecAreaMapURL &&
                  <a href={prepareURL(recArea.RecAreaMapURL)} target="_blank">Goto Map</a>
                }
              </CardText>
            </Card>
          </div>
          {recArea.MEDIA[0] && recArea.MEDIA[0].MediaType==='Image' &&
            <div className="col-6">
              <img src={recArea.MEDIA[0].URL} alt="" />
            </div>
          }
        </div>  
        <div>
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
        <Paper zDepth={1}>
          <h3>Description</h3>
          <p dangerouslySetInnerHTML={{__html: recArea.RecAreaDescription}} />
        </Paper>
        <Paper zDepth={1}>
          <h3>Directions</h3>
          <p dangerouslySetInnerHTML={{__html: recArea.RecAreaDirections}} />
        </Paper>
        <Paper>
          <h3>Activities</h3>
          {recArea.ACTIVITY.map(this.activityIconListItem)}
        </Paper>
        <Paper>
          <h3>Links</h3>
          {recArea.LINK.map((link) => 
            <Chip style={styles.chip}>
              <a href={prepareURL(link.URL)} target="_blank">{link.Title}</a>
            </Chip>            
          )}
        </Paper>
      </div>
    )
  }

  renderFacilities() {
    const { facilities } = this.state;
    return (
      <List>
        {facilities.map((facility, i) =>
          <div key={i} >
            <ListItem>
              <div>
                <h4>{facility.FacilityName}</h4>
                <p dangerouslySetInnerHTML={{__html: facility.FacilityDescription}} />
                {false && facility.ACTIVITY.map(this.activityIconListItem)}
              </div>
              {(i+1 !== facilities.length) && <Divider />}
            </ListItem>
          </div>
        )}
      </List>
    )
  }

  render() {
    const { 
      isFetching, 
      recareas, 
      facilities,
      selectedState, 
      recAreaOpen,
      selectedRecArea,
      searchQuery
    } = this.state;

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
              style={styles.width100}
              floatingLabelText="Select State"
              value={selectedState}
              onChange={this.handleStateSelect}
            >
              {searchTables.usStates.map((st, idx) => {
                return (
                  <MenuItem key={idx} value={st.abbreviation} primaryText={st.name} />
                )              
              })}
            </SelectField>
          </div>
          <h4>Browse Facilities by:</h4>
          <div className="container">
            <SelectField 
              style={styles.width100}
              floatingLabelText="Select Recretional Area"
              value={selectedRecArea}
              onChange={this.handleRecAreaSelect}
              disabled={isFetching || !recareas.length}
            >
              {recareas.map((recarea, idx) => {
                return (
                  <MenuItem key={idx} value={recarea} primaryText={recarea.RecAreaName + ' (' + recarea.FACILITY.length + ')'} />
                )
              })}
            </SelectField>
          </div>

          <div className="container">

              <TextField 
                style={styles.width100}
                floatingLabelText="OR Enter Search Term"
                floatingLabelFixed={true}
                value={searchQuery}
                onChange={this.handleQuery}
                disabled={isFetching || !recareas.length}
              />
              <FlatButton type="submit" onClick={this.submitQuery} >Go</FlatButton>
   
          </div>

        </span>
        <span className="col-8">
          {isFetching && selectedState && !selectedRecArea &&
            <h3>
              Recreational Areas in <strong>{ selectedState }</strong>:
              <div>
                <strong>LOADING...</strong>
              </div>
            </h3>
          }
          {isFetching && selectedRecArea &&
            <h3>
              Facilities for: <strong>{ selectedRecArea.RecAreaName }</strong>:
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
          {!isFetching && !!recareas.length && !facilities.length &&
            <div>
               <h3>
                Recreational Areas in <strong>{ selectedState }</strong>: ({ recareas.length })
              </h3>
              <div>
                {this.renderRecAreas()}
              </div>      
            </div>
          }
          {!isFetching && !!facilities.length &&
            <div>
              <h3>
               Facilities for:&nbsp;
               {selectedRecArea &&
                <strong>{ selectedRecArea.RecAreaName }</strong>
               }
               {searchQuery &&
                <strong>{ searchQuery }</strong>
               }
               &nbsp;({facilities.length})
              </h3>
              <div>
                {this.renderFacilities()}
              </div>      
            </div>
          }
        </span>
        <Dialog
          actions={modalActions}
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
