import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import SearchActions from '../../actions/SearchActions'

import ResultItemList from './ResultItemList'
import Pagination from './Pagination'

export class Main extends React.Component {
  static propTypes = {
    search: PropTypes.object
  };

  render () {
    const selectedProvier = this.props.search.selectedProvider
    const provider = this.props.search.providers[selectedProvier]

    let jsxPagination = null
    if (provider.max > 1) {
      jsxPagination = <Pagination />
    }
    return (
      <div className='aisai-content-main__provider-result'>
        <ResultItemList />
        {jsxPagination}
      </div>
    )
  }
}

export default connect((state) => ({
  search: state.search
}), SearchActions)(Main)
