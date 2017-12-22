import { FETCH_RECAREAS_REQUEST, FETCH_RECAREAS_SUCCESS, RECAREA_SELECT } from '../actions/discoverActions';

const discoverProps = (state = {
  isFetching: false,
  selectedState: '',
  recareas: [],
  selectedRecarea: {}
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
    case RECAREA_SELECT:
      return {
        ...state,
        selectedRecarea: action.recarea
      }
    default:
      return state
  }
}

export default discoverProps;
