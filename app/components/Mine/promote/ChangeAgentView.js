/**
 * Created by yangyang on 2017/4/17.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  Image,
  InteractionManager,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  TextInput,
  ListView,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import THEME from '../../../constants/themes/theme1'
import Icon from 'react-native-vector-icons/Ionicons'
import CommonListView from '../../common/CommonListView'
import PromoterLevelIcon from './PromoterLevelIcon'

class ChangeAgentView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
    }
  }

  refreshData() {

  }

  loadMoreData() {

  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <View style={{paddingLeft: normalizeW(15)}}>
          <Icon
            name='ios-arrow-back'
            style={styles.goBack}/>
        </View>
        <View style={styles.searchView}>
          <View style={{paddingLeft: normalizeW(10), paddingRight: normalizeW(10)}}>
            <Image style={{width: normalizeW(20), height: normalizeH(20)}} resizeMode='contain'
                   source={require('../../../assets/images/search.png')}/>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TextInput style={styles.searchInputStyle}
                       placeholder='输入昵称或手机号完成搜索'
                       underlineColorAndroid="transparent"
                       onChangeText={(text) => this.setState({searchText: text})}/>
          </View>
        </View>
        <View style={styles.searchBtn}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.searchBtnText}>搜索</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderRow(rowData, rowId) {
    return (
      <View style={{borderBottomWidth: 1, borderColor: '#F5F5F5'}}>
        <View style={styles.promoterBaseView}>
          <TouchableOpacity style={{paddingLeft: normalizeW(15), paddingRight: normalizeW(10)}} onPress={() => {}}>
            <Image style={styles.avatarStyle} resizeMode='contain'
                   source={require('../../../assets/images/default_portrait.png')}/>
          </TouchableOpacity>
          <View style={styles.baseInfoView}>
            <View>
              <View>
                <Text style={styles.nicknameText}>白天不懂夜的黑</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: normalizeH(10)}}>
                <PromoterLevelIcon level={2} mode="tiny"/>
                <Text style={[styles.tipsText, {paddingLeft: normalizeW(10), paddingRight: normalizeW(10)}]}>长沙</Text>
                <Text style={styles.tipsText}>最新业绩：一天前</Text>
              </View>
            </View>
            <TouchableOpacity style={{marginRight: normalizeW(15)}} onPress={() => {}}>
              <Image source={require('../../../assets/images/selected.png')}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.performView}>
          <Text style={styles.totalPerformText}>总业绩</Text>
          <Text style={styles.performText}>9999.00</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {this.renderHeader()}
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={{backgroundColor: '#FFF'}}
            dataSource={this.props.dataSource}
            renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
            loadNewData={()=> {
              this.refreshData()
            }}
            loadMoreData={()=> {
              this.loadMoreData()
            }}
            ref={(listView) => this.listView = listView}
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

  return {
    dataSource: ds.cloneWithRows(['adb', 'afd', 'fgasdf']),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChangeAgentView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: THEME.base.backgroundColor,
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(20),
        height: normalizeH(64)
      },
      android: {
        height: normalizeH(44)
      }
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#B2B2B2',
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
  goBack: {
    fontSize: em(28),
    color: THEME.base.mainColor,
  },
  searchBtn: {
    width: normalizeW(50),
    height: normalizeH(30),
    backgroundColor: THEME.base.mainColor,
    borderRadius: 5,
    marginRight: normalizeW(15),
  },
  searchBtnText: {
    fontSize: em(15),
    color: '#FFF',
    alignSelf: 'center',
  },
  searchView: {
    borderWidth: 1,
    backgroundColor: 'rgba(170, 170, 170, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    width: normalizeW(267),
    height: normalizeH(30),
    borderRadius: 5,
    borderColor: '#F5F5F5',
  },
  searchInputStyle: {
    flex: 1,
    padding: 0,
  },
  avatarStyle: {
    width: normalizeW(44),
    height: normalizeH(44),
    borderRadius: normalizeW(22),
    overflow: 'hidden',
  },
  promoterBaseView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nicknameText: {
    fontSize: em(17),
    fontWeight: 'bold',
    color: '#5a5a5a',
  },
  baseInfoView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: normalizeH(69),
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  performView: {
    height: normalizeH(43),
    paddingLeft: normalizeW(70),
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipsText: {
    fontSize: em(12),
    color: '#B6B6B6',
  },
  totalPerformText: {
    fontSize: em(12),
    color: '#5A5A5A',
    paddingRight: normalizeW(10),
  },
  performText: {
    fontSize: em(15),
    color: THEME.base.mainColor,
  },
})