/**
 * Created by zachary on 2017/01/10.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableHighlight
} from 'react-native'
import { FormInput } from 'react-native-elements'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'

const PropTypes = React.PropTypes
const PAGE_WIDTH=Dimensions.get('window').width
const CB_ENABLED_IMAGE = require('../../../assets/images/cb_enabled.png');
const CB_DISABLED_IMAGE = require('../../../assets/images/cb_disabled.png');

class Checkbox extends Component {

  constructor(props) {
    super(props)

    this.state = {
      internalChecked: props.checked
    };

    this.onChange = this.onChange.bind(this);
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
    if (data && data.text && data.text.length > 0) {
      return {isVal: true, errMsg: '验证通过'}
    }
    return {isVal: false, errMsg: '输入有误'}
  }

  inputChange(text) {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text}
    }
    this.props.inputFormUpdate(inputForm)
  }

  onChange() {
    let internalChecked = this.state.internalChecked

    if(this.props.onChange){
      this.props.onChange(internalChecked)
    }
    this.setState({
      internalChecked: !internalChecked
    })

    if(this.props.checkedValue) {
      if(internalChecked) {
        this.inputChange(this.props.checkedValue)
      }else {
        this.inputChange('')
      }
    }else {
      this.inputChange(!internalChecked)
    }
  }

  render() {
    let container
    let source

    source = this.state.internalChecked ? this.props.checkedImage : this.props.uncheckedImage

    let onlyLabelCheckedContainer
    let onlyLabelCheckedStyle
    if(this.state.internalChecked) {
      onlyLabelCheckedContainer = {
        borderColor: THEME.colors.green,
          ...this.props.onlyLabelCheckedContainerStyle
      }
      onlyLabelCheckedStyle = {
        color: THEME.colors.green,
        ...this.props.onlyLabelCheckedStyle
      }
    }

    if(this.props.onlyLabel) {
      container = (
        <View style={[styles.container, this.props.containerStyle]}>
          <View style={[styles.labelContainer, styles.onlyLabelContainer, this.props.labelContainer, onlyLabelCheckedContainer]}>
            <Text numberOfLines={this.props.labelLines} style={[styles.label, this.props.labelStyle, onlyLabelCheckedStyle]}>{this.props.label}</Text>
          </View>
        </View>
      )
    }else {
      if (this.props.labelBefore) {
        container = (
          <View style={this.props.containerStyle || [styles.container, styles.flexContainer]}>
            <View style={styles.labelContainer}>
              <Text numberOfLines={this.props.labelLines} style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
            </View>
            <Image
              style={[styles.checkbox, this.props.checkboxStyle]}
              source={source}/>
          </View>
        )
      } else {
        container = (
          <View style={[styles.container, this.props.containerStyle]}>
            <Image
              style={[styles.checkbox, this.props.checkboxStyle]}
              source={source}/>
            <View style={styles.labelContainer}>
              <Text numberOfLines={this.props.labelLines} style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
            </View>
          </View>
        )
      }
    }

    return (
      <TouchableHighlight onPress={this.onChange} underlayColor={this.props.underlayColor} style={styles.flexContainer}>
        {container}
      </TouchableHighlight>
    )
  }
}

Checkbox.propTypes = {
  label: PropTypes.string,
  labelBefore: PropTypes.bool,
  labelStyle: PropTypes.oneOfType([PropTypes.array,PropTypes.object,PropTypes.number]),
  labelLines: PropTypes.number,
  checkboxStyle: PropTypes.oneOfType([PropTypes.array,PropTypes.object,PropTypes.number]),
  containerStyle: PropTypes.oneOfType([PropTypes.array,PropTypes.object,PropTypes.number]),
  checked: PropTypes.bool,
  checkedImage: PropTypes.number,
  uncheckedImage: PropTypes.number,
  underlayColor: PropTypes.string,
  onChange: PropTypes.func
}

Checkbox.defaultProps = {
  label: 'Label',
  labelLines: 1,
  labelBefore: false,
  checked: false,
  initValue: false,
  checkedImage: CB_ENABLED_IMAGE,
  uncheckedImage: CB_DISABLED_IMAGE,
  underlayColor: 'white'
}

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  return {
    data: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Checkbox)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    width: 26,
    height: 26
  },
  onlyLabelContainer: {
    padding: 5,
    borderWidth: normalizeBorder(),
    borderColor: '#bdc6cf',
    borderRadius: 20,
  },
  labelContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  label: {
    fontSize: em(15),
    color: 'grey'
  }
})