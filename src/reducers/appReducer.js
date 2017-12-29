import {
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS
} from '../actions/appActions';

const appProps = (state = {
  user: {}
}, action) => {
  switch (action.type) {
    case USER_SIGNUP_REQUEST:
    case USER_SIGNUP_SUCCESS:
    case USER_LOGIN_REQUEST:
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user
      }
    default:
      return state
  }
}

export default appProps;
