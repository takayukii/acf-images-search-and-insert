import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import SearchActions from '../../actions/SearchActions'

const debug = require('debug')('aisai:views:main:ProviderSearch')

export class ProviderSearch extends React.Component {
  static propTypes = {
    search: PropTypes.object.isRequired,
    searchImages: PropTypes.func.isRequired,
    switchTab: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)
    this.state = {
      keyword: window.aisaiLocal.keyword || '',
      selectedTabKey: props.search.selectedProvider
    }
  }

  render () {
    debug('render', this.props.search)
    const keys = _.keys(this.props.search.providers)
    const jsxProviders = keys.map((key) => {
      const className = key === this.state.selectedTabKey ? 'active' : ''
      const provider = this.props.search.providers[key]
      return (
        <li key={key} className={className}><a className='aisai-searchtab__tab' href='#' onClick={this.onClickSearchTab.bind(this, key)}>{provider.name}</a></li>
      )
    })

    return (
      <div className='aisai-content-main__form'>
        <div className='aisai-searchform'>
          <div className='input-group'>
            <input type='text' className='form-control' placeholder={window.aisaiLocal.text.SearchFor} onKeyUp={this.onKeywordKeyUp.bind(this)} onChange={this.onKeywordChange.bind(this)} value={this.state.keyword} />
            <span className='input-group-btn'>
              <button className='btn btn-default' onClick={this.onClickSearchButton.bind(this)}>{window.aisaiLocal.text.Search}</button>
            </span>
          </div>
        </div>
        <div className='aisai-searchtab'>
          <ul className='nav nav-tabs'>
            {jsxProviders}
          </ul>
        </div>
      </div>
    )
  }

  onKeywordKeyUp (event) {
    if (event.keyCode === 13) {
      this.props.searchImages(this.state.keyword, 1, this.state.selectedTabKey)
    }
  }

  onKeywordChange (event) {
    const value = event.target.value
    this.setState({
      keyword: value
    })
  }

  onClickSearchButton (event) {
    debug(`onClickSearchButton`, this.state.selectedTabKey)
    const keywordIsNotEmpty = this.state.keyword !== ''
    if (keywordIsNotEmpty) {
      this.props.searchImages(this.state.keyword, 1, this.state.selectedTabKey)
    }
  }

  onClickSearchTab (key, event) {
    debug('onClickSearchTab', key, event)
    event.preventDefault()
    this.setState({
      selectedTabKey: key
    })
    this.props.switchTab(key)
  }
}

export default connect((state) => ({
  search: state.search
}), SearchActions)(ProviderSearch)
