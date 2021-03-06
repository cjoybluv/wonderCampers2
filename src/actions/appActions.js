export const USER_SIGNUP_REQUEST = 'USER_SIGNUP_REQUEST';
export const USER_SIGNUP_SUCCESS = 'USER_SIGNUP_SUCCESS';
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';

const requestUserSignup = user => ({
  type: USER_SIGNUP_REQUEST,
  user
})

const userSignupSuccess = user => ({
  type: USER_SIGNUP_SUCCESS,
  user,
  message: 'You have been successfully Signed-up for wonderCampers!'
})

export const postUserSignup = user => dispatch => {
  dispatch(requestUserSignup(user))
  return fetch('http://localhost:3001/api/signup', 
    { method: 'POST', 
      body: JSON.stringify(user), 
      headers:  {'Content-Type': "application/json"}
    }
  ).then((res) => res.json()
  ).then((user) => dispatch(userSignupSuccess(user)))
}

const requestUserLogin = user => ({
  type: USER_LOGIN_REQUEST,
  user
})

const userLoginSuccess = user => ({
  type: USER_LOGIN_SUCCESS,
  user
})

export const postUserLogin = user => dispatch => {
  dispatch(requestUserLogin(user))
  return fetch('http://localhost:3001/api/login',
    { method: 'POST',
      body: JSON.stringify(user),
      headers: {'Content-Type': "application/json"}
    }
  ).then((res) => res.json()
  ).then((user) => dispatch(userLoginSuccess(user)))
}

// fetch("/echo/json/",
// {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     method: "POST",
//     body: JSON.stringify({a: 1, b: 2})
// })
// .then(function(res){ console.log(res) })



// export const FETCH_RECAREAS_REQUEST = 'FETCH_RECAREAS_REQUEST';
// export const FETCH_RECAREAS_SUCCESS = 'FETCH_RECAREAS_SUCCESS';
// export const RECAREA_SELECT = 'RECAREA_SELECT';
// export const FETCH_FACILITIES_REQUEST = 'FETCH_FACILITIES_REQUEST';
// export const FETCH_FACILITIES_SUCCESS = 'FETCH_FACILITIES_SUCCESS';
// export const FETCH_FACILITIES_REQUEST_QUERY = 'FETCH_FACILITIES_REQUEST_QUERY';
// export const FETCH_FACILITIES_REQUEST_RADIUS_PLACENAME = 'FETCH_FACILITIES_REQUEST_RADIUS_PLACENAME';

// const requestRecAreas = state => ({
//   type: FETCH_RECAREAS_REQUEST,
//   state
// })

// const receiveRecareas = (state, recareas) => ({
//   type: FETCH_RECAREAS_SUCCESS,
//   recareas
// })

// export const fetchRecAreas = selectedState => dispatch => {
//   dispatch(requestRecAreas(selectedState))
//   return fetch(`http://localhost:3001/api/recareas?state=${selectedState}`)
//     .then((response) => response.json())
//     .then((json) => dispatch(receiveRecareas(selectedState,json)))
// }

// const selectRecArea = (recArea) => ({
//   type: RECAREA_SELECT,
//   recAreaID: recArea.RecAreaID
// })

// export const setRecArea = selectedRecArea => dispatch => {
//   dispatch(selectRecArea(selectedRecArea));
// }

// const requestFacilities = recArea => ({
//   type: FETCH_FACILITIES_REQUEST,
//   recArea
// })

// const requestFacilitiesQuery = (state, query) => ({
//   type: FETCH_FACILITIES_REQUEST_QUERY,
//   state,
//   query
// })

// const requestFacilitiesRadiusPlacename = (state, radius, placename) => ({
//   type: FETCH_FACILITIES_REQUEST_RADIUS_PLACENAME,
//   state,
//   radius,
//   placename
// })

// const receiveFacilities = (facilities) => ({
//   type: FETCH_FACILITIES_SUCCESS,
//   facilities
// })

// export const fetchFacilities = selectedRecArea => dispatch => {
//   dispatch(requestFacilities(selectedRecArea))
//   const facilityIDs = getFacilityIDs(selectedRecArea);
//   return fetch(`http://localhost:3001/api/facilities?facilityIDs=${facilityIDs}`)
//     .then((response) => response.json())
//     .then((json) => dispatch(receiveFacilities(json)))
// }

// var getFacilityIDs = function(recArea) {
//   var facilityIDs = [];
//   for (var j=0;j<recArea.FACILITY.length;j++) {
//     facilityIDs.push(recArea.FACILITY[j].FacilityID);
//   }
//   return facilityIDs;
// };

// export const fetchFacilitiesQuery = (state,query) => dispatch => {
//   dispatch(requestFacilitiesQuery(state,query))
//   return fetch(`http://localhost:3001/api/facilities?state=${state}&query=${query}`)
//     .then((response) => response.json())
//     .then((json) =>dispatch(receiveFacilities(json)))
// }

// export const fetchFacilitiesRadiusPlacename = (state,radius,placename) => dispatch => {
//   dispatch(requestFacilitiesRadiusPlacename(state,radius,placename))
//   return fetch(`http://localhost:3001/api/facilities?state=${state}&radius=${radius}&placeName=${placename}`)
//     .then((response) => response.json())
//     .then((json) =>dispatch(receiveFacilities(json)))
// }
