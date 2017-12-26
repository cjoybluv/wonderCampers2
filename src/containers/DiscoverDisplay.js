
import { connect } from 'react-redux';

import Discover from '../components/Discover';
import { 
  fetchRecAreas, 
  setRecArea, 
  fetchFacilities, 
  fetchFacilitiesQuery,
  fetchFacilitiesRadiusPlacename
} from '../actions/discoverActions';

const mapStateToDiscoverProps = (state) => (
  {
    discoverProps: state.discoverProps
  }
);

const mapDispatchToDiscoverProps = (dispatch) => (
  {
    fetchRecAreas: (selectedState) => (
      dispatch(fetchRecAreas(selectedState))
    ),
    setRecArea: (selectedRecArea) => (
      dispatch(setRecArea(selectedRecArea))
    ),
    fetchFacilities: (selectedRecArea) => (
      dispatch(fetchFacilities(selectedRecArea))
    ),
    fetchFacilitiesQuery: (state,query) => (
      dispatch(fetchFacilitiesQuery(state,query))
    ),
    fetchFacilitiesRadiusPlacename: (state,radius,placename) => (
      dispatch(fetchFacilitiesRadiusPlacename(state,radius,placename))
    ),
    dispatch: dispatch,
  }
);

export default connect(
  mapStateToDiscoverProps,
  mapDispatchToDiscoverProps
)(Discover);
