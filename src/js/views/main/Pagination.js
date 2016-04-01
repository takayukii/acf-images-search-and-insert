import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import SearchActions from '../../actions/SearchActions'

const debug = require('debug')('aisai:views:main:Pagination')

export class Pagination extends React.Component {
  static propTypes = {
    search: PropTypes.object.isRequired,
    searchImages: PropTypes.func.isRequired
  };

  render () {
    const selectedProvier = this.props.search.selectedProvider
    const provider = this.props.search.providers[selectedProvier]

    const boxCount = 11
    const enablePrev = provider.page - Math.floor(boxCount / 2) > 1
    const prevClassName = enablePrev ? '' : 'disabled'
    const enableNext = provider.page + Math.floor(boxCount / 2) < provider.max
    const nextClassName = enableNext ? '' : 'disabled'
    const start = provider.page - Math.floor(boxCount / 2) > 0 ? provider.page - Math.floor(boxCount / 2) : 1

    const jsxPagination = []
    for (let i = start; i < start + boxCount && i < provider.max; i++) {
      const className = provider.page === i ? 'active' : ''
      jsxPagination.push(<li key={i} className={className}><a href='#' onClick={this.onClickPage.bind(this, i)}>{i}</a></li>)
    }

    const prevOnClick = enablePrev ? this.onClickPage.bind(this, provider.page - 1) : null
    const nextOnClick = enableNext ? this.onClickPage.bind(this, provider.page + 1) : null
    return (
      <div className='aisai-content-main__pagination'>
        <ul className='pagination'>
          <li className={prevClassName}><a href='#' onClick={prevOnClick}><span aria-hidden='true'>«</span></a></li>
          {jsxPagination}
          <li className={nextClassName}><a href='#' onClick={nextOnClick}><span aria-hidden='true'>»</span></a></li>
        </ul>
      </div>
    )
  }

  onClickPage (page, event) {
    debug('onClickPage', page)
    event.preventDefault()

    const selectedProvier = this.props.search.selectedProvider
    const provider = this.props.search.providers[selectedProvier]

    this.props.searchImages(provider.keyword, page, selectedProvier)
  }
}

export default connect((state) => ({
  search: state.search
}), SearchActions)(Pagination)
