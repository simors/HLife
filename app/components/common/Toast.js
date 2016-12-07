import React, {Component} from 'react'
import Toast from 'react-native-root-toast'
import {endToast} from '../../action/toastActions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

class CustomToast extends Component {
  delayedEndToast = () => {
    setTimeout(()=> {
      this.props.endToast()
    }, 1500)
  }

  render() {
    if (this.props.text) this.delayedEndToast()
    return (
      <Toast
        visible={this.props.text != undefined}
        position={Toast.positions.CENTER}
        shadow={true}
        animation={true}
        hideOnPress={true}
      >
        {this.props.text}
      </Toast>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    ...(state.TOAST).toJS()
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  endToast
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CustomToast)
