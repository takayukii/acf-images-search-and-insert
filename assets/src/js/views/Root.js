import React, { PropTypes } from 'react'
import { Provider, connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Main from './main/Main'
import Sidebar from './sidebar/Sidebar'
import Footer from './footer/Footer'

import Loading from './Loading.gif'

export class Root extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    acf: PropTypes.object.isRequired
  }

  get content () {
    let jsxLoading = null
    if (this.props.search.isSearching || this.props.acf.isUploading) {
      jsxLoading = (
        <div className='aisai-wrap__loading'>
          <img src={Loading}/>
        </div>
      )
    }
    return (
      <section className='aisai-wrap'>
        <div className='aisai-content'>
          <Main />
          <Sidebar />
        </div>
        <Footer />
        {jsxLoading}
      </section>
    )
  }

  get devTools () {
    if (__DEBUG__) {
      if (!window.devToolsExtension) {
        require('../utils/createDevToolsWindow').default(this.props.store)
      } else {
        window.devToolsExtension.open()
      }
    }
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          {this.content}
          {this.devTools}
        </div>
      </Provider>
    )
  }
}

export default connect((state) => ({
  search: state.search,
  acf: state.acf
}), {})(DragDropContext(HTML5Backend)(Root))
