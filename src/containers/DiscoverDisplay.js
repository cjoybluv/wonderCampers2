
import { connect } from 'react-redux';

import Discover from '../components/Discover';
import { fetchRecAreas, setRecArea, fetchFacilities } from '../actions/discoverActions';

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
    dispatch: dispatch,
  }
);

export default connect(
  mapStateToDiscoverProps,
  mapDispatchToDiscoverProps
)(Discover);
