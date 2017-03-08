/**
 * Created by yangyang on 2017/3/7.
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
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class NearbySalesView extends Component {
  constructor(props) {
    super(props)
  }

  renderSaleItems() {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity style={{flex: 1}} onPress={() => {}}>
          <View style={styles.saleItemView}>
            <View style={styles.saleImg}>
              <Image style={{flex: 1}}
                     source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1489481135&di=7bcc5e7b131b9079a769df2eabc23eca&imgtype=jpg&er=1&src=http%3A%2F%2Fm.360buyimg.com%2Fn6%2Fjfs%2Ft2731%2F260%2F2600069887%2F481379%2Fde020626%2F576df6c1Nce091bb5.jpg'}}/>
            </View>
            <View style={styles.saleContent}>
              <View>
                <Text style={styles.itemTitle} numberOfLines={1}>正宗永州冰糖橙</Text>
              </View>
              <View style={styles.addressTextView}>
                <View style={{flexDirection: 'row', width: 180}}>
                  <Text style={[styles.itemText, {maxWidth: 90}]} numberOfLines={1}>绿叶水果</Text>
                  <Text style={styles.itemText}> | </Text>
                  <Text style={[styles.itemText, {maxWidth: 80}]} numberOfLines={1}>润和紫郡</Text>
                </View>
                <View>
                  <Text style={styles.itemText}>1.5km</Text>
                </View>
              </View>
              <View style={styles.saleAbstract}>
                <View style={styles.saleLabel}>
                  <Text style={styles.saleLabelText}>预售</Text>
                </View>
                <View style={{marginLeft: normalizeW(10)}}>
                  <Text style={styles.itemText} numberOfLines={1}>3月6号开售</Text>
                </View>
              </View>
              <View style={styles.priceView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.priceText}>¥</Text>
                  <Text style={[styles.priceText, {marginLeft: normalizeW(5)}]}>6.0 / 千克</Text>
                  <Text style={[styles.itemText, {marginLeft: normalizeW(5)}]}>(原价 8.0)</Text>
                </View>
                <View>
                  <Text style={styles.itemText}>99+看过</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1}} onPress={() => {}}>
          <View style={styles.saleItemView}>
            <View style={styles.saleImg}>
              <Image style={{flex: 1}}
                     source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488893634400&di=13fe39fbb85d7eb950d39407c2f44c78&imgtype=0&src=http%3A%2F%2Fi5.xiachufang.com%2Fimage%2F600%2F430993c8448111e59cbdb8ca3aeed2d7.jpg'}}/>
            </View>
            <View style={styles.saleContent}>
              <View>
                <Text style={styles.itemTitle} numberOfLines={1}>轰动手感延烧乳酪</Text>
              </View>
              <View style={styles.addressTextView}>
                <View style={{flexDirection: 'row', width: 180}}>
                  <Text style={[styles.itemText, {maxWidth: 90}]} numberOfLines={1}>罗莎蛋糕</Text>
                  <Text style={styles.itemText}> | </Text>
                  <Text style={[styles.itemText, {maxWidth: 80}]} numberOfLines={1}>润和紫郡</Text>
                </View>
                <View>
                  <Text style={styles.itemText}>1.5km</Text>
                </View>
              </View>
              <View style={styles.saleAbstract}>
                <View style={styles.saleLabel}>
                  <Text style={styles.saleLabelText}>限时购</Text>
                </View>
                <View style={{marginLeft: normalizeW(10)}}>
                  <Text style={styles.itemText} numberOfLines={1}>每天18：00-24：00</Text>
                </View>
              </View>
              <View style={styles.priceView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.priceText}>¥</Text>
                  <Text style={[styles.priceText, {marginLeft: normalizeW(5)}]}>16.0</Text>
                  <Text style={[styles.itemText, {marginLeft: normalizeW(5)}]}>(原价 18)</Text>
                </View>
                <View>
                  <Text style={styles.itemText}>99+看过</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1}} onPress={() => {}}>
          <View style={styles.saleItemView}>
            <View style={styles.saleImg}>
              <Image style={{flex: 1}}
                     source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488893892667&di=3bda75c538fa405a5a6dc876c30f96c3&imgtype=0&src=http%3A%2F%2Fimg.daimg.com%2Fuploads%2Fallimg%2F130920%2F3-130920223914.jpg'}}/>
            </View>
            <View style={styles.saleContent}>
              <View>
                <Text style={styles.itemTitle} numberOfLines={1}>单人瑜伽季卡</Text>
              </View>
              <View style={styles.addressTextView}>
                <View style={{flexDirection: 'row', width: 180}}>
                  <Text style={[styles.itemText, {maxWidth: 90}]} numberOfLines={1}>安好瑜伽</Text>
                  <Text style={styles.itemText}> | </Text>
                  <Text style={[styles.itemText, {maxWidth: 80}]} numberOfLines={1}>润和紫郡</Text>
                </View>
                <View>
                  <Text style={styles.itemText}>1.5km</Text>
                </View>
              </View>
              <View style={styles.saleAbstract}>
                <View style={styles.saleLabel}>
                  <Text style={styles.saleLabelText}>折扣</Text>
                </View>
                <View style={{marginLeft: normalizeW(10)}}>
                  <Text style={styles.itemText} numberOfLines={1}>店庆月，3月15号截止</Text>
                </View>
              </View>
              <View style={styles.priceView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.priceText}>¥</Text>
                  <Text style={[styles.priceText, {marginLeft: normalizeW(5)}]}>198 / 人</Text>
                  <Text style={[styles.itemText, {marginLeft: normalizeW(5)}]}>(原价 288)</Text>
                </View>
                <View>
                  <Text style={styles.itemText}>99+看过</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1}} onPress={() => {}}>
          <View style={styles.saleItemView}>
            <View style={styles.saleImg}>
              <Image style={{flex: 1}}
                     source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488893694795&di=7e5ba6de121c02e9a163feec9686e99b&imgtype=0&src=http%3A%2F%2Fnews.winshang.com%2Fmember%2FFCK%2F2015%2F3%2F16%2F2015316111757221400x.jpg'}}/>
            </View>
            <View style={styles.saleContent}>
              <View>
                <Text style={styles.itemTitle} numberOfLines={1}>绿色水果蔬菜</Text>
              </View>
              <View style={styles.addressTextView}>
                <View style={{flexDirection: 'row', width: 180}}>
                  <Text style={[styles.itemText, {maxWidth: 90}]} numberOfLines={1}>绿洲超市</Text>
                  <Text style={styles.itemText}> | </Text>
                  <Text style={[styles.itemText, {maxWidth: 80}]} numberOfLines={1}>润和紫郡</Text>
                </View>
                <View>
                  <Text style={styles.itemText}>1.5km</Text>
                </View>
              </View>
              <View style={styles.saleAbstract}>
                <View style={styles.saleLabel}>
                  <Text style={styles.saleLabelText}>限时购</Text>
                </View>
                <View style={{marginLeft: normalizeW(10)}}>
                  <Text style={styles.itemText}>每天18：00-24：00</Text>
                </View>
              </View>
              <View style={styles.priceView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.priceText}>¥</Text>
                  <Text style={[styles.priceText, {marginLeft: normalizeW(5)}]}>全场8.5折</Text>
                  <Text style={[styles.itemText, {marginLeft: normalizeW(5)}]}></Text>
                </View>
                <View>
                  <Text style={styles.itemText}>99+看过</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <View style={styles.headerItem}>
            <Image source={require('../../assets/images/activity.png')} width={12} height={14}></Image>
            <Text style={styles.headerText} numberOfLines={1}>附近促销</Text>
          </View>
        </View>
        <View style={styles.contentItem}>
          {this.renderSaleItems()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NearbySalesView)

const styles = StyleSheet.create({
  container: {
    width: PAGE_WIDTH,
    justifyContent: 'center',
    backgroundColor: THEME.base.backgroundColor,
  },
  headerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalizeH(42),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    marginLeft: normalizeW(18),
    marginRight: normalizeW(18),
  },
  headerItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: normalizeH(10),
  },
  headerText: {
    fontSize: 12,
    color: '#5A5A5A',
    lineHeight: 12,
    paddingLeft: 5,
  },
  contentItem: {
    flex: 1,
    marginLeft: normalizeW(18),
    marginRight: normalizeW(18),
  },
  saleItemView: {
    flex: 1,
    flexDirection: 'row',
    height: normalizeH(130),
    paddingTop: normalizeH(19),
    paddingBottom: normalizeH(15),
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
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
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5A5A5A',
  },
  itemText: {
    fontSize: 12,
    color: '#AAAAAA',
    lineHeight: 12,
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
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 12,
  },
  priceView: {
    flexDirection: 'row',
    marginTop: normalizeH(7),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00BE96',
    lineHeight: 17,
  },
})