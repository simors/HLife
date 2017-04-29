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
import {getAreaPromoterAgents} from '../../../action/promoterAction'
import {selectAreaAgents} from '../../../selector/promoterSelector'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

/**
 * 只有省、市级推广员可以看到这个界面
 */
class AreaPromoterManager extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      this.props.getAreaPromoterAgents({
        identity: this.props.promoter.identity,
        province: this.props.promoter.province,
        city: this.props.promoter.city,
      })
    })
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

  renderAgentIcon(areaAgent) {
    if (areaAgent.userId) {
      return (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Image style={styles.avatarStyle} resizeMode='contain'
                 source={areaAgent.avatar ? {uri: areaAgent.avatar} : require('../../../assets/images/default_portrait.png')}/>
          <Text style={styles.userNameText} numberOfLines={1}>{areaAgent.nickname}</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.addBtnStyle}>
          <Text style={{fontSize: em(15), color: '#FFF'}}>添加</Text>
        </View>
      )
    }
  }

  renderAreaItem(areaAgent) {
    let promoter = this.props.promoter
    return (
      <View style={styles.areaItemView}>
        <TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
                          onPress={() => {Actions.AREA_DETAIL({
                            area: areaAgent.area,
                            province: promoter.province,
                            city: promoter.identity == 1 ? areaAgent.area : promoter.city,
                            district: promoter.identity == 1 ? '' : (promoter.identity == 2 ? areaAgent.area : promoter.district),
                            upPromoter: promoter,
                          })}}>
          <View style={styles.areaNameStyle}>
            <Text style={styles.txtStyle} numberOfLines={1}>{areaAgent.area}</Text>
          </View>
          <View style={styles.feeViewStyle}>
            <Text style={styles.feeTxt} numberOfLines={1}>{areaAgent.tenant}</Text>
          </View>
          <View style={styles.agentItem}>
            {this.renderAgentIcon(areaAgent)}
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
            enableEmptySections={true}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 != r2,
  })
  let areaAgents = selectAreaAgents(state)

  return {
    areaSource: ds.cloneWithRows(areaAgents),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getAreaPromoterAgents,
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
    top: normalizeH(64),
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
    marginTop: normalizeH(109),
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
  addBtnStyle: {
    width: normalizeH(42),
    height: normalizeH(25),
    backgroundColor: THEME.base.mainColor,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarStyle: {
    width: normalizeW(20),
    height: normalizeH(20),
    borderRadius: normalizeW(10),
    overflow: 'hidden',
  },
})