import { combineReducers } from 'redux'

import appProps from './appReducer'
import selectedSubreddit from './selectReducer';
import postsBySubreddit from './postsReducer';
import discoverProps from './discoverReducer';

const rootReducer = combineReducers({
  appProps,
  discoverProps,
  postsBySubreddit,
  selectedSubreddit
})

export default rootReducer
