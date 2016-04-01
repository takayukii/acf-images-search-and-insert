import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import AcfActions from '../../actions/AcfActions'

export class Footer extends React.Component {
  static propTypes = {
    acf: PropTypes.object.isRequired,
    uploadReceivedImages: PropTypes.func.isRequired
  };

  render () {
    const images = this.props.acf.receivedImages
    const keys = Object.keys(images)

    let className = 'disabled'
    let handleClick = null
    if (keys.length > 0) {
      className = ''
      handleClick = this.onClickButton.bind(this)
    }
    return (
      <div className='aisai-footer'>
        <button className={`btn btn-primary ${className}`} onClick={handleClick}>{window.aisaiLocal.text.UploadAndInsert}</button>
      </div>
    )
  }

  onClickButton (event) {
    event.preventDefault()
    this.props.uploadReceivedImages()
  }
}

export default connect((state) => ({
  acf: state.acf
}), AcfActions)(Footer)
