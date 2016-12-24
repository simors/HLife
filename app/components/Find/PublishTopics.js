/**
 * Created by wuxingyu on 2016/12/21.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {getTopic} from '../../selector/configSelector'
import MultilineText from '../common/Input/MultilineText'
import ImageGroupInput from '../common/Input/ImageGroupInput'
import ModalBox from 'react-native-modalbox';
import {Actions} from 'react-native-router-flux'
import * as Toast from '../common/Toast'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let formKey = Symbol('multiForm')
const multiInput = {
  formKey: formKey,
  stateKey: Symbol('multiInput'),
  type: 'content'
}

const imageGroupInput = {
  formKey: formKey,
  stateKey: Symbol('imageGroupInput'),
  type: 'imgGroup'
}

class PublishTopics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDisabled: false,
      selectedTopic: undefined,
    };
  }

  submitSuccessCallback() {
    Toast.show('发布成功')
    Actions.pop()
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  onButtonPress = () => {
     this.props.publishTopicFormData({
       formKey: formKey,
       categoryId: this.state.selectedTopic.objectId,
       submitType: TOPIC_FORM_SUBMIT_TYPE.PUBLISH_TOPICS,
       success:this.submitSuccessCallback,
       error: this.submitErrorCallback
     })
  }

  componentDidMount() {
    if (this.props.topicId) {
      this.setState({selectedTopic: this.props.topicId});
    }
  }

  openModal() {
    this.refs.modal3.open();
  }

  closeModal(value) {
    this.setState({selectedTopic: value})
    this.refs.modal3.close();
  }

  renderTopicsSelected() {
    if (this.props.topics) {
      return (
        this.props.topics.map((value, key)=> {
          return (
            <View key={key} style={styles.modalTopicButtonStyle}>
              <TouchableOpacity style={styles.modalTopicStyle}
                                onPress={()=>this.closeModal(value)}>
                <Text style={styles.ModalTopicTextStyle}>
                  {value.title}
                </Text>
              </TouchableOpacity>
            </View>
          )
        })
      )
    }
  }

  renderSelectedTopic() {
    if (this.state.selectedTopic) {
      return (
        <View style={styles.selectedTopicStyle}>
          <Text style={styles.selectedTopicTextStyle}>
            {this.state.selectedTopic.title}
          </Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="发起话题"
          rightType="text"
          rightText="发布"
          rightPress={() => this.onButtonPress()}
        />

        <View style={styles.body}>

          <KeyboardAwareScrollView style={styles.scrollViewStyle}>
            <TouchableOpacity style={styles.toSelectContainer} onPress={this.openModal.bind(this)}>
              {this.renderSelectedTopic()}
              <Image style={styles.imageStyle} source={require("../../assets/images/unfold_topic@2x.png")}/>
            </TouchableOpacity>

            <MultilineText containerStyle={{height: normalizeH(232)}}
                           inputStyle={{height: normalizeH(232)}}
                           {...multiInput}/>

            <View style={{marginTop: 10}}>
              <ImageGroupInput {...imageGroupInput}
                               number={9}
                               imageLineCnt={4}/>
            </View>
          </KeyboardAwareScrollView>

          <ModalBox style={styles.modalStyle} entry='top' position="top" ref={"modal3"}>
            <KeyboardAwareScrollView style={styles.scrollViewStyle}>
              <Text style={styles.modalShowTopicsStyle}>选择一个主题</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
                {this.renderTopicsSelected()}
              </View>
            </KeyboardAwareScrollView>
          </ModalBox>

        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {

  const topics = getTopic(state, true)
  return {
    topics: topics
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  publishTopicFormData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishTopics)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  body: {
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
    height: PAGE_HEIGHT,
    width: PAGE_WIDTH
  },

  scrollViewStyle: {
    flex: 1,
    width: PAGE_WIDTH
  },

  //选择话题的对话框的样式
  toSelectContainer: {
    height: normalizeH(44),
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: "#E6E6E6"
  },
  selectedTopicStyle: {
    marginTop: normalizeH(5),
    marginLeft: normalizeW(12),
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#50e3c2',
    height: normalizeH(34),
    alignItems: 'flex-start',
    borderRadius: 100,
    borderColor: 'transparent',
  },
  selectedTopicTextStyle: {
    fontSize: em(15),
    color: "#ffffff",
    marginLeft: normalizeW(16),
    marginRight: normalizeW(16),
    marginTop: normalizeH(7),
    alignSelf: 'center',
  },
  imageStyle: {
    position: 'absolute',
    right: normalizeW(12),
    marginTop: normalizeH(10),
    width: normalizeW(24),
    height: normalizeH(24),
    alignSelf: 'flex-end',
  },


  //modal 所有子组件的样式
  modalStyle: {
    width: PAGE_WIDTH,
    backgroundColor: '#f2f2f2',
    height: normalizeH(250),
    alignItems: 'flex-start',
    ...Platform.select({
      ios: {
        top: normalizeH(65),
      },
      android: {
        top: normalizeH(45)
      }
    }),
  },
  modalTextStyle: {
    marginTop: normalizeH(17),
    marginBottom: normalizeH(18),
    alignSelf: 'center',
    color: "#4a4a4a",
    fontSize: em(12)
  },
  modalShowTopicsStyle: {
    marginTop: normalizeH(17),
    marginBottom: normalizeH(18),
    alignSelf: 'center',
    color: "#4a4a4a",
    fontSize: em(12)
  },
  modalTopicButtonStyle: {
    alignItems: 'flex-start',
    marginLeft: normalizeW(5),
    marginRight: normalizeW(5),
    marginBottom: normalizeH(20)
  },
  modalTopicStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E9E9E9',
    height: normalizeH(34),
    alignItems: 'flex-start',
    borderRadius: 100
  },
  ModalTopicTextStyle: {
    fontSize: em(15),
    color: "#4a4a4a",
    marginLeft: normalizeW(16),
    marginRight: normalizeW(16),
    marginTop: normalizeH(7),
    alignSelf: 'center',
  },

})