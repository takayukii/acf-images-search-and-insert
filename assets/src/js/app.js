import React from 'react'
import ReactDOM from 'react-dom'

import Root from './views/Root'
import configureStore from './utils/configureStore'
import getAcfFields from './utils/getAcfFields'

const debug = require('debug')('aisai:app')

// Require scss here to be compiled by webpack
require('../scss/style.scss')

debug('xxxx', window._wpMediaViewsL10n)

const acfFields = getAcfFields()
const initialState = {
  acf: {
    acfFields: acfFields,
    receivedImages: {}
  }
}

const store = configureStore({initialState})
debug('store', store)

// Render the React application to the DOM
ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
)
