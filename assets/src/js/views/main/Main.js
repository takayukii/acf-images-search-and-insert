import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import SearchActions from '../../actions/SearchActions'

import ProviderSearch from './ProviderSearch'
import ProviderResult from './ProviderResult'

export class Main extends React.Component {
  static propTypes = {
    search: PropTypes.object
  };

  render () {
    return (
      <div className='aisai-content-main'>
        <ProviderSearch />
        <ProviderResult />
      </div>
    )
  }
}

export default connect((state) => ({
  search: state.search
}), SearchActions)(Main)
