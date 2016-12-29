/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { FormInput } from 'react-native-elements'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

const PAGE_WIDTH=Dimensions.get('window').width

class ScoreInput extends Component {

  constructor(props) {
    super(props)
    this.state = {
      scoreArr : [false, false, false, false, false]
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
    return {isVal: true, errMsg: '验证通过'}
  }

  scoring(score) {

    let arr = []
    for(let i = 0; i < 5; i++) {
      if(i < score) {
        arr.push(true)
      }else {
        arr.push(false)
      }
    }
    this.setState({
      scoreArr: arr
    })

    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text: score}
    }
    this.props.inputFormUpdate(inputForm)
  }

  renderScoreView() {
    return this.state.scoreArr.map((scored, index)=>{
      if(scored) {
        return (
          <TouchableWithoutFeedback key={"score_" + index} style={{}} onPress={()=>{this.scoring(index+1)}}>
            <Image style={styles.scoreImage} source={require('../../../assets/images/star_one.png')}/>
          </TouchableWithoutFeedback>
        )
      }
      return (
        <TouchableWithoutFeedback key={"score_" + index} style={{}} onPress={()=>{this.scoring(index+1)}}>
          <Image style={styles.scoreImage} source={require('../../../assets/images/star_gray.png')}/>
        </TouchableWithoutFeedback>
      )
    })
  }

  render() {
    return (
      <View style={[styles.container]}>
        {this.renderScoreView()}
      </View>
    )
  }
}

ScoreInput.defaultProps = {

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

export default connect(mapStateToProps, mapDispatchToProps)(ScoreInput)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  scoreImage: {
    width: 20,
    height:20,
    marginRight:10
  },
})