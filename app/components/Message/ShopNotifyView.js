/**
 * Created by yangyang on 2017/1/18.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import ScoreShow from '../common/ScoreShow'
import Expander from '../common/Expander'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class ShopNotifyView extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="店铺消息"
        />
        <View style={styles.itemContainer}>
          <ScrollView style={{height: PAGE_HEIGHT}}>
            <View style={styles.itemView}>
              <View style={styles.personView}>
                <TouchableOpacity>
                  <View style={styles.avtarView}>
                    <Image style={styles.avtarStyle} source={{uri: 'http://c.hiphotos.baidu.com/image/pic/item/64380cd7912397dd5393db755a82b2b7d1a287dd.jpg'}}></Image>
                  </View>
                </TouchableOpacity>
                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                  <View>
                    <Text style={styles.userNameStyle}>鱼爱上猫</Text>
                  </View>
                  <View style={{flexDirection: 'row', paddingTop: 2}}>
                    <Text style={{fontSize: 12, color: '#B6B6B6', width: 76}}>10分钟前</Text>
                    <Image style={{width: 10, height: 13, marginLeft: 18}} source={require("../../assets/images/writer_loaction.png")}/>
                    <Text style={{fontSize: 12, color: '#B6B6B6', paddingLeft: 2}}>长沙</Text>
                  </View>
                </View>
                <View style={{flex: 1}}/>
                <View style={{paddingRight: 15}}>
                  <TouchableOpacity>
                    <View style={{borderWidth: 1, width: 54, height: 25, borderColor: '#E9E9E9', borderRadius: 3, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{fontSize: 14, color: '#50E3C2'}}>回 复</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.msgViewStyle}>
                <Expander showLines={3} textStyle={{fontSize: 17, color: '#4a4a4a', lineHeight: 24,}} content="这个店非常棒,在默认情况下会为文字额外保留一些padding，以便留出空间摆放上标或是下标的文字。对于某些字体来说，这些额外的padding可能会导致文字难以垂直居中。如果你把textAlignVertical设置为center之后，文字看起来依然不在正中间，那么可以尝试将本属性设置"/>
              </View>
              <View style={styles.shopView}>
                <TouchableOpacity>
                  <View style={{flexDirection: 'row', backgroundColor: 'rgba(242,242,242,0.50)'}}>
                    <Image style={{width: 80, height: 80}} source={{uri: 'http://g.hiphotos.baidu.com/image/pic/item/83025aafa40f4bfb1530a905014f78f0f63618fa.jpg'}}></Image>
                    <View style={{paddingLeft: 10, paddingTop: 16, paddingRight: 10}}>
                      <Text style={{fontSize: 17, color: '4a4a4a'}} numberOfLines={1}>乐会港式茶餐厅（奥克斯广场店）</Text>
                      <View style={{marginTop: 12}}>
                        <ScoreShow score={4.3} bgColor="grey"/>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopNotifyView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  itemContainer: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
  },
  itemView: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF'
  },
  personView: {
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 12,
  },
  avtarView: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden'
  },
  avtarStyle: {
    width: 36,
    height: 36
  },
  userNameStyle: {
    fontSize: 15,
    color: '#50E3C2'
  },
  msgViewStyle: {
    marginTop: 21,
    marginBottom: 15,
    justifyContent: 'center',
    paddingLeft: 18,
    paddingRight: 18,
  },
  shopView: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 12,
  },
})