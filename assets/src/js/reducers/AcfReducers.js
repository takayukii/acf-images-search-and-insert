import { handleActions } from 'redux-actions'
import { AcfActionTypes } from '../constants/Constants'

const debug = require('debug')('aisai:reducers:AcfReducers')

const defaultState = {
  isUploading: false,
  acfFields: [],
  receivedImages: {}
}

export default handleActions({
  [AcfActionTypes.IMAGE_RECEIVE]: (state, { type, payload }) => {
    debug('handleActions', type, payload)
    const receivedImages = Object.assign({}, state.receivedImages)
    receivedImages[payload.name] = payload.photo
    return Object.assign({}, state, {
      receivedImages: receivedImages
    })
  },
  [AcfActionTypes.IMAGE_CANCEL]: (state, { type, payload }) => {
    debug('handleActions', type, payload)
    const receivedImages = Object.assign({}, state.receivedImages)
    delete receivedImages[payload]
    return Object.assign({}, state, {
      receivedImages: receivedImages
    })
  },
  [AcfActionTypes.IMAGE_UPLOADING]: (state, { type, payload }) => {
    debug('handleActions', type, payload)
    return Object.assign({}, state, {
      isUploading: true
    })
  },
  [AcfActionTypes.IMAGE_UPLOAD_COMPLETED]: (state, { type, payload }) => {
    debug('handleActions', type, payload)
    return Object.assign({}, state, {
      isUploading: false,
      uploadedImages: payload
    })
  }
}, defaultState)
