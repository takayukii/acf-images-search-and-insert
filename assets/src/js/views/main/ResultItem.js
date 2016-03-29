import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import { DnDTypes } from '../../constants/Constants'

import SearchActions from '../../actions/SearchActions'

const dndSource = {
  beginDrag (props) {
    return props.photo
  }
}

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

export class ResultItem extends React.Component {
  static propTypes = {
    photo: PropTypes.object.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  };

  render () {
    const {connectDragSource, isDragging} = this.props
    const className = isDragging ? 'aisai-result-item--dragging' : 'aisai-result-item'

    return connectDragSource(
      <li>
        <div className={className}>
          <a href={this.props.photo.site} target='_blank'>
            <img src={this.props.photo.thumbUrl} title={this.props.photo.title} />
          </a>
        </div>
      </li>
    )
  }
}

const dragSource = DragSource(DnDTypes.FOUND_IMAGE, dndSource, collect)(ResultItem)
export default connect((state) => ({
  search: state.search
}), SearchActions)(dragSource)
