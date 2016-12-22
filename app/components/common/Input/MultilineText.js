/**
 * Created by yangyang on 2016/12/22.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

const PAGE_WIDTH = Dimensions.get('window').width

class MultilineText extends Component {
  constructor(props) {
    super(props)
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
    if (data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '输入不能为空'}
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
      <View style={[styles.container, this.props.containerStyle]}>
        <TextInput
          style={[styles.defaultInputStyle, this.props.inputStyle]}
          editable={this.props.editable}
          multiline={true}
          placeholder={this.props.placeholder}
          placeholderTextColor="#BABABA"
          value={this.props.data}
          onChangeText={(text) => this.inputChange(text)}
        />
      </View>
    )
  }
}

MultilineText.defaultProps = {
  editable: true,
  placeholder: '输入文字...'
}

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  return {
    data: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MultilineText)

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  defaultInputStyle: {
    width: PAGE_WIDTH,
    minHeight: 200,
    fontSize: em(17),
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E6E6E6'
  }
})