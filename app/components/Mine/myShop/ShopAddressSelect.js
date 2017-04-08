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
  InteractionManager,
  ActivityIndicator,
  Keyboard
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {abbrProvince, abbrCity} from '../../../util/Utils'

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
      currentDistrict: '',
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
      shopNameIsFocus: false,
      shopAddressIsFocus: false,
      keyboardIsShow: false,
      showLoading: false
    }

    this.currentPosition = null

  }

  componentDidMount() {

    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow)
      Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide)
    }

    InteractionManager.runAfterInteractions(() => {

    })

    this.setState({
      showLoading: true
    })
    Geolocation.getCurrentPosition()
      .then(data => {
        this.currentPosition = {
          latitude: data.latitude,
          longitude: data.longitude,
        }

        this.setState({
          showLoading: false,
          center: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
        })
        
        if (Platform.OS == 'ios') {
          this.updateInfoByLatLng(data.latitude, data.longitude)
        }else {
          this.setState({
            shopAddress: data.address,
            currentCity: data.city,
            currentDistrict: data.district
          })
        }
        // console.log('getCurrentPosition.this.state===', this.state)

      })
      .catch(e =>{
        this.setState({
          showLoading: false
        })
        console.warn(e, 'error')
      })
  }

  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {
    if (Platform.OS == 'ios') {
      Keyboard.removeListener('keyboardWillShow', this.onKeyboardWillShow)
      Keyboard.removeListener('keyboardWillHide', this.onKeyboardWillHide)
    } else {
      Keyboard.removeListener('keyboardDidShow', this.onKeyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', this.onKeyboardDidHide)
    }
  }

  onKeyboardWillShow = (e) => {
    this.setState({
      keyboardIsShow: true
    })
  }

  onKeyboardWillHide = (e) => {
    this.setState({
      keyboardIsShow: false
    })
  }

  onKeyboardDidShow = (e) => {
    console.log('onKeyboardDidShow')
    if (Platform.OS === 'android') {
      this.onKeyboardWillShow(e)
    }
  }

  onKeyboardDidHide = (e) => {
    console.log('onKeyboardDidHide')
    if (Platform.OS === 'android') {
      this.onKeyboardWillHide(e)
    }
  }

  resetPosition() {
    console.log('resetPosition..this.currentPosition===', this.currentPosition)
    if(this.currentPosition) {
      MapModule.moveToCenter(this.currentPosition.latitude, this.currentPosition.longitude, this.state.zoom)
      this.setState({
        center: {
          latitude: this.currentPosition.latitude,
          longitude: this.currentPosition.longitude,
        }
      })
    }
  }

  updateInfoByLatLng(latitude, longitude) {
    Geolocation.reverseGeoCode(latitude, longitude)
      .then(data => {
        // console.log('reverseGeoCode.data===', data)
        if(data.address) {
          this.setState({
            shopAddress: data.address,
            currentCity: abbrCity(data.city),
            currentDistrict: data.district,
          })
        }else {
          this.setState({
            shopAddress: data.province + data.city + data.district + data.streetName + data.streetNumber,
            currentCity: abbrCity(data.city),
            currentDistrict: data.district,
          })
        }
        // console.log('reverseGeoCode.this.state===', this.state)
      })
      .catch(e =>{
        console.warn(e, 'error')
      })
  }

  _onRegionDidChangeAnimated4Ios(e) {
    // console.log('_onRegionDidChangeAnimated4Ios.e====', e)
    this._onMapStatusChangeFinish4Android(e)
  }

  _onMapStatusChangeFinish4Android(e) {
    // console.log('_onMapStatusChangeFinish4Android.e====', e)
    this.updateInfoByLatLng(e.target.latitude, e.target.longitude)
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
    // console.log('_searchTextChange.text===', text)
    this.setState({
      searchText: text,
      showClearBtn: !!text
    })
    
    if(!text) {
      this.clearSearchInput()
      return
    }

    PoiSearch.requestSuggestion(this.state.currentCity, text)
      .then(data => {
        // console.log('requestSuggestion.data===', data)
        if(data.suggestionList && data.suggestionList.length) {
          data.suggestionList.shift()
        }
        this.setState({
          showSearchResult: true,
          searchResult: {
            error: data.errcode && data.errcode,
            message: data.message && data.message,
            data: data.suggestionList || []
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

    // PoiSearch.searchInCityProcess(this.state.currentCity, text, 1)
    //   .then(data => {
    //     // console.log('searchInCityProcess.data===', data)
    //     this.setState({
    //       showSearchResult: true,
    //       searchResult: {
    //         error: data.errcode && data.errcode,
    //         message: data.message && data.message,
    //         data: data.poiResult && data.poiResult.poiInfos
    //       }
    //     })
    //   })
    //   .catch(e =>{
    //     console.warn(e, 'error')
    //     this.setState({
    //       showSearchResult: true,
    //       searchResult: {
    //         error: -9,
    //         message: '查询异常,请稍候再试!',
    //         data: []
    //       }
    //     })
    //   })
    
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

  _onSearchResultPress(item) {
    // console.log('_onSearchResultPress.item====', item)
    this.setState({
      showSearchResult: false,
      shopName: item.key,
      searchText: item.key,
      currentCity: item.city,
      currentDistrict: item.district,
      center: {
        latitude: item.latitude,
        longitude: item.longitude
      }
    })

    Geolocation.reverseGeoCode(parseFloat(item.latitude), parseFloat(item.longitude))
      .then(data => {
        // console.log('_onSearchResultPress.data====', data)
        this.setState({
          shopAddress: data.address
        })
      })

    // if(this.state.center) {
    //   if(!this.state.currentCity) {
    //     Geolocation.reverseGeoCode(this.state.center.latitude, this.state.center.longitude)
    //       .then(data => {
    //         // console.log('_onSearchResultPress.reverseGeoCode.data===', data)
    //         this.setState({
    //           currentCity: abbrCity(data.city),
    //           currentDistrict: data.district,
    //         }, ()=>{
    //           this.getGeoCode()
    //         })
    //       })
    //       .catch(e =>{
    //         console.warn(e, 'error')
    //       })
    //   }else {
    //     this.getGeoCode()
    //   }
    // }

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
          })
        }
      })
      .catch(e =>{
        console.warn(e, 'error')
      })
  }

  _onSearchInputBlur() {
    // this.setState({
    //   showShopInfoArea: true,
    // })
  }

  _onSearchInputFocus() {
    if(typeof this.state.searchResult.error === 'number') {
      this.setState({
        showSearchResult: true,
      })
    }
    // this.setState({
    //   showShopInfoArea: false,
    // })
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

    // console.log('onShopBtnPress.this.state===', this.state)
    Actions.pop({
      refresh: {
        shopName: this.state.shopName,
        shopAddress: this.state.shopAddress,
        currentCity: this.state.currentCity,
        currentDistrict: this.state.currentDistrict,
        latitude: this.state.center.latitude,
        longitude: this.state.center.longitude,

      }
    })
  }

  renderSearchResult() {
    // console.log('renderSearchResult==this.state.searchResult===', this.state.searchResult)

    if(!this.state.showSearchResult) {
      return null
    }

    if(this.state.searchResult.error != 0 || !this.state.searchResult.data.length) {
      return (
        <View style={styles.noSearchResultContainer}>
          <Text style={styles.noSearchResultTxt}>未找到结果</Text>
        </View>
      )
    }

    if(!this.state.searchResult.data) {
      return null
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
              <Text numberOfLines={1} style={styles.searchResultName}>{item.key}</Text>
              <Text numberOfLines={1} style={styles.searchResultAddr}>{item.city + item.district}</Text>
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

  _onShopNameBlur() {
    // console.log('_onShopNameBlur')
    this.setState({
      shopNameIsFocus: false
    })
  }

  _onShopNameFocus() {
    // console.log('_onShopNameFocus')
    this.setState({
      shopNameIsFocus: true
    })
  }

  _onShopAddressBlur() {
    this.setState({
      shopAddressIsFocus: false
    })
  }

  _onShopAddressFocus() {
    this.setState({
      shopAddressIsFocus: true
    })
  }

  renderToolBarContent() {
    if(this.state.showSearchResult && this.state.searchResult.error == 0) {
      return null
    }

    return (
      <View style={{flex:1}}>
        {false &&
          <View style={{position:'absolute',left:15,top:-60}}>
            <TouchableOpacity onPress={()=>{this.resetPosition()}}>
              <Image source={require('../../../assets/images/now_location.png')}/>
            </TouchableOpacity>
          </View>
        }

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
              onBlur={this._onShopNameBlur.bind(this)}
              onFocus={this._onShopNameFocus.bind(this)}
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
              onBlur={this._onShopAddressBlur.bind(this)}
              onFocus={this._onShopAddressFocus.bind(this)}
            />
          </View>
          <CommonButton
            titile="确定"
            onPress={this.onShopBtnPress.bind(this)}
            containerStyle={styles.shopBtnContainerStyle}
            buttonStyle={styles.shopBtnStyle}
          />
        </View>
      </View>
    )
  }

  renderShopInfoArea() {
    return (
      <KeyboardAwareToolBar
        initKeyboardHeight={0}
      >
        {this.renderToolBarContent()}
      </KeyboardAwareToolBar>
    )
  }

  renderLoading() {
    if(this.state.showLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            animating={true}
            size="small"
            color={'#C8C8C8'}
          />
          <Text style={styles.loadingText}>{'定位中...'}</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          onMapStatusChangeFinish={this._onMapStatusChangeFinish4Android.bind(this)}
          onRegionDidChangeAnimated={this._onRegionDidChangeAnimated4Ios.bind(this)}
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

        {this.renderLoading()}

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
  },
  loadingContainer: {
    position: 'absolute',
    top: MAP_HEIGHT / 2 - normalizeH(80),
    left: PAGE_WIDTH / 2 - normalizeW(50),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 3
  },
  loadingText: {
    color: 'white'
  }

})