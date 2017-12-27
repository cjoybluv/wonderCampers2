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
  TextField,
  Slider,
  Checkbox
} from 'material-ui';
import {Card, CardText} from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import Search from 'material-ui/svg-icons/action/search';

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
  campingOnly: {
    display: "inline-table",
    width: "65%"
  },
  chip: {
    margin: 4,
    display: "inline-block"
  },
  font20: {
    fontSize: 20
  },
  slider: {
    marginBottom: 0,
    marginTop: 12
  },
  gridList: {
    width: "30%"
  },
  filterSelected: {
    background: "lightgreen"
  }
};


const filterList = [
  { "ActivityID": 5, "ActivityName": "BIKING" },
  { "ActivityID": 6, "ActivityName": "BOATING" },
  { "ActivityID": 11, "ActivityName": "FISHING" },
  { "ActivityID": 14, "ActivityName": "HIKING" },
  { "ActivityID": 16, "ActivityName": "HUNTING" },
  { "ActivityID": 105, "ActivityName": "PADDLING" },
  { "ActivityID": 20, "ActivityName": "PICNIC" },
  { "ActivityID": 43, "ActivityName": "SNOWPARK" },
  { "ActivityID": 25, "ActivityName": "SUMMER" },
  { "ActivityID": 106, "ActivityName": "SWIMMING" },
  { "ActivityID": 15, "ActivityName": "RIDING" },
  { "ActivityID": 23, "ActivityName": "RV" },
  { "ActivityID": 28, "ActivityName": "WILDERNESS" },
  { "ActivityID": 26, "ActivityName": "WILDLIFE" },
  { "ActivityID": 22, "ActivityName": "WINTER" }
];

class Discover extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      selectedState: '', 
      recareas: [],
      recAreasReturned: [],
      recAreaOpen: false,
      selectedRecArea: null,
      facilities: [],
      facilitiesReturned: [],
      facilityOpen: false,
      selectedFacility: null,
      searchQuery: '',
      searchRadius: 20,
      searchPlacename: '',
      selectedActivityFilters: []
    };
  }

  componentWillReceiveProps(update) {
    this.setState({
      isFetching: update.discoverProps.isFetching,
      recareas: update.discoverProps.recareas,
      facilities: update.discoverProps.facilities,
      recAreasReturned: update.discoverProps.recareas,
      facilitiesReturned: update.discoverProps.facilities
    });
  }

  handleStateSelect = (event, index, value) => {
    this.setState({
      selectedState: value,
      facilities: [],
      facilitiesReturned: [],
      recareas: [],
      recAreasReturned: [],
      searchQuery: '',
      searchRadius: 20,
      searchPlacename: ''
    });
    this.setState({isFetching: true});
    this.props.fetchRecAreas(value);
  }

  handleRecAreaSelect = (event, index, value) => {
    this.setState({
      selectedRecArea: value
    });
    this.props.setRecArea(value);
    this.props.fetchFacilities(value);
  }

  handleQuery = (event) => {
    this.setState({searchQuery: event.target.value});
  }

  submitQuery = (e) => {
    e.preventDefault();
    const { selectedState, searchQuery } = this.state;
    this.props.fetchFacilitiesQuery(selectedState,searchQuery);
  }

  handleRadius = (e, value) => {
    this.setState({searchRadius: value});
  }

  handlePlacename = (e) => {
    this.setState({searchPlacename: e.target.value});
  }

  submitRadiusPlacename = (e) => {
    e.preventDefault();
    const { selectedState, searchRadius, searchPlacename } = this.state;
    this.props.fetchFacilitiesRadiusPlacename(selectedState,searchRadius,searchPlacename);
  }

  handleCampingOnly = () => {
    this.setState((oldState) => {
      return {
        campingOnly: !oldState.campingOnly,
      };
    },this.campingOnly);
  }

  campingOnly = () => {
    const { facilities, recAreasReturned, facilitiesReturned } = this.state;
    if (facilities.length === 0) {
      this.setState({ recareas: recAreasReturned.filter(this.activityFilter) });
    } else {
      this.setState({ facilities: facilitiesReturned.filter(this.activityFilter) });
    }
  } 

  handleFilterClick = (e) => {
    const { isFetching, recAreasReturned } = this.state;
    if (isFetching || !recAreasReturned.length) {
      return true;
    }
    let activityID;
    if (e.target.getAttribute("value")) {
      activityID = parseInt(e.target.getAttribute("value"),10)
    } else {
      activityID = parseInt(e.target.parentNode.getAttribute("value"),10)
    }
    const idx = this.state.selectedActivityFilters.indexOf(activityID);
    const existingFilters = this.state.selectedActivityFilters;
    if (idx === -1) {
      this.setState({selectedActivityFilters: existingFilters.concat(activityID)},this.resetFilters)
    } else {
      this.setState({selectedActivityFilters: existingFilters.slice(0,idx).concat(existingFilters.slice(idx+1)) },this.resetFilters)
    }
  }

  isActivitySelected = (activityID) => {
    return this.state.selectedActivityFilters.indexOf(activityID) !== -1;
  }

  resetFilters = () => {
    const { recAreasReturned, facilitiesReturned } = this.state;
    if (facilitiesReturned.length === 0) {
      this.setState({ recareas: recAreasReturned.filter(this.activityFilter) });
    } else {
      this.setState({ facilities: facilitiesReturned.filter(this.activityFilter) });
    }
  }

  activityFilter = (ra) => {
    const { campingOnly, selectedActivityFilters } = this.state;
    var activityFound = false;
    var hasCamping = false;

    var filterCount = selectedActivityFilters.length;

    // console.log('raFilter',selectedActivityFilters);
    if (typeof ra.ACTIVITY === 'object') {
      
      for (var i=0;i<ra.ACTIVITY.length;i++) {
        if (campingOnly) {
          if (ra.ACTIVITY[i].ActivityID === 9) {
            hasCamping = true;
          }
          if (filterCount > 0) {
            if (selectedActivityFilters.indexOf(ra.ACTIVITY[i].ActivityID) !== -1) {
              activityFound = true;
            }
          } else {
            activityFound = true;
          }
        } else {
          if (selectedActivityFilters.indexOf(ra.ACTIVITY[i].ActivityID) !== -1) {
            activityFound = true;
          }
        }
      }
    }
    var includeRec = false;
    if (campingOnly) {
      if (hasCamping) {
        if (filterCount>0) {
          if (activityFound) {
            includeRec = true;
          }
        } else {
          includeRec = true;
        }
      }
    } else {
      if (filterCount>0) {
        if (activityFound) {
          includeRec = true;
        }
      } else {
        includeRec = true;
      }
    }
    return includeRec;
  };

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
    this.props.setRecArea(recArea);
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

        <div className="modal-address">
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
          {recArea.LINK.map((link, idx) => 
            <Chip key={idx} style={styles.chip}>
              <a href={prepareURL(link.URL)} target="_blank">{link.Title}</a>
            </Chip>            
          )}
        </Paper>
      </div>
    )
  }

  openFacility = (facility) => {
    this.setState({
      facilityOpen: true,
      facility
    });
    this.props.setRecArea(facility);
  }

  closeFacility = () => {
    this.setState({facilityOpen: false});
  }

  renderFacilities() {
    const { facilities } = this.state;
    return (
      <List>
        {facilities.map((facility, i) =>
          <div key={i} >
            <ListItem onClick={this.openFacility.bind(this,facility)} >
              <div>
                <h4>{facility.FacilityName}</h4>
                <p dangerouslySetInnerHTML={{__html: facility.FacilityDescription}} />
                {facility.ACTIVITY.map(this.activityIconListItem)}
              </div>
              {(i+1 !== facilities.length) && <Divider />}
            </ListItem>
          </div>
        )}
      </List>
    )
  }

  renderFacilityModal() {
    const { facility, facilityOpen } = this.state;
    if (!facilityOpen || !facility) {
      return null;
    }

    return (
      <div className="modal">
        <h3>{facility.FacilityName}</h3>

        <div className="modal-address">
          <div className="col-6">
            <Card>
              <CardText>
                {facility.FACILITYADDRESS[0].FacilityStreetAddress1} <br/>
                {facility.FACILITYADDRESS[0].City}, {facility.FACILITYADDRESS[0].AddressStateCode}   {facility.FACILITYADDRESS[0].PostalCode} <br/>
                {facility.FacilityEmail} {facility.FacilityPhone}<br/>
                {facility.FacilityMapURL &&
                  <a href={prepareURL(facility.FacilityMapURL)} target="_blank">Goto Map</a>
                }
              </CardText>
            </Card>
          </div>
          {facility.MEDIA[0] && facility.MEDIA[0].MediaType==='Image' &&
            <div className="col-6">
              <img src={facility.MEDIA[0].URL} alt="" />
            </div>
          }
        </div>  
        <div>
          <Chip style={styles.chip}>
            ACTIVITY: {facility.ACTIVITY.length}
          </Chip>
          <Chip style={styles.chip}>
            LINK: {facility.LINK.length}
          </Chip>
          <Chip style={styles.chip}>
            MEDIA: {facility.MEDIA.length}
          </Chip>
          <Chip style={styles.chip}>
            EVENT: {facility.EVENT.length}
          </Chip>
        </div>
        <Paper zDepth={1}>
          <h3>Description</h3>
          <p dangerouslySetInnerHTML={{__html: facility.FacilityDescription}} />
          {facility.FacilityReservationURL && <div><a href={facility.FacilityReservationURL} target="_blank"><h4>Reservations</h4></a></div>}
        </Paper>
        <Paper zDepth={1}>
          <h3>Directions</h3>
          <p dangerouslySetInnerHTML={{__html: facility.FacilityDirections}} />
        </Paper>
        <Paper>
          <h3>Activities</h3>
          {facility.ACTIVITY.map(this.activityIconListItem)}
        </Paper>
        <Paper>
          <h3>Links</h3>
          {facility.LINK.map((link, idx) => 
            <Chip key={idx} style={styles.chip}>
              <a href={prepareURL(link.URL)} target="_blank">{link.Title}</a>
            </Chip>            
          )}
        </Paper>
      </div>
    )
  }

  render() {
    const { 
      isFetching, 
      recareas, 
      recAreasReturned,
      facilities,
      facilitiesReturned,
      selectedState, 
      recAreaOpen,
      facilityOpen,
      selectedRecArea,
      searchQuery,
      searchRadius,
      searchPlacename,
      campingOnly
    } = this.state;

    const recAreaModalActions = [
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

    const facilityModalActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeFacility}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.closeFacility}
      />,
    ];

    return (
      <div className="container">

      {/* LOOKUP AREA */}
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
            <form id="searchQueryForm" onSubmit={(e) => this.submitQuery(e)}>
              <TextField 
                style={styles.width100}
                floatingLabelText="OR Enter Search Term"
                floatingLabelFixed={true}
                floatingLabelStyle={styles.font20}
                value={searchQuery}
                onChange={this.handleQuery}
                disabled={isFetching || !recareas.length}
              />
              <FlatButton type="submit"><Search /></FlatButton>
            </form>
          </div>

          <div className="container">
            <h4 className="dim">OR Enter Radius &amp; Placename</h4>
            <form id="searchPlacenameForm" onSubmit={(e) => this.submitRadiusPlacename(e)}>
              <Slider
                min={0}
                max={100}
                step={1}
                defaultValue={20}
                value={searchRadius}
                onChange={this.handleRadius}
                sliderStyle={styles.slider}
                disabled={isFetching || !recareas.length}
              />
              <label className="radius-label">{searchRadius}</label>
              <TextField 
                style={styles.width100}
                floatingLabelText="Placename"
                floatingLabelFixed={true}
                value={searchPlacename}
                onChange={this.handlePlacename}
                disabled={isFetching || !recareas.length}
              />
              <FlatButton type="submit"><Search /></FlatButton>
            </form>
          </div>

          <div className="container">
            <Checkbox
              label="Camping Only?"
              checked={campingOnly}
              onCheck={this.handleCampingOnly.bind(this)}
              style={styles.campingOnly}
              disabled={isFetching || !recAreasReturned.length}
            />
            <section className="activity-icon">
              <img src={images["acticon-9.png"]} alt={'Camping'} />
            </section>
          </div>

          <div className="container">
            <GridList 
              cellHeight={72}
              cols={3}
            >
              {filterList.map((activity, idx) => (
                <GridTile
                  key={idx}
                  value={activity.ActivityID}
                  titleBackground='rgba(0,0,0,0)'
                  className={"activity-icon"}
                  onClick={this.handleFilterClick.bind(this)}
                  style={this.isActivitySelected(activity.ActivityID) ? styles.filterSelected : null}
                >
                  <img 
                    className="grid-image"
                    src={images['acticon-'+activity.ActivityID+'.png']} 
                    alt={activity.ActivityName}
                  />
                  <label className="grid-label">{activity.ActivityName}</label>
                </GridTile>
              ))}
            </GridList>
          </div>
        </span>

        {/* CONTENT AREA */}
        <span className="col-8">
          {isFetching && selectedState && !selectedRecArea && !searchQuery && !searchPlacename &&
            <h3>
              Recreational Areas in <strong>{ selectedState }</strong>:
              <div>
                <strong>LOADING...</strong>
              </div>
            </h3>
          }
          {isFetching && (selectedRecArea || searchQuery || searchPlacename) &&
            <h3>
              Facilities for: 
              {selectedRecArea && <strong>{ selectedRecArea.RecAreaName }</strong>}
              {searchQuery && <strong>{ searchQuery }</strong>}
              <div>
                <strong>LOADING...</strong>
              </div>
            </h3>
          }
          {!isFetching && !recAreasReturned.length &&
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
          {!isFetching && !!recAreasReturned.length && !facilitiesReturned.length && !searchQuery && !searchPlacename &&
            <div>
               <h3>
                Recreational Areas in <strong>{ selectedState }</strong>: ({ recareas.length })
              </h3>
              <div>
                {this.renderRecAreas()}
              </div>      
            </div>
          }
          {!isFetching && (selectedRecArea || searchQuery || searchPlacename) &&
            <div>
              <h3>
               Facilities for:&nbsp;
               {selectedRecArea && <strong>{ selectedRecArea.RecAreaName }</strong>}
               {searchQuery && <strong>{ searchQuery }</strong>}
               {searchPlacename && <strong>within { searchRadius } miles from { searchPlacename }</strong>}
               &nbsp;({facilities.length})
              </h3>
              {!!facilities.length && 
                <div>
                  {this.renderFacilities()}
                </div>      
              }
            </div>
          }
        </span>
        <Dialog
          actions={recAreaModalActions}
          modal={false}
          open={recAreaOpen}
          onRequestClose={this.closeRecArea}
          autoScrollBodyContent={true}
        >
          {this.renderRecAreaModal()}
        </Dialog>
        <Dialog
          actions={facilityModalActions}
          modal={false}
          open={facilityOpen}
          onRequestClose={this.closeFacility}
          autoScrollBodyContent={true}
        >
          {this.renderFacilityModal()}
        </Dialog>
      </div>
    )
  }

};

export default Discover;
