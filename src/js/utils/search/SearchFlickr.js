import Promise from 'bluebird'
import agent from 'superagent-bluebird-promise'

const debug = require('debug')('aisai:utils:search:SearchFlickr')

export default class SearchFlickr {
  search (keyword, page) {
    debug('aisaiLocal', window.aisaiLocal)
    // https://www.flickr.com/services/api/flickr.photos.search.html
    const perPage = window.aisaiLocal.options.per_page
    const apikey = window.aisaiLocal.options.flickr_apikey
    const licenses = window.aisaiLocal.options.flickr_licenses
    const sort = window.aisaiLocal.options.flickr_sort
    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=${sort}&license=${licenses}&format=json&per_page=${perPage}&text=${encodeURI(keyword)}&page=${page}&api_key=${apikey}`
    debug('URL to fetch in search', url)

    return new Promise((resolve, reject) => {
      this.fetch(url)
        .then((data) => {
          debug('data', data)
          const transformed = this.transform(data, keyword)
          resolve(transformed)
        })
        .catch((err) => {
          debug('Error in search', err)
          reject(err)
        })
    })
  }
  fetch (url) {
    return new Promise((resolve, reject) => {
      agent
        .get(url)
        .set('Accept', 'application/json')
        .then(res => {
          // handle JSONP response
          debug('Raw response in fetch', res)
          const response = eval(`(${res.text})`)
          if (response.stat === 'ok') {
            resolve(response)
          } else {
            debug('Error in fetch', response)
            reject(response)
          }
        })
        .catch(err => {
          debug('Error in fetch', err)
          reject(err)
        })
    })
  }
  transform (data, keyword) {
    const photos = data.photos.photo.map((photo) => {
      return {
        url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
        thumbUrl: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`,
        title: photo.title,
        poweredBy: 'Flickr',
        site: `http://www.flickr.com/photos/${photo.owner}/${photo.id}/`,
        caption: `<a href="http://www.flickr.com/photos/${photo.owner}/${photo.id}/" target="_blank">${photo.title} on Flickr</a>`
      }
    })
    return {
      keyword: keyword,
      page: data.photos.page,
      max: data.photos.pages,
      perPage: data.photos.perpage,
      count: data.photos.total,
      photos: photos
    }
  }
}
/* eslint-disable */
function jsonFlickrApi (jsonp) {
  return jsonp
}
/* eslint-enable */
