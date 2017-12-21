
import { connect } from 'react-redux';

import Discover from '../components/Discover';
import { fetchRecAreas } from '../actions/discoverActions';

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
    dispatch: dispatch,
  }
);


export default connect(
  mapStateToDiscoverProps,
  mapDispatchToDiscoverProps
)(Discover);
