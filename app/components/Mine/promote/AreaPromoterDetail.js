/**
 * Created by yangyang on 2017/4/15.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  InteractionManager,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ListView,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../../constants/themes/theme1'
import Header from '../../common/Header'

class AreaPromoterDetail extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header leftType="icon"
                leftIconName="ios-arrow-back"
                leftPress={()=> {
                  Actions.pop()
                }}
                title={this.props.area + '详情'}
        />
        <View style={styles.body}>
          <ScrollView style={{flex: 1}}>
            <View style={{backgroundColor: '#FFF'}}>
              <View style={[styles.agentItemView, {borderBottomWidth: 1, borderColor: '#f5f5f5'}]}>
                <View style={{flexDirection: 'row', paddingLeft: normalizeW(15), alignItems: 'center'}}>
                  <Image style={styles.avatarStyle} resizeMode='contain' source={require('../../../assets/images/default_portrait.png')}/>
                  <View style={{paddingLeft: normalizeW(10)}}>
                    <Text style={{fontSize: em(15), color: '#5a5a5a'}}>白天不懂夜的黑</Text>
                    <Text style={{fontSize: em(12), color: '#B6B6B6', paddingTop: normalizeH(9)}}>个人业绩： 999999.00</Text>
                  </View>
                </View>
                <View style={styles.changeAgentBtn}>
                  <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {}}>
                    <Text style={{fontSize: em(15), color: '#FFF'}}>更换代理</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.agentItemView}>
                <View style={{flexDirection: 'row', paddingLeft: normalizeW(15), alignItems: 'center'}}>
                  <Image style={styles.avatarStyle} resizeMode='contain' source={require('../../../assets/images/Settlement_fee.png')}/>
                  <View style={{paddingLeft: normalizeW(10)}}>
                    <Text style={{fontSize: em(15), color: '#5a5a5a'}}>当前店铺入驻费（元）</Text>
                  </View>
                </View>
                <View style={[styles.changeAgentBtn, {backgroundColor: 'rgba(255, 157, 78, 0.2)'}]}>
                  <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {}}>
                    <Text style={{fontSize: em(17), color: THEME.base.mainColor, fontWeight: 'bold'}}>100.00</Text>
                  </TouchableOpacity>
                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(AreaPromoterDetail)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
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
  agentItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: normalizeH(65),
  },
  avatarStyle: {
    width: normalizeW(44),
    height: normalizeH(44),
    borderRadius: normalizeW(22),
    overflow: 'hidden',
  },
  changeAgentBtn: {
    width: normalizeW(76),
    height: normalizeH(25),
    backgroundColor: THEME.base.mainColor,
    borderRadius: 2,
    marginRight: normalizeW(15),
  },
})