/**
 * Created by zachary on 2017/1/3.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'


import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Reply extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentWillReceiveProps(nextProps) {

  }

  reply() {
    if(this.props.onReplyClick) {
      this.props.onReplyClick(this.props.shopCommentId)
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity style={styles.commentReplyWrap} onPress={this.reply.bind(this)}>
          <Image source={require('../../../assets/images/comments_unselect.png')}/>
          <Text style={styles.reply}>回复</Text>
        </TouchableOpacity>
      </View>

    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Reply)

const styles = StyleSheet.create({
  commentReplyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reply: {
    marginLeft: 5,
    fontSize: em(12),
    color: '#8f8e94'
  },
})