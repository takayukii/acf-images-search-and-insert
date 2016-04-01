const debug = require('debug')('aisai:utils:getAcfFields')

export default function getAcfFields () {
  const $ = window.jQuery
  const $imageFields = $('.field_type-image', window.parent.document)

  const acfFields = []
  $imageFields.each((idx, elm) => {
    const $field = $(elm)
    const $label = $field.find('.label > label')
    const $img = $field.find('img.acf-image-image')
    const fieldNameLabel = $label.text()
    const imageUrl = $img.attr('src')
    const fieldName = $field.attr('data-field_name')
    acfFields.push({
      label: fieldNameLabel,
      name: fieldName,
      imageUrl: imageUrl
    })
  })
  debug('Retrieved ACF Image fields', acfFields)
  return acfFields
}
