import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import SearchReducers from '../reducers/SearchReducers'
import AcfReducers from '../reducers/AcfReducers'

const rootReducer = combineReducers({
  search: SearchReducers,
  acf: AcfReducers
})

function withDevTools (middleware) {
  const devTools = window.devToolsExtension
    ? window.devToolsExtension()
    : require('./DevTools').default.instrument()
  return compose(middleware, devTools)
}

export default function configureStore ({ initialState = {} }) {
  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(thunk)
  if (__DEBUG__) middleware = withDevTools(middleware)

  const store = middleware(createStore)(rootReducer, initialState)
  return store
}
