/**
 * Created by zachary on 2017/2/8.
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

import {
  MapView,
  MapTypes,
  Geolocation,
  MapModule,
  PoiSearch
} from '../../common/BaiduMap'
import { FormInput } from 'react-native-elements'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as Toast from '../../common/Toast'
import CommonButton from '../../common/CommonButton'
import KeyboardAwareToolBar from '../../common/KeyboardAwareToolBar'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const MAP_HEIGHT = PAGE_HEIGHT - 20

class ShopAddressSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentCity: '',
      center: null,
      marker: null,
      zoom: 15,
      mapMarkerPos: {
        left: PAGE_WIDTH / 2,
        top: PAGE_HEIGHT / 2,
      },
      showSearchResult: false,
      searchResult: {
        error: undefined,
        message: '',
        data: []
      },
      showClearBtn: false,
      searchText: '',
      shopName: '',
      shopAddress: '',
      showShopInfoArea: true,
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {

    })

    Geolocation.getCurrentPosition()
      .then(data => {
        this.setState({
          center: {
            currentCity: data.city,
            latitude: data.latitude,
            longitude: data.longitude,
          },
        })
      })
      .catch(e =>{
        console.warn(e, 'error')
      })
  }

  componentWillReceiveProps(nextProps) {

  }

  _onMapStatusChangeFinish(e) {
    // console.log('_onMapStatusChangeFinish.e====', e)
    this.setState({
      center: {
        latitude: e.target.latitude,
        longitude: e.target.longitude
      },
    })
    Geolocation.reverseGeoCode(e.target.latitude, e.target.longitude)
      .then(data => {
        // console.log('reverseGeoCode.data===', data)
        this.setState({
          shopAddress: data.address
        })
      })
      .catch(e =>{
        console.warn(e, 'error')
      })
  }

  onMapMarkerImageLayout(event) {
    this.setState({
      mapMarkerPos: {
        left: (PAGE_WIDTH - event.nativeEvent.layout.width) / 2,
        top: MAP_HEIGHT / 2 - event.nativeEvent.layout.height,
      }
    })
  }

  _searchTextChange(text) {
    this.setState({
      searchText: text,
      showClearBtn: !!text
    })

    // console.log('_searchTextChange.text===', text)
    if(!text) {
      this.clearSearchInput()
      return
    }

    PoiSearch.searchNearbyProcess(text, this.state.center.latitude,
      this.state.center.longitude, 1000, 1)
      .then(data => {
        // console.log('searchNearbyProcess.data===', data)
        this.setState({
          showSearchResult: true,
          searchResult: {
            error: data.errcode && data.errcode,
            message: data.message && data.message,
            data: data.poiResult && data.poiResult.poiInfos
          }
        })
      })
      .catch(e =>{
        console.warn(e, 'error')
        this.setState({
          showSearchResult: true,
          searchResult: {
            error: -9,
            message: '查询异常,请稍候再试!',
            data: []
          }
        })
      })
  }

  clearSearchInput() {
    this.setState({
      searchText: '',
      showSearchResult: false,
      searchResult: {
        error: undefined,
        message: '',
        data: []
      }
    })
  }

  _onShopNameChange(text) {
    this.setState({
      shopName: text
    })
  }

  _onShopAddressChange(text) {
    this.setState({
      shopAddress: text
    })
  }

  _onSearchResultPress(poiInfo) {
    this.setState({
      showSearchResult: false,
      shopName: poiInfo.name,
      shopAddress: poiInfo.address
    })

    if(this.state.center) {
      if(!this.state.currentCity) {
        Geolocation.reverseGeoCode(this.state.center.latitude, this.state.center.longitude)
          .then(data => {
            // console.log('_onSearchResultPress.reverseGeoCode.data===', data)
            this.setState({
              currentCity: data.city,
            }, ()=>{
              this.getGeoCode()
            })
          })
          .catch(e =>{
            console.warn(e, 'error')
          })
      }else {
        this.getGeoCode()
      }
    }

  }

  getGeoCode() {
    // console.log('getGeoCode.this.state.currentCity===', this.state.currentCity)
    // console.log('getGeoCode.this.state.shopAddress===', this.state.shopAddress)
    Geolocation.geocode(this.state.currentCity, this.state.shopAddress)
      .then(data => {
        // console.log('getGeoCode.data===', data)
        if(data.latitude) {
          this.setState({
            center: {
              latitude: data.latitude,
              longitude: data.longitude
            },
            zoom: 18,
          })
        }
      })
      .catch(e =>{
        console.warn(e, 'error')
      })
  }

  _onSearchInputBlur() {
    this.setState({
      showShopInfoArea: true,
    })
  }

  _onSearchInputFocus() {
    if(typeof this.state.searchResult.error === 'number') {
      this.setState({
        showSearchResult: true,
      })
    }
    this.setState({
      showShopInfoArea: false,
    })
  }

  onShopBtnPress() {
    if(!this.state.shopName) {
      Toast.show("请填写店铺名称")
      return
    }
    if(!this.state.shopAddress) {
      Toast.show("请填写店铺地址")
      return
    }

    Actions.pop({
      refresh: {
        shopName: this.state.shopName,
        shopAddress: this.state.shopAddress
      }
    })
  }

  renderSearchResult() {
    // console.log('renderSearchResult==this.state.searchResult===', this.state.searchResult)

    if(!this.state.showSearchResult) {
      return null
    }

    if(this.state.searchResult.error != 0) {
      return (
        <View style={styles.noSearchResultContainer}>
          <Text style={styles.noSearchResultTxt}>{this.state.searchResult.message}</Text>
        </View>
      )
    }

    let searchResultsCustomStyle = {
      height: 210
    }

    if(this.state.searchResult.data.length < 3) {
      searchResultsCustomStyle = {
        height: 70 * this.state.searchResult.data.length
      }
    }

    let resultView = this.state.searchResult.data.map((item, index)=>{
      return (
        <TouchableOpacity key={"search_result" + index} onPress={()=>{this._onSearchResultPress(item)}}>
          <View style={styles.searchResultContainer}>
            <Image
              source={require("../../../assets/images/doctor_certifi_hospital.png")}
            />
            <View style={styles.searchResultRightContainer}>
              <Text numberOfLines={1} style={styles.searchResultName}>{item.name}</Text>
              <Text numberOfLines={1} style={styles.searchResultAddr}>{item.address}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    })

    return (
      <View style={[styles.searchResultsContainer, searchResultsCustomStyle]}>
        <ScrollView>
        {resultView}
        </ScrollView>
      </View>
    )
  }

  renderShopInfoArea() {
    if(!this.state.showShopInfoArea || this.state.showSearchResult) {
      return null
    }

    return (
      <KeyboardAwareToolBar
        initKeyboardHeight={0}
      >
        <View style={styles.shopInfosContainer}>
          <View style={styles.shopInfoContainer}>
            <Text style={styles.shopLabelTxt}>店铺名称</Text>
            <FormInput
              onChangeText={(text) => this._onShopNameChange(text)}
              placeholder="输入店铺名称"
              underlineColorAndroid="transparent"
              containerStyle={[styles.shopInputContainerStyle]}
              inputStyle={[styles.shopInputStyle]}
              value={this.state.shopName}
            />
          </View>
          <View style={styles.shopInfoContainer}>
            <Text style={styles.shopLabelTxt}>店铺地址</Text>
            <FormInput
              onChangeText={(text) => this._onShopAddressChange(text)}
              placeholder="输入店铺地址"
              underlineColorAndroid="transparent"
              containerStyle={[styles.shopInputContainerStyle]}
              inputStyle={[styles.shopInputStyle]}
              value={this.state.shopAddress}
            />
          </View>
          <CommonButton
            titile="确定"
            onPress={this.onShopBtnPress.bind(this)}
            containerStyle={styles.shopBtnContainerStyle}
            buttonStyle={styles.shopBtnStyle}
          />
        </View>
      </KeyboardAwareToolBar>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          onMapStatusChangeFinish={this._onMapStatusChangeFinish.bind(this)}
          center={this.state.center}
          marker={this.state.marker}
          zoom={this.state.zoom}
        />

        <Image
          style={[styles.mapMarker, this.state.mapMarkerPos]}
          source={require("../../../assets/images/icon_gcoding.png")}
          onLayout={this.onMapMarkerImageLayout.bind(this)}
        />

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TouchableOpacity onPress={()=>{Actions.pop()}}>
              <Text style={styles.searchInputLeftTxt}>取消</Text>
            </TouchableOpacity>

            <FormInput
              onChangeText={(text) => this._searchTextChange(text)}
              placeholder="输入店铺的位置名称"
              underlineColorAndroid="transparent"
              containerStyle={[styles.inputContainerStyle]}
              inputStyle={[styles.inputStyle]}
              value={this.state.searchText}
              onBlur={this._onSearchInputBlur.bind(this)}
              onFocus={this._onSearchInputFocus.bind(this)}
            />

            {this.state.showClearBtn &&
              <View style={[styles.clearBtnStyle]}>
                <TouchableOpacity onPress={() => this.clearSearchInput()}>
                  <Image style={{width: 25, height: 25}} source={require('../../../assets/images/delete.png')} />
                </TouchableOpacity>
              </View>
            }

          </View>
          {this.renderSearchResult()}
        </View>

        {this.renderShopInfoArea()}


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

export default connect(mapStateToProps, mapDispatchToProps)(ShopAddressSelect)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 20,
      },
      android: {
        marginTop: 0
      }
    }),
  },
  map: {
    width: PAGE_WIDTH,
    height: MAP_HEIGHT
  },
  mapMarker: {
    position: 'absolute',
    width: 24,
    height: 24
  },
  searchContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    backgroundColor: 'white'
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: normalizeBorder(),
    borderColor: '#c8c7cc',
  },
  inputContainerStyle: {
    flex: 1,
    margin: 0,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 0,
    borderLeftWidth: normalizeBorder(),
    borderLeftColor: '#c8c7cc',
  },
  inputStyle: {
    height: normalizeH(30),
    padding: 0,
    margin: 0,
  },
  clearBtnStyle: {
    position: 'absolute',
    top: 12,
    right: 10
  },
  searchInputLeftTxt: {
    fontSize: em(16),
    color: THEME.colors.green,
  },
  noSearchResultContainer: {
    padding: 10,
    borderWidth: normalizeBorder(),
    borderColor: '#c8c7cc',
    borderTopWidth: 0
  },
  noSearchResultTxt: {
    fontSize: em(18),
    color: '#030303'
  },
  searchResultsContainer: {
    borderWidth: normalizeBorder(),
    borderColor: '#c8c7cc',
    borderTopWidth: 0
  },
  searchResultContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#c8c7cc'
  },
  searchResultRightContainer: {
    flex: 1,
    paddingLeft: 20
  },
  searchResultName: {
    fontSize: em(18),
    color: '#030303'
  },
  searchResultAddr: {
    fontSize: em(12),
    color: '#b2b2b2',
    marginTop: 5
  },
  shopInfosContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  shopInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#c8c7cc'
  },
  shopLabelTxt: {
    fontSize: em(12),
    color: '#b2b2b2',
  },
  shopInputContainerStyle: {
    flex: 1,
    margin: 0,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 0,
  },
  shopInputStyle: {
    height: normalizeH(30),
    padding: 0,
    margin: 0,
  },
  shopBtnContainerStyle: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white'
  },
  shopBtnStyle: {
    backgroundColor: THEME.colors.green
  }

})