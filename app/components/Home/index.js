/**
 * Created by yangyang on 2016/12/1.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../util/Responsive'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

export default class Launch extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
       <View style={styles.header}>
         <View style={styles.leftbox}>

         </View>
         <View style={styles.title}>

         </View>
         <View style={styles.rightbox}>

         </View>
       </View>
        <View style={styles.body}>
         <View style={styles.forhealth}>
           <View style={styles.fastask}>
             <Text style={{textAlign:'center'}}>
               Welcome HLife Home
             </Text>
           </View>

           <View style={styles.findtreat}>
             <View style={styles.finddoctor}></View>

             <View style={styles.findhospital}></View>
           </View>
         </View>
        <View style={styles.annouce}>

        </View>
        <View style={styles.adverticement}>

        </View>
        <View style={styles.buttonarray}>

        </View>
        <View style={styles.daychoosen}>

        </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT
  },
  body:{
    backgroundColor:'#E5E5E5'
  },
  header:{
    paddingTop:normalizeH(20),
    width:PAGE_WIDTH,
    flexDirection:'row',
    backgroundColor:'#FAFAFA',
    opacity:0.9,
    shadowColor:'#B2B2B2',
    shadowOpacity:1,
  },
  forhealth:{
    width:PAGE_WIDTH,
    height:normalizeH(128),
    backgroundColor:'#FFFFFF',
    top:1,
  },
  fastask:{
    height:normalizeH(63),
    width:PAGE_WIDTH,
    borderBottomColor:'#E5E5E5',
    borderBottomWidth:normalizeH(3),
  },
  findtreat:{
    paddingTop:normalizeH(18),
    paddingBottom:normalizeH(9),
    width:PAGE_WIDTH,
    flexDirection:'row',
  },
  finddoctor:{
    borderRightWidth:normalizeW(3),
    borderRightColor:'#E5E5E5',
    width:normalizeW(186),
    height:normalizeH(32),
  },
  findhospital:{
    width:normalizeW(186),
    height:normalizeH(32),
  },
  annouce:{
    height:normalizeH(40),
    marginTop:normalizeH(15),
    flexDirection:'row',
  },
  adverticement:{
    width:PAGE_WIDTH,
    height:normalizeH(136),
    marginTop:normalizeH(15),

  },
  buttonarray:{
    height:normalizeH(84),
    width:PAGE_WIDTH,
    backgroundColor:'#FFFFFF',
    marginTop:normalizeH(15),

  },
  leftbox:{
    // left:normalizeW(12),
    // top:normalizeH(17),
    // width:normalizeW(40),
    // height:normalizeH(18),
    flexDirection:'row',
    flex:1,
    //justifyContent:'flex-start',
  },
  title:{
    flex:1,
    //justifyContent:'center',
    flexDirection:'row',
  },
  rightbox:{
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-end',
  },
  daychoosen:{
    backgroundColor:'#FFFFFF',
    width:PAGE_WIDTH,
  },


})