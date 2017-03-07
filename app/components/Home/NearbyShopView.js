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

class NearbyShopView extends Component {
  constructor(props) {
    super(props)
  }

  renderMainShop() {
    return (
      <View style={styles.mainShops}>
        <TouchableOpacity style={{flex: 1}} onPress={() => {}}>
          <View style={[styles.mainShopItem, {paddingRight: 2}]}>
            <View style={{width: normalizeW(80)}}>
              <View style={styles.mainShopTitleView}>
                <Text style={[styles.shopTitle, {color: THEME.base.mainColor}]} numberOfLines={1}>美食诱惑</Text>
              </View>
              <View style={{paddingLeft: 8, paddingRight: 8, marginTop: 5}}>
                <Text style={styles.itemAbstract} numberOfLines={6}>做生活的美食家</Text>
              </View>
            </View>
            <View style={{flex: 1}}>
              <Image style={{flex: 1}} source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488878883278&di=033c6d595fc763a7141b835d1a7eb3fe&imgtype=0&src=http%3A%2F%2Fimages4.c-ctrip.com%2Ftarget%2Ffd%2Ftuangou%2Fg1%2FM05%2F5F%2FE5%2FCghzflSTmliATO2qAADCgTeKOFQ983_720_480_s.jpg'}}></Image>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1}} onPress={() => {}}>
          <View style={styles.mainShopItem}>
            <View style={{width: normalizeW(80)}}>
              <View style={styles.mainShopTitleView}>
                <Text style={[styles.shopTitle, {color: THEME.base.mainColor}]} numberOfLines={1}>日用超市</Text>
              </View>
              <View style={{paddingLeft: 8, paddingRight: 8, marginTop: 5}}>
                <Text style={styles.itemAbstract} numberOfLines={6}>生活的智慧都在这里</Text>
              </View>
            </View>
            <View style={{flex: 1}}>
              <Image style={{flex: 1}} source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488879502515&di=430c959a4e486a3e21ba795d480636a2&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D1102908986%2C2844132103%26fm%3D214%26gp%3D0.jpg'}}></Image>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderSecondShop() {
    return (
      <View style={styles.secondShops}>
        <TouchableOpacity style={{flex: 1}} onPress={() => {}}>
          <View style={[styles.secondShopItem, {borderRightWidth: 1, borderColor: '#F5F5F5'}]}>
            <View>
              <Text style={[styles.shopTitle, {color: '#4990E2'}]} numberOfLines={1}>药店</Text>
            </View>
            <View style={{paddingLeft: 8, paddingRight: 8, marginTop: 5}}>
              <Text style={styles.itemAbstract} numberOfLines={1}>医疗保健</Text>
            </View>
            <View style={styles.secondShopImg}>
              <Image style={{flex: 1}} source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488881295873&di=453178b13edcf7b57c56a35d33b651b5&imgtype=0&src=http%3A%2F%2Fwww.qnr.cn%2Fmed%2Fcano%2F201501%2F20150127190953936.jpg'}}></Image>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1}} onPress={() => {}}>
          <View style={[styles.secondShopItem, {borderRightWidth: 1, borderColor: '#F5F5F5'}]}>
            <View>
              <Text style={[styles.shopTitle, {color: '#7ED321'}]} numberOfLines={1}>健康养生</Text>
            </View>
            <View style={{paddingLeft: 8, paddingRight: 8, marginTop: 5}}>
              <Text style={styles.itemAbstract} numberOfLines={1}>优质生活</Text>
            </View>
            <View style={styles.secondShopImg}>
              <Image style={{flex: 1}} source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488882365481&di=c72674a15be6dedcf52f08f5afbbcd5e&imgtype=0&src=http%3A%2F%2Fimg01.taopic.com%2F141109%2F240421-14110ZP22487.jpg'}}></Image>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1}} onPress={() => {}}>
          <View style={[styles.secondShopItem, {borderRightWidth: 1, borderColor: '#F5F5F5'}]}>
            <View>
              <Text style={[styles.shopTitle, {color: '#FF9D4E'}]} numberOfLines={1}>母婴</Text>
            </View>
            <View style={{paddingLeft: 8, paddingRight: 8, marginTop: 5}}>
              <Text style={styles.itemAbstract} numberOfLines={1}>宝贝快长大</Text>
            </View>
            <View style={styles.secondShopImg}>
              <Image style={{flex: 1}} source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488882403992&di=2e7ec3b802cf002324824c23fada34b2&imgtype=0&src=http%3A%2F%2Fimg.7808.cn%2F10%2F2012%2F1018%2F13505313549683.jpg'}}></Image>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1}} onPress={() => {}}>
          <View style={styles.secondShopItem}>
            <View>
              <Text style={[styles.shopTitle, {color: '#00BE96'}]} numberOfLines={1}>美容美发</Text>
            </View>
            <View style={{paddingLeft: 8, paddingRight: 8, marginTop: 5}}>
              <Text style={styles.itemAbstract} numberOfLines={1}>烫染99元起</Text>
            </View>
            <View style={styles.secondShopImg}>
              <Image style={{flex: 1}} source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488882470677&di=a4f43ce7f190b73e3f4de37099240a1f&imgtype=0&src=http%3A%2F%2Fimg.taopic.com%2Fuploads%2Fallimg%2F110726%2F2028-110H609312443.jpg'}}></Image>
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
            <Image source={require('../../assets/images/near.png')} width={12} height={14}></Image>
            <Text style={styles.headerText} numberOfLines={1}>周边必逛</Text>
          </View>
        </View>
        <View style={styles.contentItem}>
          {this.renderMainShop()}
          {this.renderSecondShop()}
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

export default connect(mapStateToProps, mapDispatchToProps)(NearbyShopView)

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
  mainShops: {
    flex: 1,
    flexDirection: 'row',
    height: normalizeH(108),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  secondShops: {
    flex: 1,
    flexDirection: 'row',
    height: normalizeH(102),
  },
  mainShopItem: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 13,
  },
  secondShopItem: {
    alignItems: 'center',
    paddingTop: 13,
  },
  mainShopTitleView: {
    borderLeftWidth: 3,
    borderColor: THEME.base.mainColor,
    paddingLeft: 5,
  },
  shopTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 15,
  },
  itemAbstract: {
    fontSize: 11,
    color: '#AAAAAA',
    lineHeight: 15,
  },
  secondShopImg: {
    marginTop: 5,
    height: normalizeH(45),
    width: normalizeW(82),
    paddingBottom: normalizeH(10),
  },
})