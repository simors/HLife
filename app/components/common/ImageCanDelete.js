/**
 * Created by lilu on 2017/6/1.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class ImageCanDelete extends Component{
  constructor(props) {
    super(props)
    this.state = {
      showDelete: false
    }
  }


    renderImage(src) {
      let isCancel = false
      return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View style={[styles.defaultContainerStyle, {
            margin: 5,
            width: this.props.imgSize?this.props.imgSize:60,
            height: this.props.imgSize?this.props.imgSize:60
          }]}>
            <TouchableOpacity style={{flex: 1}} onPress={() => this.props.onPress(!this.state.imgModalShow, src)} onLongPress={()=>{
              isCancel = true
              this.setState({
                showDelete:true
              })
              {/*console.log('hahahahahah',isCancel,this.state.showDelete)*/}
            }} >
              <Image style={{flex: 1}} source={{uri: src}}/>
            </TouchableOpacity>
          </View>
          {this.renderDetele()}
        </View>
      )
    }

  renderDetele(){
    if(this.state.showDelete){
      return( <View style={{position: 'absolute', top: 0, right: 0}}>
        <TouchableOpacity onPress={() => this.deleteImageComponent(index)}>
          <Image style={{width: 30, height: 30, borderRadius: 15, overflow: 'hidden'}}
                 source={require('../../assets/images/delete.png')}/>
        </TouchableOpacity>
      </View>)
    }else
    {return null}

  }

    render(){
      let src = this.props.imgSrc
      return(
        <View>
      {this.renderImage(src)}
      </View>
      )
    }

}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: PAGE_WIDTH,
    marginLeft: 5,
    marginRight: 5,
  },
  defaultContainerStyle: {
    borderColor: '#E9E9E9',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  defaultImgShow: {
    width: normalizeW(60),
    height: normalizeH(60),
  },
  imgInputStyle: {
    maxWidth: PAGE_WIDTH,
    marginTop: 10,
    marginBottom: 10,
  },
})