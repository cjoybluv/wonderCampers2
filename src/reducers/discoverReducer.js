import { 
  FETCH_RECAREAS_REQUEST, 
  FETCH_RECAREAS_SUCCESS, 
  RECAREA_SELECT,
  FETCH_FACILITIES_REQUEST,
  FETCH_FACILITIES_SUCCESS
} from '../actions/discoverActions';

const discoverProps = (state = {
  isFetching: false,
  selectedState: '',
  recareas: [],
  selectedRecArea: null,
  facilities: []
}, action) => {
  switch (action.type) {
    case FETCH_RECAREAS_REQUEST:
      return {
        ...state,
        isFetching: true,
        recareas: [],
        selectedState: action.state,
        selectedRecArea: null,
        facilities: []
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
        selectedRecArea: action.recAreaID
      }
    case FETCH_FACILITIES_REQUEST:
      return {
        ...state,
        isFetching: true,
        facilities: []
      }
    case FETCH_FACILITIES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        facilities: action.facilities
      }
    default:
      return state
  }
}

export default discoverProps;
