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
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import ImageGroupViewer from '../common/Input/ImageGroupViewer'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const images = [
  'http://c.hiphotos.baidu.com/image/pic/item/64380cd7912397dd5393db755a82b2b7d1a287dd.jpg',
  'http://c.hiphotos.baidu.com/image/pic/item/d009b3de9c82d1585e277e5f840a19d8bd3e42b2.jpg',
  'http://g.hiphotos.baidu.com/image/pic/item/83025aafa40f4bfb1530a905014f78f0f63618fa.jpg',
  'http://c.hiphotos.baidu.com/image/pic/item/f7246b600c3387448982f948540fd9f9d72aa0bb.jpg'
]

class ShopDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shoCategoryId: '',
    }
  }


  render() {
    const scoreWidth = 4.5 / 5.0 * 62
    
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="店铺详情"
          rightType="none"
        />
        <View style={styles.body}>
          <ScrollView
            contentContainerStyle={[styles.contentContainerStyle]}
          >
            <View style={styles.shopHead}>
              <View style={styles.shopHeadLeft}>
                <Text style={styles.shopName} numberOfLines={1}>乐会港式茶餐厅（奥克斯广场店）</Text>
                <View style={styles.shopOtherInfo}>
                  <View style={styles.scoresWrap}>
                    <View style={styles.scoreIconGroup}>
                      <View style={[styles.scoreBackDrop, {width: scoreWidth}]}></View>
                      <Image style={styles.scoreIcon} source={require('../../assets/images/star_empty.png')}/>
                    </View>
                    <Text style={styles.score}>4.5</Text>
                  </View>
                  <Text style={styles.distance}>4.3km</Text>
                </View>
              </View>
              <View style={styles.shopHeadRight}>
                <TouchableOpacity onPress={()=>{Toast.show('关注成功')}}>
                  <Image style={styles.attention} source={require('../../assets/images/give_attention_head.png')}/>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.albumWrap}>
              <ImageGroupViewer
                showMode="oneLine"
                images={images}
                containerStyle={{marginLeft:0,marginRight:0}}
                imageStyle={{margin:0,marginRight:2}}
              />
            </View>

            <View style={styles.locationWrap}>
              <TouchableOpacity style={styles.locationContainer} onPress={()=>{Toast.show('地址')}}>
                <Image style={styles.locationIcon} source={require('../../assets/images/shop_loaction.png')}/>
                <View style={styles.locationTxtWrap}>
                  <Text style={styles.locationTxt} numberOfLines={2}>岳麓大道57号奥克斯广场3楼</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.contactNumberWrap}>
              <TouchableOpacity style={styles.contactNumberContainer} onPress={()=>{Toast.show('联系电话')}}>
                <Image style={styles.contactNumberIcon} source={require('../../assets/images/shop_call.png')}/>
                <View style={styles.contactNumberTxtWrap}>
                  <Text style={styles.contactNumberTxt} numberOfLines={2}>岳麓大道57号奥克斯广场3楼</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.shopAnnouncementWrap}>
              <View style={styles.shopAnnouncementContainer}>
                <View style={styles.shopAnnouncementCoverWrap}>
                  <Image style={styles.shopAnnouncementCover} source={{uri: "http://c.hiphotos.baidu.com/image/pic/item/64380cd7912397dd5393db755a82b2b7d1a287dd.jpg"}}/>
                </View>
                <View style={styles.shopAnnouncementCnt}>
                  <View style={styles.shopAnnouncementTitleWrap}>
                    <Text numberOfLines={3} style={styles.shopAnnouncementTitle}>
                      精心研制的营养早餐，蔬菜、水果和稀饭的结合，如诗一般美
                    </Text>
                  </View>
                  <View style={styles.shopAnnouncementSubTitleWrap}>
                    <Image style={styles.shopAnnouncementIcon} source={{uri: "http://c.hiphotos.baidu.com/image/pic/item/64380cd7912397dd5393db755a82b2b7d1a287dd.jpg"}}/>
                    <Text style={styles.shopAnnouncementSubTxt}>米奇妙妙屋</Text>
                    <Text style={styles.shopAnnouncementSubTxt}>一天前</Text>
                  </View>
                </View>
              </View>
              <View style={styles.shopAnnouncementBadge}>
                <Image style={styles.shopAnnouncementBadgeIcon} source={require('../../assets/images/background_everyday.png')}>
                  <Text style={styles.shopAnnouncementBadgeTxt}>店铺公告</Text>
                </Image>
              </View>
            </View>

          </ScrollView>

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

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopDetail)

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  contentContainerStyle: {

  },
  shopHead: {
    flexDirection: 'row',
    padding: 12,
    height: 70,
  },
  shopHeadLeft: {
    flex: 1,
    justifyContent: 'space-between'
  },
  shopHeadRight: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  shopName: {
    fontSize: em(17),
    color: '#030303'
  },
  shopOtherInfo: {
    flexDirection: 'row'
  },
  score: {
    marginLeft: 5,
    color: '#f5a623',
    fontSize: em(12)
  },
  scoresWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalizeW(36)
  },
  scoreIconGroup: {
    width: 62,
    height: 11,
    backgroundColor: '#d8d8d8'
  },
  scoreBackDrop: {
    height: 11,
    backgroundColor: '#f5a623'
  },
  scoreIcon: {
    position: 'absolute',
    left: 0,
    top: 0
  },
  distance: {
    color: '#d8d8d8',
    fontSize: em(12)
  },
  locationWrap: {
    paddingLeft: 10,
    paddingRight: 10
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationIcon: {
    marginRight: 10,
  },
  locationTxtWrap: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10
  },
  locationTxt: {
    lineHeight: normalizeH(20),
    fontSize: em(17),
    color: '#8f8e94',
  },
  contactNumberWrap: {
    paddingLeft: 10
  },
  contactNumberContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  contactNumberIcon: {
    marginRight: 10,
  },
  contactNumberTxtWrap: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    borderTopWidth: normalizeBorder(),
    borderTopColor: THEME.colors.lighterA
  },
  contactNumberTxt: {
    lineHeight: normalizeH(20),
    fontSize: em(17),
    color: '#8f8e94',
  },
  shopAnnouncementWrap: {
    backgroundColor: 'transparent',
  },
  shopAnnouncementContainer: {
    flexDirection: 'row',
    marginTop: normalizeH(14),
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
    justifyContent: 'space-between'
  },
  shopAnnouncementTitleWrap: {

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
    width: 65,
    height: normalizeH(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  shopAnnouncementBadgeTxt: {
    fontSize: em(12),
    color: '#fff'
  }
})