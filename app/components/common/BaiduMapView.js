/**
 * Created by zachary on 2017/2/8.
 */
import React, {
  Component,
  PropTypes
} from 'react'

import {
  MapView,
  MapTypes,
  Geolocation,
  MapModule
} from './BaiduMap'

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions
} from 'react-native'

export default class BaiduMapView extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      mayType: MapTypes.NORMAL, //地图类型
      zoom: 15,
      center: {
        longitude: 113.981718,
        latitude: 22.542449
      },
      trafficEnabled: false,      //是否显示交通图
      baiduHeatMapEnabled: false, //是否显示热力图
      markers: [{
        longitude: 113.981718,
        latitude: 22.542449,
        title: "Window of the world"
      },{
        longitude: 113.995516,
        latitude: 22.537642,
        title: ""
      }]
    }
  }

  componentDidMount() {
  }

  _onMapClick(e) {
    console.log('BaiduMapView._onMapClick==e====', e)
    this.props.onMapClick(e)
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          trafficEnabled={this.state.trafficEnabled}
          baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
          zoom={this.state.zoom}
          mapType={this.state.mapType}
          center={this.state.center}
          marker={this.state.marker}
          markers={this.state.markers}
          style={styles.map}
          onMapStatusChangeStart={this.props.onMapStatusChangeStart}
          onMapStatusChangeFinish={this.props.onMapStatusChangeFinish}
          onMapClick={(e) => {this._onMapClick(e)}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 200,
    marginBottom: 16
  }
});