import React ,{Component}from 'react'

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ViewPagerAndroid,
  Platform,
  Dimensions,
  Image,

} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
const PAGE_WIDTH=Dimensions.get('window').width

export default class Channel extends Component{
  constructor(props) {
    super(props)

  }
  render(){
      return(
        <View style={[styles.defaultContainerstyle,this.props.containerStyle]}>
          <Image style={[styles.defaultImageStyles,this.props.imageStyle]} source={this.props.imageSource}>
          </Image>
          <Text style={[styles.defaultTitleStyle,this.props.titleStyle]}>{this.props.titleSource}
          </Text>
        </View>
      )
    }


}
Channel.defaultprops={
  defaultContainerstyle:{},
  defaultImageStyles:{},
  defaultTitleStyle:{},
  imageSource: require('../../assets/images/default_picture.png'),
  titleSource: "频道",
}
const styles=StyleSheet.create({
  defaultContainerstyle:{
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height:normalizeH(57),
    width:normalizeW(35),
    //border:0,
    overflow:'hidden',
  },
  defaultTitleStyle:{
    height:normalizeH(18),
    marginTop:normalizeH(4),
    width:normalizeW(31),
    color:'#929292',
    fontSize:normalizeH(15),

  },
  defaultImageStyles:{
    height:normalizeH(35),
    width:normalizeW(35),

  }
})