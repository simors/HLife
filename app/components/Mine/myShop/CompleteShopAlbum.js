/**
 * Created by yangyang on 2017/10/13.
 */
import React, {PureComponent} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  InteractionManager,
  ScrollView,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import {Actions} from 'react-native-router-flux'
import THEME from '../../../constants/themes/theme1'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import ImageGroupInput from '../../common/Input/ImageGroupInput'
import {getInputData} from '../../../selector/inputFormSelector'
import Popup from '@zzzkk2009/react-native-popup'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class CompleteShopAlbum extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      cancelState:false,
    }
  }

  updateCancelState() {
    this.setState({
      cancelState:!this.state.cancelState
    })
  }

  jumpNext() {
    if (!this.localAlbumList || this.localAlbumList.length == 0) {
      Popup.confirm({
        title: '系统提示',
        content: '请添加店铺相册',
        ok: {
          text: '确定',
          style: {color: THEME.base.mainColor},
          callback: ()=> {
          }
        },
      })
      return
    }
    let payload = {
      form: this.props.form,
      inputs: this.props.inputs,
    }
    Actions.COMPLETE_SHOP_BASE_INFO(payload)
  }

  render() {
    let {albumList, inputs} = this.props
    if (albumList && albumList.length > 0) {
      this.localAlbumList = albumList
    }
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="上传店铺相册"
          rightType="none"
        />
        <View style={styles.body}>
          <View style={{flex: 1, marginTop: normalizeH(10)}}>
            <ScrollView automaticallyAdjustContentInsets={false} style={{flex: 1}}>
              <ImageGroupInput
                {...inputs.shopAlbumInput}
                updateCancelState={()=>{this.updateCancelState()}}
                cancelState ={this.state.cancelState}
                number={20}
                imageLineCnt={2}
                initValue={this.localAlbumList || albumList}
                getImageList={(imgList)=>{this.localAlbumList = imgList}}
              />
            </ScrollView>
          </View>
          <View style={styles.nextBtnView}>
            <CommonButton title="下一步" onPress={() => this.jumpNext()}/>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let {inputs} = ownProps
  let albumStateKey = inputs.shopAlbumInput.stateKey
  let inputData = getInputData(state, ownProps.form, albumStateKey)
  return {
    albumList: inputData.text,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CompleteShopAlbum)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    justifyContent: 'space-between',
  },
  nextBtnView: {
    height: normalizeH(80),
    marginBottom: 0,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#E9E9E9',
  },
})