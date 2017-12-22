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
  return fetch(`https://ridb.recreation.gov/api/v1/recareas.json?apikey=5722E187D51D46678DC8F5B047FCB82E&full=true&state=${selectedState}`)
    .then((response) => response.json())
    .then((json) => dispatch(receiveRecareas(selectedState,json.RECDATA)))
}

const selectRecArea = (recAreaID) => ({
  type: RECAREA_SELECT,
  recAreaID
})

export const setRecArea = selectedRecarea => dispatch => {
  dispatch(selectRecArea(selectedRecarea));
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
  const recAreaID = selectedRecArea.toString();
  return fetch(`https://ridb.recreation.gov/api/v1/recareas/${recAreaID}/facilities/?apikey=5722E187D51D46678DC8F5B047FCB82E&full=true`)
    .then((response) => response.json())
    .then((json) => dispatch(receiveFacilities(json.RECDATA)))
}

