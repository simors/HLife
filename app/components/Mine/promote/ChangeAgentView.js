/**
 * Created by yangyang on 2017/4/17.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  InteractionManager,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  TextInput,
  ListView,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../../constants/themes/theme1'
import Icon from 'react-native-vector-icons/Ionicons'
import CommonListView from '../../common/CommonListView'
import AreaPromoterItem from './AreaPromoterItem'
import {getPromotersByArea, setAreaAgent, getPromoterByNameOrId} from '../../../action/promoterAction'
import {selectAreaPromoters, getPromoterById} from '../../../selector/promoterSelector'
import * as Toast from '../../common/Toast'

class ChangeAgentView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
    }
    this.maxShopEarnings = 0
    this.maxRoyaltyEarnings = 0
    this.lastTime = undefined
  }

  componentWillMount() {
    this.refreshData()
  }

  searchPromoter() {
    if (this.state.searchText.length == 0) {
      this.refreshData()
    } else {
      this.props.getPromoterByNameOrId({
        keyword: this.state.searchText,
      })
    }
  }

  setAreaAgent(agent) {
    let upPromoter = this.props.upPromoter
    let payload = {
      promoterId: agent.id,
      identity: upPromoter.identity + 1, // 上级代理只能设置下级代理
      province: upPromoter.province,
      city: upPromoter.identity == 1 ? this.props.area : upPromoter.city,
      district: upPromoter.identity == 1 ? undefined : (upPromoter.identity == 2 ? this.props.area : upPromoter.district),
      success: () => {
        Actions.pop()
        Toast.show('代理设置成功！')
      },
      error: (message) => {
        Actions.pop()
        Toast.show(message)
      }
    }
    this.props.setAreaAgent(payload)
  }

  refreshData() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    if(this.isQuering) {
      return
    }
    this.isQuering = true

    InteractionManager.runAfterInteractions(() => {
      this.props.getPromotersByArea({
        more: !isRefresh,
        liveProvince: this.props.liveProvince,
        liveCity: this.props.liveCity,
        maxShopEarnings: !!isRefresh ? undefined : this.maxShopEarnings,
        maxRoyaltyEarngings: !!isRefresh ? undefined : this.maxRoyaltyEarnings,
        lastTime: !!isRefresh ? undefined : this.lastTime,
        success: (isEmpty) => {
          this.isQuering = false
          if(!this.listView) {
            return
          }
          this.listView.isLoadUp(!isEmpty)
        },
        error: (message) => {
          this.isQuering = false
        }
      })
    })
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={{paddingLeft: normalizeW(15)}} onPress={() => Actions.pop()}>
          <Icon
            name='ios-arrow-back'
            style={styles.goBack}/>
        </TouchableOpacity>
        <View style={styles.searchView}>
          <View style={{paddingLeft: normalizeW(10), paddingRight: normalizeW(10)}}>
            <Image style={{width: normalizeW(20), height: normalizeH(20)}} resizeMode='contain'
                   source={require('../../../assets/images/search.png')}/>
          </View>
          <TextInput style={styles.searchInputStyle}
                     placeholder='输入昵称或手机号搜索'
                     underlineColorAndroid="transparent"
                     onChangeText={(text) => this.setState({searchText: text})}/>
          </View>
        <View style={styles.searchBtn}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => {this.searchPromoter()}}>
            <Text style={styles.searchBtnText}>搜索</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderRow(promoter, sectionId, rowId) {
    this.maxShopEarnings = promoter.shopEarnings
    this.maxRoyaltyEarnings = promoter.royaltyEarnings
    this.lastTime = promoter.createdAt
    return (
      <AreaPromoterItem promoter={promoter} setAreaAgent={(agent) => this.setAreaAgent(agent)}/>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<StatusBar barStyle="dark-content" />*/}
        {this.renderHeader()}
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={{backgroundColor: '#FFF'}}
            dataSource={this.props.dataSource}
            renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, sectionId, rowId)}
            loadNewData={()=> {
              this.refreshData()
            }}
            loadMoreData={()=> {
              this.loadMoreData(false)
            }}
            ref={(listView) => this.listView = listView}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 != r2,
  })

  let promoters = []
  let promoterIds = selectAreaPromoters(state)
  promoterIds.forEach((promoterId) => {
    let promoter = getPromoterById(state, promoterId)
    promoters.push(promoter)
  })

  return {
    dataSource: ds.cloneWithRows(promoters),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getPromotersByArea,
  setAreaAgent,
  getPromoterByNameOrId,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChangeAgentView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: THEME.base.backgroundColor,
    paddingTop: normalizeH(20),
    height: normalizeH(64),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#B2B2B2',
  },
  body: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: normalizeH(64),
  },
  goBack: {
    fontSize: em(28),
    color: THEME.base.mainColor,
  },
  searchBtn: {
    width: normalizeW(50),
    height: normalizeH(30),
    backgroundColor: THEME.base.mainColor,
    borderRadius: 5,
    marginRight: normalizeW(15),
  },
  searchBtnText: {
    fontSize: em(15),
    color: '#FFF',
    alignSelf: 'center',
  },
  searchView: {
    borderWidth: 1,
    backgroundColor: 'rgba(170, 170, 170, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    width: normalizeW(267),
    height: normalizeH(30),
    borderRadius: 5,
    borderColor: '#F5F5F5',
  },
  searchInputStyle: {
    flex: 1,
    padding: 0,
  },
})