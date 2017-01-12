/**
 * Created by lilu on 2017/1/12.
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
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager,
  Modal,

} from 'react-native'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'

export default class ShareModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animationType : this.props.animationType?this.props.animationType:'none',
      transparent : true,
      visible : false
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.modalVisible != newProps.modalVisible) {
      this.setState({visible: newProps.modalVisible})
    }
  }

  componentDidMount() {
    this.setState({visible: !!this.props.modalVisible})
  }

  render() {
    let modalBackgroundStyle ={
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#000',
    }
    return (
      <Modal
        animationType={this.state.animationType}
        transparent={this.state.transparent}
        visible={this.state.visible}
        onRequestClose={()=>{}}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {this.props.closeModal()}}
          >
            <View style={styles.closeTop}></View>
          </TouchableWithoutFeedback>
         <View style={[styles.modalContent, this.props.modalContentStyle]}>
           <View style={styles.columnWrap}>
             <View style={styles.column}>
               <Image style={styles.image} source={require('../../assets/images/share_weixin.png')}></Image>
               <Text style={styles.text}>邀请微信好友</Text>
             </View>
             <View style={styles.column}>
               <Image style={styles.image} source={require('../../assets/images/share_qq.png')}></Image>
               <Text style={styles.text}>邀请QQ好友</Text>
             </View>
             <View style={styles.column}>
               <Image style={styles.image} source={require('../../assets/images/share_weibo.png')}></Image>
               <Text style={styles.text}>分享到微博</Text>
             </View>
           </View>
           <View style={styles.columnWrap}>
             <View style={styles.column}>
               <Image style={styles.image} source={require('../../assets/images/share_link.png')}></Image>
               <Text style={styles.text}>复制链接</Text>
             </View>
             <View style={styles.column}>
               <Image style={styles.image} source={require('../../assets/images/share_friends.png')}></Image>
               <Text style={styles.text}>分享到朋友圈</Text>
             </View>
             <View style={styles.column}>
               <Image style={styles.image} source={require('../../assets/images/share_qqzome.png')}></Image>
               <Text style={styles.text}>分享到QQ空间</Text>
             </View>
           </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'rgba(0, 0, 0, 0.3)'
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff'
  },
  closeTop:{

    ...Platform.select({
      ios: {
        height: normalizeH(483),
      },
      android: {
        height: normalizeH(463)
      }
  }),
    backgroundColor:'rgba(0, 0, 0, 0.3)'
},columnWrap:{
  paddingTop:normalizeH(20),
  flex:1,
  flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  column:{
    flexDirection:'column',
    flex:1,
    alignItems:'center',
  },
  image:{
    height:normalizeH(40),
    width:normalizeW(40),
    overflow:'hidden',
  },
  text:{
    marginTop:normalizeH(9),
    color:'#686868',
    fontSize:em(12),
    letterSpacing:em(0.3),
  }
})