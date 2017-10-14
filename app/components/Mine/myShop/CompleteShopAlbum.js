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

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class CompleteShopAlbum extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      shouldUploadImages: false,
      cancelState:false,
    }
  }

  updateCancelState() {
    this.setState({
      cancelState:!this.state.cancelState
    })
  }

  render() {
    let {albumList, inputs} = this.props
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
            <CommonButton title="下一步" />
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
    borderColor: '#B2B2B2',
  },
})