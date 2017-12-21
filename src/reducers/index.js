import { combineReducers } from 'redux'

import selectedSubreddit from './selectReducer';
import postsBySubreddit from './postsReducer';
import recareas from './discoverReducer';

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit,
  recareas
})

export default rootReducer
