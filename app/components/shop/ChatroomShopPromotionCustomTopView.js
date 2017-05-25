/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  InteractionManager,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
  Modal,
  TextInput,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {BUY_GOODS} from '../../constants/appConfig'
import * as Toast from '../common/Toast'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class ChatroomShopPromotionCustomTopView extends Component {
	constructor(props) {
    super(props)
    this.state = {
      showPayModal: false,
      buyAmount: '1',
    }
  }

  onPaymentPress() {
    this.setState({showPayModal: false})
    let amount = this.state.buyAmount
    if (Math.floor(amount) != amount) {
      Toast.show('购买数量只能是整数')
      return
    }
    let item = this.props.shopPromotionInfo
    Actions.PAYMENT({
      title: '商家活动支付',
      price: item.promotingPrice * Number(amount),
      metadata: {
        'fromUser': this.props.userId,
        'toUser': item.targetShop.owner.id,
        'dealType': BUY_GOODS
      },
      subject: '购买汇邻优店商品费用',
      paySuccessJumpScene: 'BUY_GOODS_OK',
      paySuccessJumpSceneParams: {
      },
      payErrorJumpBack: true,
    })
  }

  openPaymentModal() {
    this.setState({showPayModal: true})
  }

  renderPaymentModal() {
    return (
      <View>
        <Modal
          visible={this.state.showPayModal}
          transparent={true}
          animationType='fade'
          onRequestClose={()=>{this.setState({showPayModal: false})}}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View style={{backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center'}}>
              <View style={{paddingBottom: normalizeH(20), paddingTop: normalizeH(20)}}>
                <Text style={{fontSize: em(20), color: '#5A5A5A', fontWeight: 'bold'}}>设置购买数量</Text>
              </View>
              <View style={{paddingBottom: normalizeH(15), flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontSize: em(17), color: THEME.base.mainColor, paddingRight: 8}}>数量：</Text>
                <TextInput
                  placeholder='输入数量'
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => this.setState({buyAmount: text})}
                  value={this.state.buyAmount}
                  keyboardType="numeric"
                  maxLength={6}
                  style={{
                    height: normalizeH(42),
                    fontSize: em(17),
                    textAlignVertical: 'center',
                    textAlign: 'right',
                    borderColor: '#0f0f0f',
                    width: normalizeW(80),
                    paddingRight: normalizeW(15),
                  }}
                />
                <Text style={{fontSize: em(17), color: '#5A5A5A', paddingLeft: 8}}>份</Text>
              </View>
              <View style={{width: PAGE_WIDTH-100, height: normalizeH(50), padding: 0, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderColor: '#F5F5F5'}}>
                <View style={{flex: 1, borderRightWidth: 1, borderColor: '#F5F5F5'}}>
                  <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => this.setState({showPayModal: false})}>
                    <Text style={{fontSize: em(17), color: '#5A5A5A'}}>取消</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => this.onPaymentPress()}>
                    <Text style={{fontSize: em(17), color: THEME.base.mainColor}}>确定</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  render() {
  	const item = this.props.shopPromotionInfo

  	return (
  		<TouchableOpacity style={styles.container} onPress={() => {Actions.pop()}}>
	      <View style={styles.saleItemView}>
	        <View style={styles.saleItemInnerView}>
	          <View style={styles.saleImg}>
	            <Image style={{flex: 1}}
	                   source={{uri: item.coverUrl}}/>
	          </View>
	          <View style={styles.saleContent}>
	            <View>
	              <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
	            </View>
	            {this.props.noDistance
	              ? <View style={styles.addressTextView}>
	                  <View style={{flex:1}}>
	                    <Text style={[styles.itemText, styles.abstractTxt, {fontSize:em(14)}]} numberOfLines={1}>{item.abstract}</Text>
	                  </View>
	                </View>
	              : <View style={styles.addressTextView}> 
	                   <View style={{flex:1}}>
	                     <Text style={[styles.itemText, styles.abstractTxt]} numberOfLines={1}>{item.abstract}</Text>
	                   </View>
	                   <View style={styles.distanceBox}>
	                    <Text style={[styles.itemText, styles.distanceTxt]}>{item.targetShop.distance + item.targetShop.distanceUnit}</Text>
	                   </View>  
	                </View>
	            }
	            <View style={styles.saleAbstract}>
	              <View style={styles.saleLabel}>
	                <Text style={styles.saleLabelText}>{item.type}</Text>
	              </View>
	              <View style={{marginLeft: normalizeW(10)}}>
	                <Text style={styles.itemText} numberOfLines={1}>{item.typeDesc}</Text>
	              </View>
	            </View>
	            <View style={styles.priceView}>
	              <View style={{flexDirection: 'row', alignItems: 'center'}}>
	                <Text style={styles.priceText}>¥</Text>
	                <Text style={[styles.priceText, {marginLeft: normalizeW(5)}]}>{item.promotingPrice}</Text>
	                {item.originalPrice 
	                  ? <Text style={[styles.itemText, {marginLeft: normalizeW(5), textDecorationLine: 'line-through'}]}>
	                      原价 {item.originalPrice}
	                    </Text>
	                  : null
	                }
	              </View>
	              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View>
                    {item.pv
                      ? <Text style={styles.itemText}>{item.pv}人看过</Text>
                      : null
                    }
                  </View>
                  <View>
                    <TouchableOpacity style={styles.payBtn} onPress={() => this.openPaymentModal()}>
                      <Text style={{fontSize: em(15), color: '#FFF'}}>去支付</Text>
                    </TouchableOpacity>
                  </View>
	              </View>
	            </View>
	          </View>
	        </View>
	      </View>

        {this.renderPaymentModal()}
	    </TouchableOpacity>
  	)
  	
  }

}

const styles = StyleSheet.create({
	container: {
    // position: 'absolute',
    // left: 0,
    // top: 0,
		height: normalizeH(135),
		paddingTop: 15,
		backgroundColor:'#f5f5f5',
		width:PAGE_WIDTH,
		marginBottom:8
	},
	saleItemView: {
		flex:1,
  },
  saleItemInnerView: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
  },
  saleImg: {
    width: normalizeW(100),
    height: normalizeH(100),
    paddingLeft: normalizeW(5),
    paddingRight: normalizeW(5),
  },
  saleContent: {
    flex: 1,
    marginLeft: normalizeW(15),
    marginRight: normalizeW(5),
  },
  itemTitle: {
    fontSize: em(17),
    fontWeight: 'bold',
    color: '#5A5A5A',
  },
  itemText: {
    fontSize: em(12),
    color: '#AAAAAA',
  },
  abstractTxt: {
    lineHeight: em(18),
  },
  distanceBox: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft:8,
  },
  distanceTxt: {

  },
  addressTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalizeH(10),
  },
  saleAbstract: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalizeH(17),
  },
  saleLabel: {
    backgroundColor: THEME.base.lightColor,
    borderRadius: 2,
    padding: 2,
  },
  saleLabelText: {
    color: 'white',
    fontSize: em(12),
    fontWeight: 'bold',
  },
  priceView: {
    flexDirection: 'row',
    marginTop: normalizeH(7),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: em(15),
    fontWeight: 'bold',
    color: '#00BE96',
  },
  payBtn: {
    backgroundColor: THEME.base.mainColor,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
})