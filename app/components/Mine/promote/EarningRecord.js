/**
 * Created by yangyang on 2017/4/21.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ListView,
  Platform,
  Image,
  InteractionManager,
  StatusBar,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import THEME from '../../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import CommonListView from '../../common/CommonListView'
import {getPromoterDealRecords} from '../../../action/promoterAction'
import {selectEarnRecords} from '../../../selector/promoterSelector'
import {formatLeancloudTime} from '../../../util/numberUtils'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class EarningRecord extends Component {
  constructor(props) {
    super(props)
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

    InteractionManager.runAfterInteractions(()=>{
      this.props.getPromoterDealRecords({
        promoterId: this.props.promoterId,
        limit: 10,
        more: !isRefresh,
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

  renderRow(rowData) {
    let deal = rowData
    this.lastTime = deal.dealTime
    if (deal.dealType == 1) {
      return (
        <View style={styles.recordItemView}>
          <View style={styles.itemView}>
            <View>
              <Text style={styles.earnTitle}>提成收益</Text>
            </View>
            <View>
              <Text style={styles.earnValue}>+{deal.cost}</Text>
            </View>
          </View>
          <View style={[styles.itemView, {paddingTop: normalizeH(15)}]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image style={styles.iconStyle} resizeMode='contain'
                     source={require('../../../assets/images/member_commission.png')}/>
              <Text style={[styles.nameText, {paddingLeft: normalizeW(10)}]}>{deal.user.nickname}</Text>
            </View>
            <View>
              <Text style={styles.dateText}>{formatLeancloudTime(new Date(deal.dealTime), 'YYYY-MM-DD')}</Text>
            </View>
          </View>
        </View>
      )
    } else if (deal.dealType == 2) {
      return (
        <View style={styles.recordItemView}>
          <View style={styles.itemView}>
            <View>
              <Text style={styles.earnTitle}>推广店铺收益</Text>
            </View>
            <View>
              <Text style={styles.earnValue}>+{deal.cost}</Text>
            </View>
          </View>
          <View style={[styles.itemView, {paddingTop: normalizeH(15)}]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image style={styles.iconStyle} resizeMode='contain'
                     source={require('../../../assets/images/shop_commission.png')}/>
              <Text style={[styles.nameText, {paddingLeft: normalizeW(10)}]}>{deal.shop.shopName}</Text>
            </View>
            <View>
              <Text style={styles.dateText}>{formatLeancloudTime(new Date(deal.dealTime), 'YYYY-MM-DD')}</Text>
            </View>
          </View>
        </View>
      )
    } else {
      return <View/>
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<StatusBar barStyle="dark-content" />*/}
        <Header leftType="icon"
                leftIconName="ios-arrow-back"
                leftPress={()=> {
                  Actions.pop()
                }}
                title="收益记录"
        />
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={{backgroundColor: '#FFF'}}
            dataSource={this.props.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
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
  let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2,})
  let records = selectEarnRecords(state, ownProps.promoterId)
  console.log('records', records)

  return {
    dataSource: ds.cloneWithRows(records),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getPromoterDealRecords,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EarningRecord)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    width: PAGE_WIDTH,
    backgroundColor: '#FFF',
  },
  recordItemView: {
    height: normalizeH(83),
    justifyContent: 'center',
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  earnTitle: {
    fontSize: em(17),
    color: '#5a5a5a',
  },
  earnValue: {
    fontSize: em(17),
    fontWeight: 'bold',
    color: THEME.base.mainColor,
  },
  nameText: {
    fontSize: em(15),
    color: '#AAAAAA',
  },
  dateText: {
    fontSize: em(12),
    color: '#AAAAAA',
  },
  iconStyle: {
    width: normalizeW(16),
    height: normalizeH(16),
  }
})