import { FETCH_RECAREAS_REQUEST, FETCH_RECAREAS_SUCCESS } from '../actions/discoverActions';

const discoverProps = (state = {
  isFetching: false,
  selectedState: '',
  recareas: []
}, action) => {
  switch (action.type) {
    case FETCH_RECAREAS_REQUEST:
      return {
        ...state,
        isFetching: true,
        recareas: [],
        selectedState: action.state
      }
    case FETCH_RECAREAS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        recareas: action.recareas
      }
    default:
      return state
  }
}

export default discoverProps;
