export const FETCH_RECAREAS_REQUEST = 'FETCH_RECAREAS_REQUEST';
export const FETCH_RECAREAS_SUCCESS = 'FETCH_RECAREAS_SUCCESS';
export const RECAREA_SELECT = 'RECAREA_SELECT';
export const FETCH_FACILITIES_REQUEST = 'FETCH_FACILITIES_REQUEST';
export const FETCH_FACILITIES_SUCCESS = 'FETCH_FACILITIES_SUCCESS';

const requestRecAreas = state => ({
  type: FETCH_RECAREAS_REQUEST,
  state
})

const receiveRecareas = (state, recareas) => ({
  type: FETCH_RECAREAS_SUCCESS,
  recareas
})

export const fetchRecAreas = selectedState => dispatch => {
  dispatch(requestRecAreas(selectedState))
  return fetch(`http://localhost:3001/api/recareas?state=${selectedState}`)
    .then((response) => response.json())
    .then((json) => dispatch(receiveRecareas(selectedState,json)))
}

const selectRecArea = (recArea) => ({
  type: RECAREA_SELECT,
  recAreaID: recArea.RecAreaID
})

export const setRecArea = selectedRecArea => dispatch => {
  dispatch(selectRecArea(selectedRecArea));
}

const requestFacilities = recArea => ({
  type: FETCH_FACILITIES_REQUEST,
  recArea
})

const receiveFacilities = (facilities) => ({
  type: FETCH_FACILITIES_SUCCESS,
  facilities
})

export const fetchFacilities = selectedRecArea => dispatch => {
  dispatch(requestFacilities(selectedRecArea))
  const facilityIDs = getFacilityIDs(selectedRecArea);
  return fetch(`http://localhost:3001/api/facilities?facilityIDs=${facilityIDs}`)
    .then((response) => response.json())
    .then((json) => dispatch(receiveFacilities(json)))
}

var getFacilityIDs = function(recArea) {
  var facilityIDs = [];
  for (var j=0;j<recArea.FACILITY.length;j++) {
    facilityIDs.push(recArea.FACILITY[j].FacilityID);
  }
  return facilityIDs;
};