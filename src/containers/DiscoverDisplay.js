
import { connect } from 'react-redux';

import Discover from '../components/Discover';
import { fetchRecAreas } from '../actions/discoverActions';

const mapStateToDiscoverProps = (state) => (
  {
    state: state.selectedState,
    recareas: state.recareas
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

const mergeDiscoverProps = (stateProps, dispatchProps) => (
  {
    ...stateProps,
    ...dispatchProps,
  }
);

export default connect(
  mapStateToDiscoverProps,
  mapDispatchToDiscoverProps,
  mergeDiscoverProps
)(Discover);
