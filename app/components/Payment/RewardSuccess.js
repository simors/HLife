/**
 * Created by yangyang on 2017/4/20.
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
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import Header from '../common/Header'
import CommonButton from '../common/CommonButton'
import * as Toast from '../common/Toast'

class RewardSuccess extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="none"
          title="商家活动支付成功"
        />
        <View style={styles.body}>
          <ScrollView>
            <View style={{flexDirection: 'row'}}>
              <Image style={styles.image} source={require('../../assets/images/payment_success.png')}/>
              <View>
                <Text style={styles.success}>支付成功</Text>
                <Text style={styles.successTrip}>感谢您对作者的支持！</Text>
              </View>
            </View>
            <View style={styles.trips}>
              <Text style={{fontSize: 12, color: '#FF7819', marginBottom: 5}}></Text>
              <Text style={{fontSize: 12, color: '#5A5A5A', textAlign: 'center', }}></Text>
            </View>

            <CommonButton
              buttonStyle={{marginTop:normalizeH(20), backgroundColor: THEME.base.mainColor}}
              title="返回"
              onPress={()=>{Actions.pop()}}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(RewardSuccess)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green
  },
  headerLeftStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  headerTitleStyle: {
    color: '#fff',
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
  },
  image: {
    marginLeft: normalizeW(46),
    marginTop: normalizeH(60),
    marginRight: normalizeW(20)
  },
  success: {
    marginTop: normalizeH(88),
    fontSize: 28,
    color: '#FF7819'
  },
  successTrip: {
    marginTop: normalizeH(15),
    fontSize: 15,
    color: '#5A5A5A',
  },
  trips: {
    alignItems: 'center',
    width: normalizeW(315),
    height: normalizeH(66),
    marginTop: normalizeH(193),
    marginLeft: normalizeW(30),
    marginRight: normalizeW(30)
  }
})