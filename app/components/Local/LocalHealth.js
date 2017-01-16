/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
export default class LocalHealth extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.showItemStyle}
                          onPress={()=> {
                            Actions.DOCTER_FINDER()
                          }}>
          <Image style={styles.itemImageStyle} source={require("../../assets/images/local_drugstore.png")}/>
          <Text style={styles.itemTextStyle}>周边药店</Text>
        </TouchableOpacity>
        <View style={styles.lineStyle}/>
        <TouchableOpacity style={styles.showItemStyle}
                          onPress={()=> {
                            Actions.DOCTER_FINDER()
                          }}>
          <Image style={styles.itemImageStyle} source={require("../../assets/images/local_doctor.png")}/>
          <Text style={styles.itemTextStyle}>附近医生</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: normalizeH(107),
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  showItemStyle: {
    flex: 1,
    alignItems: "center",
    paddingTop: normalizeH(17)
  },
  itemImageStyle: {
    width: 40,
    height: 40
  },
  lineStyle: {
    marginTop: normalizeH(17),
    marginBottom: normalizeH(17),
    borderRightWidth: normalizeBorder(3),
    borderRightColor: '#E5E5E5',
  },
  itemTextStyle: {
    paddingTop: 15,
    fontSize: 17,
    color: "#4a4a4a",
    fontFamily: ".PingFangSC-Regular",
    letterSpacing: 0.2
  }
})