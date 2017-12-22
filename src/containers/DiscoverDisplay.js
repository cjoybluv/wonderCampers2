
import { connect } from 'react-redux';

import Discover from '../components/Discover';
import { fetchRecAreas, setRecarea } from '../actions/discoverActions';

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
    setRecarea: (selectedRecarea) => (
      dispatch(setRecarea(selectedRecarea))
    ),
    dispatch: dispatch,
  }
);


export default connect(
  mapStateToDiscoverProps,
  mapDispatchToDiscoverProps
)(Discover);
