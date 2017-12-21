export const FETCH_RECAREAS_REQUEST = 'FETCH_RECAREAS_REQUEST';
export const FETCH_RECAREAS_SUCCESS = 'FETCH_RECAREAS_SUCCESS';

export const requestRecAreas = state => ({
  type: FETCH_RECAREAS_REQUEST,
  state: state,
})

export const receiveRecareas = (state, recareas) => ({
  type: FETCH_RECAREAS_SUCCESS,
  recareas
})

export const fetchRecAreas = selectedState => dispatch => {
  dispatch(requestRecAreas(selectedState))
  return fetch(`https://ridb.recreation.gov/api/v1/recareas.json?apikey=5722E187D51D46678DC8F5B047FCB82E&full=true&state=${selectedState}`)
    .then((response) => response.json())
    .then((json) => dispatch(receiveRecareas(selectedState,json.RECDATA)))
}
