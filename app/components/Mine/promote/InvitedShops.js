/**
 * Created by yangyang on 2017/4/11.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
  StatusBar,
  ListView,
  InteractionManager,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import THEME from '../../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import Header from '../../common/Header'
import CommonListView from '../../common/CommonListView'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class InvitedShops extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
    })
  }

  refreshData() {
    InteractionManager.runAfterInteractions(()=>{
    })
  }

  loadMoreData() {
    InteractionManager.runAfterInteractions(()=>{
    })
  }

  renderRow(rowData, index) {
    return (
      <View>
        <View>
          <TouchableOpacity style={styles.shopItemView} onPress={() => {}}>
            <View style={styles.shopCoverView}>
              <Image style={{width: normalizeW(100), height: normalizeH(75)}}
                    source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491905602838&di=e6bec8302adfa1e44dcbf4f10339e0b5&imgtype=0&src=http%3A%2F%2Fimg.china-ef.com%2Fuser%2F201504%2F16%2F2015041607441901.jpg'}}/>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.shopNameText}>乐惠港式茶餐厅</Text>
              <View style={{flexDirection: 'row', paddingTop: normalizeH(10)}}>
                <Text style={[styles.tipText, {paddingRight: normalizeW(8)}]}>粤菜</Text>
                <Text style={[styles.tipText, {paddingRight: normalizeW(8)}]}>银盆岭</Text>
                <Text style={[styles.tipText, {paddingRight: normalizeW(8)}]}>4.3km</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: normalizeH(15), alignItems: 'center'}}>
                <Text style={{fontSize: em(12), color: THEME.base.mainColor}}>入驻费（元）</Text>
                <Text style={{fontSize: em(18), color: THEME.base.mainColor, fontWeight: 'bold', paddingRight: normalizeW(15)}}>¥ 150</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.shopItemView} onPress={() => {}}>
            <View style={styles.shopCoverView}>
              <Image style={{width: normalizeW(100), height: normalizeH(75)}}
                     source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491905602838&di=e6bec8302adfa1e44dcbf4f10339e0b5&imgtype=0&src=http%3A%2F%2Fimg.china-ef.com%2Fuser%2F201504%2F16%2F2015041607441901.jpg'}}/>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.shopNameText}>乐惠港式茶餐厅</Text>
              <View style={{flexDirection: 'row', paddingTop: normalizeH(10)}}>
                <Text style={[styles.tipText, {paddingRight: normalizeW(8)}]}>粤菜</Text>
                <Text style={[styles.tipText, {paddingRight: normalizeW(8)}]}>银盆岭</Text>
                <Text style={[styles.tipText, {paddingRight: normalizeW(8)}]}>4.3km</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: normalizeH(15), alignItems: 'center'}}>
                <Text style={{fontSize: em(12), color: THEME.base.mainColor}}>入驻费（元）</Text>
                <Text style={{fontSize: em(18), color: THEME.base.mainColor, fontWeight: 'bold', paddingRight: normalizeW(15)}}>¥ 150</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.shopItemView} onPress={() => {}}>
            <View style={styles.shopCoverView}>
              <Image style={{width: normalizeW(100), height: normalizeH(75)}}
                     source={{uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491905602838&di=e6bec8302adfa1e44dcbf4f10339e0b5&imgtype=0&src=http%3A%2F%2Fimg.china-ef.com%2Fuser%2F201504%2F16%2F2015041607441901.jpg'}}/>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.shopNameText}>乐惠港式茶餐厅</Text>
              <View style={{flexDirection: 'row', paddingTop: normalizeH(10)}}>
                <Text style={[styles.tipText, {paddingRight: normalizeW(8)}]}>粤菜</Text>
                <Text style={[styles.tipText, {paddingRight: normalizeW(8)}]}>银盆岭</Text>
                <Text style={[styles.tipText, {paddingRight: normalizeW(8)}]}>4.3km</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: normalizeH(15), alignItems: 'center'}}>
                <Text style={{fontSize: em(12), color: THEME.base.mainColor}}>入驻费（元）</Text>
                <Text style={{fontSize: em(18), color: THEME.base.mainColor, fontWeight: 'bold', paddingRight: normalizeW(15)}}>¥ 150</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderExplainBtn() {
    return (
      <TouchableOpacity style={styles.explainBtnStyle}
                        onPress={() => {}}>
        <Image style={{width: normalizeW(18), height: normalizeH(18)}} resizeMode="contain"
               source={require('../../../assets/images/explain_revernue.png')}/>
      </TouchableOpacity>
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
                title="邀请店铺"
                rightComponent={() => {return this.renderExplainBtn()}}
        />
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
  let ds = undefined
  if (ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }

  let comps = ['aaa']

  return {
    dataSource: ds.cloneWithRows(comps),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InvitedShops)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
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
    width: PAGE_WIDTH,
    backgroundColor: '#FFF',
  },
  explainBtnStyle: {
    width: normalizeW(40),
    height: normalizeH(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(5)
  },
  shopItemView: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: normalizeH(20),
    paddingBottom: normalizeH(15),
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  shopCoverView: {
    paddingLeft: normalizeW(20),
    paddingRight: normalizeW(15),
  },
  shopNameText: {
    fontSize: em(17),
    color: '#5a5a5a',
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: em(12),
    color: '#D8D8D8',
  },
})