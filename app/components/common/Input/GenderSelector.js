/**
 * Created by wanpeng on 2016/12/21.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {ButtonGroup} from 'react-native-elements'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'

class GenderSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0
    }
  }
  componentDidMount() {
    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
      initValue: {text: this.props.initValue},
      checkValid: this.validInput
    }
    this.props.initInputForm(formInfo)
  }

  validInput(data) {
    return {isVal:true, errMsg:"验证通过"}
  }

  updateIndex (selectedIndex) {
    let gender = ""
    this.setState({selectedIndex})
    console.log('selected', selectedIndex)
    if (selectedIndex == 0) {
      gender = "male"
    } else {
      gender = "female"
    }
    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text: gender}
    }
    this.props.inputFormUpdate(formInfo)
  }

  render() {
    const buttons = ['男', '女']
    return (
      <ButtonGroup
        onPress={(index) => this.updateIndex(index)}
        selectedIndex={this.state.selectedIndex}
        buttons={buttons}
        containerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        selectedBackgroundColor="red"
        textStyle={{fontSize: 18}}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GenderSelector)