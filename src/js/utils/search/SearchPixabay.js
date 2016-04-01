import Promise from 'bluebird'
import agent from 'superagent-bluebird-promise'

const debug = require('debug')('aisai:utils:search:SearchPixabay')

export default class SearchPixabay {
  search (keyword, page) {
    debug('aisaiLocal', window.aisaiLocal)
    // https://pixabay.com/api/docs/
    const perPage = window.aisaiLocal.options.per_page
    const apikey = window.aisaiLocal.options.pixabay_apikey
    const lang = window.aisaiLocal.options.pixabay_language
    const imageType = window.aisaiLocal.options.pixabay_image_type
    const orientation = window.aisaiLocal.options.pixabay_orientation
    const url = `https://pixabay.com/api/?key=${apikey}&lang=${lang}&image_type=${imageType}&orientation=${orientation}&per_page=${perPage}&page=${page}&search_term=${encodeURI(keyword)}`
    debug('URL to fetch in search', url)

    return new Promise((resolve, reject) => {
      this.fetch(url)
        .then((data) => {
          const transformed = this.transform(data, keyword, page, perPage)
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
          debug('Raw response in fetch', res)
          resolve(res.body)
        })
        .catch(err => {
          debug('Error in fetch', err)
          reject(err)
        })
    })
  }
  transform (data, keyword, page, perPage) {
    debug('transform', data)
    const photos = data.hits.map((photo) => {
      return {
        url: photo.webformatURL,
        thumbUrl: photo.previewURL,
        title: photo.tags,
        poweredBy: 'Pixabay',
        site: photo.pageURL,
        caption: `<a href="${photo.pageURL}" target="_blank">${photo.tags} on Pixabay</a>`
      }
    })
    return {
      keyword: keyword,
      page: page,
      max: Math.ceil(data.total / perPage) + 1,
      perPage: perPage,
      count: data.total,
      photos: photos
    }
  }
}

