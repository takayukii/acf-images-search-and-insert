import { createAction } from 'redux-actions'
import { SearchActionTypes } from '../constants/Constants'

const debug = require('debug')('aisai:actions:SearchActions')

export const request = createAction(SearchActionTypes.SEARCH_REQUEST)
export const response = createAction(SearchActionTypes.SEARCH_RESPONSE)
export const error = createAction(SearchActionTypes.SEARCH_ERROR)
export const switchTab = createAction(SearchActionTypes.SEARCH_SWITCH)

export const searchImages = (keyword = '', page = 1, provider = 'flickr') => {
  return (dispatch, getState) => {
    dispatch(request({
      keyword: keyword,
      page: page,
      provider: provider
    }))

    const state = getState()
    debug('searchImages', 'state', state)
    const Worker = state.search.providers[provider].worker
    const worker = new Worker()
    worker
    .search(keyword, page)
    .then((data) => {
      const params = {}
      params[provider] = data
      dispatch(response(params))
    })
    .catch((err) => {
      dispatch(error({
        [provider]: err
      }))
    })
  }
}

export default {
  searchImages,
  switchTab
}
