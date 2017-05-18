/**
 * Created by wanpeng on 2017/5/16.
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  TextInput,
  InteractionManager,
  ListView,
  ScrollView,
  Text,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {normalizeH, normalizeW, normalizeBorder, em} from '../../util/Responsive'
import Icon from 'react-native-vector-icons/Ionicons'
import THEME from '../../constants/themes/theme1'
import {searchShopAction} from '../../action/searchActions'
import {getShopSearchResult} from '../../selector/searchSelector'
import ScoreShow from '../common/ScoreShow'


const PAGE_WIDTH=Dimensions.get('window').width

const DS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class SearchShop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchKey: this.props.searchKey
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.searchShopAction({
        key: this.props.searchKey,
        sid: this.props.sid
      })
    })
  }

  onLoadMore = () => {
    if(this.props.shops.hasMore) {
      this.props.searchShopAction({
        key: this.state.searchKey,
        sid: this.props.shops.sid
      })
    }
  }

  renderShopItems(rowData) {
    return (
      <TouchableOpacity onPress={() => {Actions.SHOP_DETAIL({id: rowData.id})}}>
        <View style={styles.item}>
          <View style={styles.coverWrap}>
            <Image style={styles.cover} source={rowData.coverUrl? {uri: rowData.coverUrl}: require('../../assets/images/shop_defualt.png')}/>
          </View>
          <View style={styles.shopIntroWrap}>
            <View style={styles.shopInnerIntroWrap}>
              <Text style={styles.shopName} numberOfLines={1}>{rowData.shopName || '优店'}</Text>
              <ScoreShow
                containerStyle={{flex:1}}
                score={rowData.score || 2}
              />
              <View style={styles.subInfoWrap}>
                <View style={{flex:1,flexDirection:'row'}}>
                  <Text style={styles.subTxt}>{rowData.shopAddress || '未知地址'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderShopHeader(sectionData, sectionID) {
    if(sectionData.length > 0) {
      return(
        <View style={styles.sectionHeader}>
          <Text style={{fontSize: 15, color: '#999999', marginTop: normalizeH(10), marginBottom: normalizeH(10)}}>店铺</Text>
        </View>
      )
    } else {
      return(
        <View />
      )
    }

  }

  renderShopView() {
    return(
      <View style={styles.section}>
        <ListView
          style={{flex: 1}}
          keyboardDismissMode="on-drag"
          renderSectionHeader={this.renderShopHeader}
          dataSource={DS.cloneWithRows(this.props.shops.result)}
          renderRow={(rowData) => this.renderShopItems(rowData)}
          enableEmptySections={true}
          stickySectionHeadersEnabled= {true}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={10}

        />
      </View>
    )
  }

  onSearchShop = () => {
    if (this.state.searchKey && this.state.searchKey.length > 0) {
      this.props.searchShopAction({
        key: this.state.searchKey,
      })
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.leftWrap} onPress={() => Actions.pop()}>
            <Icon name="ios-arrow-back" style={styles.left}/>
          </TouchableOpacity>
          <View style={styles.centerWrap}>
            <Image style={{marginLeft: normalizeW(10), marginRight: normalizeW(10)}} source={require('../../assets/images/search.png')}/>
            <TextInput
              style={{flex: 1, height: normalizeH(30), color: 'white', padding: 0}}
              onChangeText={(text) => this.setState({searchKey: text})}
              value={this.state.searchKey}
              multiline={false}
              placeholder="搜索店铺"
              underlineColorAndroid="transparent"
              placeholderTextColor='#FFFFFF'/>
          </View>
          <TouchableOpacity style={styles.rightWrap} onPress={this.onSearchShop}>
            <Text style={{ fontSize: 17, color: '#FFFFFF', paddingRight: normalizeW(10)}}>搜索</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: normalizeH(64), flex: 1,backgroundColor: '#EBEBEB'}}>
          {this.renderShopView()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  let shops = getShopSearchResult(state) || []
  return {
    shops: shops,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchShopAction
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchShop)


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: THEME.base.mainColor,
    paddingTop: normalizeH(20),
    height: normalizeH(64),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#B2B2B2',
  },
  leftWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  left: {
    fontSize: 28,
    color: '#FFF',
    marginLeft: normalizeW(10)
  },
  centerWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: normalizeW(10),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    borderRadius: 10,
  },
  rightWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: normalizeW(20)
  },
  section: {
    flex: 1,
    paddingLeft: normalizeW(20),
    backgroundColor: '#FFFFFF',
    marginBottom: normalizeH(10)
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB'
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  coverWrap: {
    width: 80,
    height: 80
  },
  cover: {
    flex: 1,
    width: 80,
    height: 80
  },
  shopIntroWrap: {
    flex: 1,
    paddingLeft: 10,
  },
  shopInnerIntroWrap: {
    height: 80,
  },
  shopName: {
    lineHeight: em(20),
    fontSize: em(17),
    color: '#8f8e94'
  },
  subInfoWrap: {
    flexDirection: 'row',
  },
  subTxt: {
    marginRight: normalizeW(10),
    color: '#d8d8d8',
    fontSize: em(12)
  },
})