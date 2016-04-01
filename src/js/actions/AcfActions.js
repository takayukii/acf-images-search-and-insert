import Promise from 'bluebird'
import { createAction } from 'redux-actions'
import { AcfActionTypes } from '../constants/Constants'

const debug = require('debug')('aisai:actions:AcfActions')

export const receive = createAction(AcfActionTypes.IMAGE_RECEIVE)
export const cancel = createAction(AcfActionTypes.IMAGE_CANCEL)
export const upload = createAction(AcfActionTypes.IMAGE_UPLOADING)
export const complete = createAction(AcfActionTypes.IMAGE_UPLOAD_COMPLETED)

export const uploadReceivedImages = () => {
  return (dispatch, getState) => {
    dispatch(upload())
    const state = getState()
    debug('Invoking uploadReceivedImages', 'state', state)
    const imageKeys = Object.keys(state.acf.receivedImages)
    const uploadedImages = {};

    // Loop with Promise
    (function loop (i) {
      if (i < imageKeys.length) {
        const receivedImage = state.acf.receivedImages[imageKeys[i]]
        return uploadImage(receivedImage)
        .then((res) => {
          uploadedImages[imageKeys[i]] = res
          return i + 1
        })
        .then(loop)
        .catch((err) => {
          debug('Error in uploadReceivedImages', err)
        })
      }
      dispatch(complete(uploadedImages))
      copyImages(uploadedImages)
      return Promise.resolve(i)
    })(0)
  }
}

export const uploadImage = (params) => {
  debug('Invoking uploadImage', params)
  return new Promise((resolve, reject) => {
    const data = Object.assign(params, {
      action: 'upload_image',
      [window.aisaiLocal.nonces.field]: window.aisaiLocal.nonces.v
    })

    // To invoke admin_ajax, WP JQuery would be needed
    window.jQuery
    .post(window.aisaiLocal.ajaxUrl, data)
    .done((res) => {
      if (res.success) {
        resolve(res.data)
      } else {
        reject(new Error(res))
      }
    })
  })
}

export const copyImages = (uploadedImages) => {
  debug('Invoking copyImages', uploadedImages)
  const $ = window.jQuery
  const $imageFields = $('.field_type-image', window.parent.document)

  $.each($imageFields, (idx, elm) => {
    const fieldName = $(elm).attr('data-field_name')
    const image = uploadedImages[fieldName]
    if (!image) {
      return
    }
    window.parent.acf.media.div = $(elm).find('div.acf-image-uploader.clearfix')
    window.parent.acf.fields.image.add({
      id: image.attachment_id,
      url: image.url
    })
  })
  window.alert(window.aisaiLocal.text.NoticeAfterUploadAndInsert)
  window.parent.wp.media.frame.close()
}

export default {
  receive,
  cancel,
  uploadReceivedImages
}
