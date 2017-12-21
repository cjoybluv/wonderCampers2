import { combineReducers } from 'redux'

import selectedSubreddit from './selectReducer';
import postsBySubreddit from './postsReducer';
import discoverProps from './discoverReducer';

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit,
  discoverProps
})

export default rootReducer
