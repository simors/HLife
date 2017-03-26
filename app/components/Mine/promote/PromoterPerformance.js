/**
 * Created by yangyang on 2017/3/25.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  StatusBar,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import THEME from '../../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import PromoterLevelIcon from './PromoterLevelIcon'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class PromoterPerformance extends Component {
  constructor(props) {
    super(props)
  }

  renderToolbar() {
    return (
      <View style={styles.toolView}>
        <TouchableOpacity style={{width: normalizeW(35), height: normalizeH(35), justifyContent: 'center', alignItems: 'center'}}
                          onPress={() => Actions.pop()} >
          <Icon name="ios-arrow-back" style={styles.left} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Image style={{width: normalizeW(20), height: normalizeH(20)}} source={require('../../../assets/images/revernue_details.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderPromoterLevel() {
    return (
      <View>
        <PromoterLevelIcon level={1} />
      </View>
    )
  }

  renderHeaderView() {
    return (
      <LinearGradient colors={['#F77418', '#F5A623', '#F77418']} style={styles.header}>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          {this.renderToolbar()}
          {this.renderPromoterLevel()}
        </View>
      </LinearGradient>
    )
  }

  renderBodyView() {
    return (
      <View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => {}}>
            <Image style={{width: normalizeW(156), height: normalizeH(156)}}
                   source={require('../../../assets/images/generate_code.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={{flex: 1, height: PAGE_HEIGHT, marginBottom: normalizeH(45)}}>
          {this.renderHeaderView()}
          {this.renderBodyView()}
        </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(PromoterPerformance)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
  },
  header: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        height: normalizeH(217)
      },
      android: {
        height: normalizeH(197)
      },
    }),
  },
  toolView: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(20)
      },
      android: {
        marginTop: normalizeH(0)
      },
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: normalizeH(10),
    paddingBottom: normalizeH(10),
    paddingRight: normalizeW(35),
  },
  left: {
    fontSize: em(24),
    color: '#FFF',
  },
})