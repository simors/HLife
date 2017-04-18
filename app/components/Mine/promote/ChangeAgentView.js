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
import {getPromotersByArea} from '../../../action/promoterAction'
import {selectAreaPromoters, getPromoterById} from '../../../selector/promoterSelector'

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
        success: () => {
          this.isQuering = false
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
        <View style={{paddingLeft: normalizeW(15)}}>
          <Icon
            name='ios-arrow-back'
            style={styles.goBack}/>
        </View>
        <View style={styles.searchView}>
          <View style={{paddingLeft: normalizeW(10), paddingRight: normalizeW(10)}}>
            <Image style={{width: normalizeW(20), height: normalizeH(20)}} resizeMode='contain'
                   source={require('../../../assets/images/search.png')}/>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TextInput style={styles.searchInputStyle}
                       placeholder='输入昵称或手机号完成搜索'
                       underlineColorAndroid="transparent"
                       onChangeText={(text) => this.setState({searchText: text})}/>
          </View>
        </View>
        <View style={styles.searchBtn}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.searchBtnText}>搜索</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderRow(promoter, rowId) {
    this.maxShopEarnings = promoter.shopEarnings
    this.maxRoyaltyEarnings = promoter.royaltyEarnings
    this.lastTime = promoter.createdAt
    return (
      <AreaPromoterItem promoter={promoter}/>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {this.renderHeader()}
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={{backgroundColor: '#FFF'}}
            dataSource={this.props.dataSource}
            renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
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
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(20),
        height: normalizeH(64)
      },
      android: {
        height: normalizeH(44)
      }
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#B2B2B2',
  },
  body: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44),
      }
    }),
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