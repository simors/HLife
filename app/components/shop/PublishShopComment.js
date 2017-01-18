/**
 * Created by zachary on 2016/12/13.
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
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'

import {submitShopComment, fetchShopCommentList, fetchShopCommentTotalCount} from '../../action/shopAction'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class PublishShopComment extends Component {
  constructor(props) {
    super(props)

    this.replyInput = null
    
    this.state = {

    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentWillReceiveProps(nextProps) {

  }

  submitShopComment() {

  }

  rightComponent() {
    return (
      <View style={styles.commentBtnWrap}>
        <Text style={styles.commentBtn}>发表</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="发表评价"
          rightComponent={()=>{this.rightComponent()}}
          rightPress={()=>{this.submitShopComment()}}
        />
        <View style={styles.body}>

        </View>

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {


  return {

  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitShopComment,
  fetchShopCommentList,
  fetchShopCommentTotalCount,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishShopComment)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
    flex: 1,
  },
  commentBtnWrap: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: THEME.colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalizeBorder(),
    borderColor: THEME.colors.green,
    borderRadius: 5
  },
  commentBtn: {
    color: '#fff',
    fontSize: em(15)
  }

})