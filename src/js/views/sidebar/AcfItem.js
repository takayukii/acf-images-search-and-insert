import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

import { DnDTypes } from '../../constants/Constants'
import AcfActions from '../../actions/AcfActions'

const debug = require('debug')('aisai:views:sidebar:AcfItem')

const dndTarget = {
  drop (props, monitor) {
    debug('drop', props, monitor)
    props.receive({
      name: props.acfField.name,
      photo: monitor.getItem()
    })
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

export class AcfItem extends React.Component {
  static propTypes = {
    acf: PropTypes.object.isRequired,
    acfField: PropTypes.object.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    receive: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired
  };

  render () {
    const {connectDropTarget, isOver, acfField} = this.props

    let jsxImage = connectDropTarget(
      <div className='aisai-acf-item__img'>
        <p>{window.aisaiLocal.text.DragAndDropHere}</p>
      </div>
    )
    const hasReceivedImage = this.props.acf.receivedImages[acfField.name] || undefined
    if (hasReceivedImage) {
      const photo = this.props.acf.receivedImages[acfField.name]
      jsxImage = connectDropTarget(
        <div className='aisai-acf-item__img'>
          <img src={photo.thumbUrl} />
          <div className='aisai-acf-item__revert'>
            <div></div>
            <a href='#' onClick={this.onClickCancel.bind(this, acfField.name)}><span>{window.aisaiLocal.text.Cancel}</span></a>
          </div>
        </div>
      )
    } else {
      if (acfField.imageUrl) {
        jsxImage = connectDropTarget(
          <div className='aisai-acf-item__img'>
            <img src={acfField.imageUrl} />
          </div>
        )
      }
    }
    let className = 'aisai-acf-item'
    if (isOver) {
      className = 'aisai-acf-item--dragging'
    } else if (hasReceivedImage) {
      className = 'aisai-acf-item--received'
    }
    return (
      <li>
        <div className={className}>
          <p>{acfField.label}</p>
            {jsxImage}
        </div>
      </li>
    )
  }

  onClickCancel (fieldName, event) {
    event.preventDefault()
    this.props.cancel(fieldName)
  }
}

const dropTarget = DropTarget(DnDTypes.FOUND_IMAGE, dndTarget, collect)(AcfItem)
export default connect((state) => ({
  acf: state.acf
}), AcfActions)(dropTarget)
