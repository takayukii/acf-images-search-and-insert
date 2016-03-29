import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import SearchActions from '../../actions/SearchActions'

import ResultItem from './ResultItem'

export class ResultItemList extends React.Component {
  static propTypes = {
    search: PropTypes.object.isRequired
  };

  render () {
    const selectedProvider = this.props.search.selectedProvider
    const provider = this.props.search.providers[selectedProvider]

    if (provider.isError) {
      return (
        <p className='aisai-content-main__error-message'>{provider.error.message}</p>
      )
    }

    let jsxResultItems = null
    if (provider.photos) {
      jsxResultItems = provider.photos.map((photo) => {
        return (
          <ResultItem key={photo.url} photo={photo} />
        )
      })
    }
    const hasmore = provider.max > 2 ? '--hasmore' : ''
    return (
      <div className={`aisai-content-main__result-items${hasmore}`}>
        <ul>
          {jsxResultItems}
        </ul>
      </div>
    )
  }
}

export default connect((state) => ({
  search: state.search
}), SearchActions)(ResultItemList)
