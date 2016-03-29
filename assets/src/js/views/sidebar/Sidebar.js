import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import AcfActions from '../../actions/AcfActions'
import AcfItem from './AcfItem'

export class Sidebar extends React.Component {
  static propTypes = {
    acf: PropTypes.object
  };

  render () {
    const acfFields = this.props.acf.acfFields
    const jsxAcfItems = acfFields.map((field) => {
      return <AcfItem key={field.name} acfField={field} />
    })
    return (
      <div className='aisai-content-sidebar'>
        <ul className='aisai-content-sidebar__acf-items'>
          {jsxAcfItems}
        </ul>
      </div>
    )
  }
}

export default connect((state) => ({
  acf: state.acf
}), AcfActions)(Sidebar)
