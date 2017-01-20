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
  TouchableHighlight,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'

import Checkbox from './Checkbox'

const PropTypes = React.PropTypes
const PAGE_WIDTH=Dimensions.get('window').width

class TagsInput extends Component {

  static defaultProps = {
    placeholder: '点击选择标签'
  }

  constructor(props) {
    super(props)

    this.state = {
      containerWidth: 0,
      scrollViewContentWidth: 0,
      emptyWidth: 0,
      emptyHeight: 0,
      isEmptyChange: false,
      tagsLength: 0
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

  componentWillReceiveProps(nextProps) {
    if(nextProps.tags && this.state.tagsLength != nextProps.tags.length) {
      this.setState({
        tagsLength: nextProps.tags.length,
        isEmptyChange: false
      })

      let tagIds = []
      nextProps.tags.forEach((tag)=>{
        tagIds.push(tag.id)
      })
      this.inputChange(tagIds)
    }
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

  renderContent() {
    if(this.props.tags && this.props.tags.length) {
      let tagsView = this.props.tags.map((item, index) => {
        return (
          <View key={'tag_' + index} style={[styles.tagContainer, this.props.tagContainerStyle]}>
            <Text numberOfLines={1} style={[styles.tagText, this.props.tagTextStyle]}>{item.name}</Text>
          </View>
        )
      })
      return tagsView
    }else {
      return (
        <Text style={[styles.placeholder, this.props.placeholderStyle]}>{this.props.placeholder}</Text>
      )
    }
  }

  onLayout(event) {
    // console.log('onLayout.event.nativeEvent.layout.width===', event.nativeEvent.layout.width)
    // console.log('event.nativeEvent.layout.height===', event.nativeEvent.layout.height)
    if(event.nativeEvent.layout.width) {
      this.setState({
        containerWidth: event.nativeEvent.layout.width - 14,
        emptyHeight: event.nativeEvent.layout.height,
      }, ()=>{
        if(!this.state.isEmptyChange) {
          this.calEmptySize()
        }
      })
    }
  }

  onContentSizeChange(contentWidth, contentHeight) {
    // console.log('contentWidth===', contentWidth)
    // console.log('this.state.emptyWidth===', this.state.emptyWidth)
    // console.log('contentHeight===', contentHeight)
    this.setState({
      scrollViewContentWidth: contentWidth - this.state.emptyWidth
    }, ()=>{
      // console.log('this.state.isEmptyChange====', this.state.isEmptyChange)
      if(!this.state.isEmptyChange) {
        this.calEmptySize()
      }
    })
  }

  calEmptySize() {
    // console.log('this.state.scrollViewContentWidth===', this.state.scrollViewContentWidth)
    // console.log('this.state.containerWidth===', this.state.containerWidth)
    if(this.state.containerWidth) {
      if(this.state.scrollViewContentWidth >= this.state.containerWidth) {
        this.setState({
          emptyWidth: 0,
          isEmptyChange: true,
        })
      }else {
        this.setState({
          emptyWidth: this.state.containerWidth - this.state.scrollViewContentWidth,
          isEmptyChange: true,
        })
      }
    }
  }

  render() {
    return (
      <View
        onLayout={this.onLayout.bind(this)}
        style={[styles.container, this.props.containerStyle]}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={this.onContentSizeChange.bind(this)}
          style={styles.scrollView}
          contentContainerStyle={[styles.contentContainerStyle, this.props.contentContainerStyle]}
        >
          <TouchableWithoutFeedback style={{flex: 1,justifyContent: 'center',alignItems: 'center'}} onPress={()=>{this.props.onPress()}}>
            <View style={styles.scrollViewContentContainer}>
              {this.renderContent()}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback style={{flex: 1}} onPress={()=>{this.props.onPress()}}>
            <View style={[styles.emptyView, {width: this.state.emptyWidth, height: this.state.emptyHeight}]}/>
          </TouchableWithoutFeedback>
        </ScrollView>

      </View>
    )
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(TagsInput)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    overflow: 'hidden',
    marginRight: 10,
    height: 40
  },
  scrollView: {
    flex: 1,
    height: 40
  },
  contentContainerStyle: {
    flex: 1,
    alignItems: 'center',
  },
  scrollViewContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },
  emptyView: {
    flex: 1,
  },
  placeholder: {
    color: '#b2b2b2',
    fontSize: em(16),
  },
  tagContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 5,
  },
  tagText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: em(17)
  },
  tagMore: {

  }
})