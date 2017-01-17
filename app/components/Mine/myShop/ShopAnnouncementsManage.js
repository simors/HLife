/**
 * Created by zachary on 2017/1/13.
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
import Header from '../../common/Header'
import Icon from 'react-native-vector-icons/Ionicons'
import CommonListView from '../../common/CommonListView'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as Toast from '../../common/Toast'
import Symbol from 'es6-symbol'
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {fetchShopAnnouncements, deleteShopAnnouncement} from '../../../action/shopAction'
import {selectShopAnnouncements, } from '../../../selector/shopSelector'
import ActionSheet from 'react-native-actionsheet'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')

const shopCoverInput = {
  formKey: commonForm,
  stateKey: Symbol('shopCoverInput'),
  type: "shopCoverInput",
}

let ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

class ShopAnnouncementsManage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hideFooter: this.props.hideFooter,
      deleting: false,
      shopAnnouncementList: props.shopAnnouncementList,
      ds: ds.cloneWithRows(props.shopAnnouncementList)
    }

    this.deletingShopAnnouncementId = ''
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      //this.refreshData()
    })
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    // console.log('this.props.hideFooter===', this.props.hideFooter)
    // console.log('nextProps.hideFooter===', nextProps.hideFooter)
    if(this.props.hideFooter != nextProps.hideFooter) {
      this.setState({
        hideFooter: nextProps.hideFooter
      })
    }

    this.setState({
      shopAnnouncementList: nextProps.shopAnnouncementList,
      ds: ds.cloneWithRows(nextProps.shopAnnouncementList)
    })
  }

  refreshData() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    if(this.state.deleting) {
      return
    }
    let payload = {
      id: this.props.id,
      lastCreatedAt: this.props.lastCreatedAt,
      lastUpdatedAt: this.props.lastUpdatedAt,
      isRefresh: !!isRefresh,
      success: (isEmpty) => {
        if(!this.listView) {
          return
        }
        if(isEmpty) {
          this.listView.isLoadUp(false)
        }else {
          this.listView.isLoadUp(true)
        }
      },
      error: (err)=>{
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.fetchShopAnnouncements(payload)
  }

  editAnnouncement(shopAnnouncement) {
    if(this.state.deleting) {
      this.deletingShopAnnouncementId = shopAnnouncement.id
      this.ActionSheet.show()

    }else {
      Actions.PUBLISH_SHOP_ANNOUNCEMENT({
        id: this.props.id,
        shopAnnouncementId: shopAnnouncement.id,
        shopAnnouncementContent: shopAnnouncement.content,
        shopAnnouncementCover: shopAnnouncement.coverUrl,

      })
    }
  }

  toggleDeleteState() {
    this.setState({
      deleting: !this.state.deleting
    }, ()=>{
      if(this.state.shopAnnouncementList && this.state.shopAnnouncementList.length) {
        let newShopAnnouncementList = []
        this.state.shopAnnouncementList.forEach((item)=>{
          item.deleting = this.state.deleting
          newShopAnnouncementList.push(item)
        })
        this.setState({
          ds: ds.cloneWithRows(newShopAnnouncementList)
        })
      }
    })
  }

  _handleActionSheetPress(index) {
    if(0 == index) { //确认删除
      this.props.deleteShopAnnouncement({
        shopAnnouncementId: this.deletingShopAnnouncementId,
        success: ()=>{
          this.setState({
            deleting: false
          }, ()=>{
            this.refreshData()
          })
        },
        error: (err)=>{
          Toast.show(err.message, {duration: 1000})
        }
      })
    }
  }

  renderRow(rowData, rowId) {
    return (
      <TouchableOpacity key={"announcement_" + rowId} onPress={()=>{this.editAnnouncement(rowData)}}>
        <View style={styles.shopAnnouncementWrap}>
          <View style={styles.shopAnnouncementContainer}>
            <View style={styles.shopAnnouncementCoverWrap}>
              <Image style={styles.shopAnnouncementCover} source={{uri: rowData.coverUrl}}/>
            </View>
            <View style={styles.shopAnnouncementCnt}>
              <View style={styles.shopAnnouncementTitleWrap}>
                <Text numberOfLines={3} style={styles.shopAnnouncementTitle}>
                  {rowData.content}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.shopAnnouncementDateWrap}>
            <Image style={styles.shopAnnouncementDateIcon} source={require('../../../assets/images/notice_date.png')}>
              <Text style={styles.shopAnnouncementDateDay}>{rowData.createdDay}</Text>
              <Text style={styles.shopAnnouncementDateMonth}>{rowData.createdMonth+1}</Text>
            </Image>
          </View>
        </View>
        {rowData.deleting &&
          <View style={styles.deleteIconWrap}>
            <Image source={require('../../../assets/images/delete_picture_shop.png')}/>
          </View>
        }
      </TouchableOpacity>
    )
  }

  render() {

    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          leftStyle={styles.headerLeftStyle}
          headerContainerStyle={styles.headerContainerStyle}
          title="店铺公告管理"
          titleStyle={styles.headerTitleStyle}
          rightType="image"
          rightImageSource={require('../../../assets/images/notice_delete.png')}
          rightPress={()=>{this.toggleDeleteState()}}
          rightStyle={styles.headerRightStyle}
        />
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={{backgroundColor: 'rgba(0,0,0,0.05)'}}
            dataSource={this.state.ds}
            renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
            loadNewData={()=>{this.refreshData()}}
            loadMoreData={()=>{this.loadMoreData()}}
            ref={(listView) => this.listView = listView}
            hideFooter={this.state.hideFooter}
          />

          <TouchableOpacity onPress={()=>{Actions.PUBLISH_SHOP_ANNOUNCEMENT({id: this.props.id})}}>
            <View style={styles.noticePublishWrap}>
              <Image style={styles.noticePublishIcon} source={require('../../../assets/images/notice_publish.png')}/>
              <Text style={styles.noticePublishTxt}>发布新公告</Text>
            </View>
          </TouchableOpacity>

          <ActionSheet
            ref={(o) => this.ActionSheet = o}
            title="删除公告"
            options={['确认删除', '取消']}
            destructiveButtonIndex={0}
            cancelButtonIndex={1}
            onPress={this._handleActionSheetPress.bind(this)}
          />

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = undefined
  if(ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }

  let shopAnnouncementList = selectShopAnnouncements(state, ownProps.id)

  let lastCreatedAt = ''
  let lastUpdatedAt = ''
  let hideFooter = false
  if(shopAnnouncementList && shopAnnouncementList.length) {
    lastCreatedAt = shopAnnouncementList[shopAnnouncementList.length-1].createdAt
    lastUpdatedAt = shopAnnouncementList[shopAnnouncementList.length-1].updatedAt
    if(shopAnnouncementList.length < 4) {
      hideFooter = true
    }
  }else {
    hideFooter = true
  }

  return {
    ds: ds.cloneWithRows(shopAnnouncementList),
    shopAnnouncementList: shopAnnouncementList,
    lastCreatedAt: lastCreatedAt,
    lastUpdatedAt: lastUpdatedAt,
    hideFooter: hideFooter,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitInputData,
  fetchShopAnnouncements,
  deleteShopAnnouncement
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopAnnouncementsManage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green,
    ...Platform.select({
      ios: {
        paddingTop: 20,
        height: 64
      },
      android: {
        height: 44
      }
    }),
  },
  headerLeftStyle: {
    color: '#fff',
  },
  headerTitleStyle: {
    color: '#fff',
  },
  headerRightStyle: {

  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 44
      }
    }),
    flex: 1,
  },
  shopAnnouncementWrap: {
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  shopAnnouncementContainer: {
    flexDirection: 'row',
    marginTop: normalizeH(10),
    padding: 10,
    backgroundColor: '#fff'
  },
  shopAnnouncementCoverWrap: {
    borderWidth: normalizeBorder(),
    borderColor: THEME.colors.lighterA,
    marginRight: normalizeW(15),
  },
  shopAnnouncementCover: {
    width:84,
    height: 84
  },
  shopAnnouncementCnt: {
    flex: 1,
    justifyContent: 'center'
  },
  shopAnnouncementTitleWrap: {
    marginTop: normalizeH(10)
  },
  shopAnnouncementTitle: {
    fontSize: em(17),
    color: '#8f8e94'
  },
  shopAnnouncementSubTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  shopAnnouncementIcon: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  shopAnnouncementSubTxt: {
    marginRight: normalizeW(22),
    fontSize: em(12),
    color: '#8f8e94'
  },
  shopAnnouncementBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  shopAnnouncementBadgeIcon: {
    width: normalizeW(65),
    height: normalizeH(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  shopAnnouncementBadgeTxt: {
    fontSize: em(12),
    color: '#fff'
  },
  noShopAnnouncementWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    height: normalizeH(110),
    backgroundColor: '#fff',
  },
  noShopAnnouncementTxt: {
    color: '#b2b2b2',
    fontSize: em(15),
  },
  shopAnnouncementDateWrap: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
  shopAnnouncementDateIcon: {
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: normalizeW(32),
    height: normalizeH(42),
  },
  shopAnnouncementDateDay: {
    color: '#fff',
    fontSize: em(17)
  },
  shopAnnouncementDateMonth: {
    color: '#fff',
    fontSize: em(10),
  },
  noticePublishWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    backgroundColor: THEME.colors.green,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noticePublishIcon: {
    marginRight: normalizeW(12)
  },
  noticePublishTxt: {
    color: '#fff',
    fontSize: em(17)
  },
  deleteIconWrap: {
    position: 'absolute',
    top: 10,
    left: PAGE_WIDTH / 2,
  },
  deleteIcon: {
    fontSize: 32,
  }

})