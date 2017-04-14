/**
 * Created by yangyang on 2017/4/13.
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
import Icon from 'react-native-vector-icons/Ionicons'
import THEME from '../../../constants/themes/theme1'
import Header from '../../common/Header'
import {selectSubArea} from '../../../selector/configSelector'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class AreaPromoterManager extends Component {
  constructor(props) {
    super(props)
  }

  renderHeaderTitle() {
    return (
      <View style={styles.headerTitle}>
        <View style={styles.areaNameStyle}>
          <Text style={styles.txtStyle}>地点</Text>
        </View>
        <View style={styles.feeViewStyle}>
          <Text style={styles.txtStyle}>入驻费(元)</Text>
        </View>
        <View style={styles.itemStyle}>
          <Text style={styles.txtStyle}>代理人</Text>
        </View>
      </View>
    )
  }

  renderAreaItem(area) {
    return (
      <View style={styles.areaItemView}>
        <TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} onPress={() => {}}>
          <View style={styles.areaNameStyle}>
            <Text style={styles.txtStyle} numberOfLines={1}>{area}</Text>
          </View>
          <View style={styles.feeViewStyle}>
            <Text style={styles.feeTxt} numberOfLines={1}>100.00</Text>
          </View>
          <View style={styles.agentItem}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Image style={{width: normalizeW(20), height: normalizeH(20)}} resizeMode='contain'
                     source={require('../../../assets/images/default_portrait.png')}/>
              <Text style={styles.userNameText} numberOfLines={1}>白天不懂夜的黑</Text>
            </View>
            <View style={{paddingRight: normalizeW(15)}}>
              <Icon
                name='ios-arrow-forward'
                style={{color: '#F5F5F5', fontSize: em(28)}}/>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
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
                title="区域管理"
        />
        {this.renderHeaderTitle()}
        <View style={styles.areaListView}>
          <ListView
            style={{flex: 1}}
            dataSource={this.props.areaSource}
            renderRow={(area) => this.renderAreaItem(area)}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  let promoter = ownProps.promoter
  let subArea = []
  if (promoter.identity == 1 || promoter.identity == 2) {
    subArea = selectSubArea(state, {sublevel: promoter.identity, province: promoter.province, city: promoter.city})
  }

  return {
    areaSource: ds.cloneWithRows(subArea),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AreaPromoterManager)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
  },
  headerTitle: {
    flexDirection: 'row',
    height: normalizeH(45),
    width: PAGE_WIDTH,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    ...Platform.select({
      ios: {
        top: normalizeH(64),
      },
      android: {
        top: normalizeH(44)
      }
    }),
  },
  itemStyle: {
    flex: 1,
    alignItems: 'center',
  },
  txtStyle: {
    fontSize: em(17),
    color: '#5a5a5a',
  },
  areaListView: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: normalizeH(109),
      },
      android: {
        marginTop: normalizeH(89),
      }
    }),
  },
  areaItemView: {
    height: normalizeH(47),
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  feeTxt: {
    fontSize: em(17),
    color: THEME.base.mainColor,
  },
  areaNameStyle: {
    paddingLeft: normalizeW(22),
    alignItems: 'center',
    width: normalizeW(100),
  },
  feeViewStyle: {
    width: normalizeW(120),
    paddingLeft: normalizeW(10),
    alignItems: 'center',
  },
  agentItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: normalizeW(10),
  },
  userNameText: {
    flex: 1,
    fontSize: em(15),
    color: '#5A5A5A',
    paddingLeft: normalizeW(5),
  },
})