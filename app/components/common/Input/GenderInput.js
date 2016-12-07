/**
 * Created by yangyang on 2016/12/3.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  Keyboard,
  Image,
  Dimensions,
} from 'react-native'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData, getInputFormData} from '../../../selector/inputFormSelector'

class GenderInput extends Component {

  constructor(props) {
    super(props)
    this.state = {gender: '-1'}
  }

  static defaultProps = {
    autoFocus: false,
    genderText: '0'
  }

  componentDidMount() {
    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
      initValue: this.props.initValue
    }
    this.props.initInputForm(formInfo)
  }

  selectMale = () => {
    this.setState({gender: '1'})
    this.inputChange('1')
  }

  selectFemale = () => {
    this.setState({gender: '0'})
    this.inputChange('0')
  }

  inputChange(text) {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text}
    }
    this.props.inputFormUpdate(inputForm)
  }

  render() {
    return (
      <View style={[genderStyles.genderMainContainer, this.props.style]}>
        <View style={genderStyles.genderContainer}>
          <TouchableWithoutFeedback onPress={() => {
            this.selectMale()
          }}>
            <View style={this.state.gender == '1' ? genderStyles.genderBgSel : genderStyles.genderBg}>
              <Image style={genderStyles.genderImage} source={require('../../../assets/images/comments_select.png')}/>
            </View>
          </TouchableWithoutFeedback>
          <Text style={this.state.gender == '1' ? genderStyles.genderTextSel : genderStyles.genderText}>男</Text>
        </View>

        <View style={{width: 40}}/>

        <View style={genderStyles.genderContainer}>
          <TouchableWithoutFeedback onPress={() => {
            this.selectFemale()
          }}>
            <View style={this.state.gender == '0' ? genderStyles.genderBgSel : genderStyles.genderBg}>
              <Image style={genderStyles.genderImage} source={require('../../../assets/images/find_chat.png')}/>
            </View>
          </TouchableWithoutFeedback>
          <Text style={this.state.gender == '0' ? genderStyles.genderTextSel : genderStyles.genderText}>女</Text>
        </View>
      </View>
    )
  }
}

const genderStyles = StyleSheet.create({
  genderMainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  genderContainer: {
    flex: 1,
    alignItems: 'center',
  },
  genderBgSel: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.2,
  },
  genderImage: {
    resizeMode: 'cover'
  },
  genderTextSel: {
    marginTop: 16,
    fontSize: 14,
    color: '#ffffff',
    backgroundColor: 'transparent'
  },
  genderText: {
    marginTop: 16,
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.5,
    backgroundColor: 'transparent'
  }
})

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  console.log("inputData", inputData)
  let formData = getInputFormData(state, ownProps.formKey)
  console.log("formData", formData)
  return {
    data: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GenderInput)
