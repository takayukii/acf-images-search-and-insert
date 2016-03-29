import _ from 'lodash'
import { handleActions } from 'redux-actions'

import { SearchActionTypes } from '../constants/Constants'
import SearchFlickr from '../utils/search/SearchFlickr'
import SearchPixabay from '../utils/search/SearchPixabay'

const debug = require('debug')('aisai:reducers:SearchReducers')

const defaultState = {
  isSearching: false,
  selectedProvider: 'flickr',
  providers: {
    flickr: {
      name: 'Flickr',
      worker: SearchFlickr
    },
    pixabay: {
      name: 'Pixabay',
      worker: SearchPixabay
    }
  }
}

export default handleActions({
  [SearchActionTypes.SEARCH_REQUEST]: (state, { type, payload }) => {
    debug('handleActions', type, payload)
    return Object.assign({}, state, {
      isSearching: true,
      selectedProvider: payload.provider
    })
  },
  [SearchActionTypes.SEARCH_RESPONSE]: (state, { type, payload }) => {
    debug('handleActions', type, payload)
    const providers = _.mapValues(state.providers, (provider, key) => {
      provider = Object.assign({}, provider)
      provider.isError = false
      delete provider.error
      if (payload[key]) {
        provider = Object.assign(provider, payload[key])
      }
      return provider
    })
    return Object.assign({}, state, {
      isSearching: false,
      providers: providers
    })
  },
  [SearchActionTypes.SEARCH_ERROR]: (state, { type, payload }) => {
    debug('handleActions', type, payload)
    const providers = _.mapValues(state.providers, (provider, key) => {
      provider = Object.assign({}, provider)
      if (payload[key]) {
        provider.isError = payload[key]
        provider.error = payload[key]
      }
      return provider
    })
    return Object.assign({}, state, {
      isSearching: false,
      providers: providers
    })
  },
  [SearchActionTypes.SEARCH_SWITCH]: (state, { type, payload }) => {
    debug('handleActions', type, payload)
    return Object.assign({}, state, {
      selectedProvider: payload
    })
  }
}, defaultState)
