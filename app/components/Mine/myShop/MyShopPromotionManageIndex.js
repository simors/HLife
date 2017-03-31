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
  InteractionManager,
  TextInput
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import * as Communications from 'react-native-communications'
import SendIntentAndroid from 'react-native-send-intent'
import Header from '../../common/Header'
import ImageGroupViewer from '../../common/Input/ImageGroupViewer'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as Toast from '../../common/Toast'
import ScoreShow from '../../common/ScoreShow'
import ShopPromotionModule from '../../shop/ShopPromotionModule'

import {fetchShopPromotionMaxNum, fetchUserOwnedShopInfo, fetchShopFollowers, fetchShopFollowersTotalCount, fetchSimilarShopList, fetchShopDetail, fetchGuessYouLikeShopList, fetchShopAnnouncements, userIsFollowedShop, followShop, submitShopComment, fetchShopCommentList, fetchShopCommentTotalCount, userUpShop, userUnUpShop, fetchUserUpShopInfo} from '../../../action/shopAction'
import {followUser, unFollowUser, userIsFollowedTheUser, fetchUserFollowees} from '../../../action/authActions'
import {selectShopPromotionMaxNum, selectUserOwnedShopInfo, selectShopFollowers, selectShopFollowersTotalCount, selectSimilarShopList, selectShopDetail,selectShopList, selectGuessYouLikeShopList, selectLatestShopAnnouncemment, selectUserIsFollowShop, selectShopComments, selectShopCommentsTotalCount, selectUserIsUpedShop} from '../../../selector/shopSelector'
import * as authSelector from '../../../selector/authSelector'
import ImageGallery from '../../common/ImageGallery'
import {PERSONAL_CONVERSATION} from '../../../constants/messageActionTypes'
import * as numberUtils from '../../../util/numberUtils'
import Icon from 'react-native-vector-icons/Ionicons'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class MyShopPromotionManageIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.fetchUserOwnedShopInfo()
      this.props.fetchShopPromotionMaxNum()
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="活动管理"
          rightType="none"
        />
        <View style={styles.body}>


        </View>
      </View>
    )
  }


}

const mapStateToProps = (state, ownProps) => {
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  // console.log('userOwnedShopInfo====', userOwnedShopInfo)
  const isUserLogined = authSelector.isUserLogined(state)
  const shopPromotionMaxNum = selectShopPromotionMaxNum(state)
  // console.log('shopPromotionMaxNum===>>>', shopPromotionMaxNum)

  return {
    userOwnedShopInfo: userOwnedShopInfo,
    isUserLogined: isUserLogined,
    currentUser: authSelector.activeUserId(state),
    shopPromotionMaxNum: shopPromotionMaxNum,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserOwnedShopInfo,
  fetchShopPromotionMaxNum
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyShopPromotionManageIndex)

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

})