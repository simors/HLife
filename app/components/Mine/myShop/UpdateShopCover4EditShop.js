/**
 * Created by zachary on 2017/1/10.
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
import Symbol from 'es6-symbol'
import {Actions} from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as appConfig from '../../../constants/appConfig'
import Header from '../../common/Header'
import ImageInput from '../../common/Input/ImageInput'
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import * as Toast from '../../common/Toast'
import {fetchUserOwnedShopInfo} from '../../../action/shopAction'
import {selectUserOwnedShopInfo} from '../../../selector/shopSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')
const shopCoverInput = {
  formKey: commonForm,
  stateKey: Symbol('shopCoverInput'),
  type: 'shopCoverInput'
}


class UpdateShopCover4EditShop extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      // this.props.fetchUserOwnedShopInfo()
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {

    })
  }

  componentWillReceiveProps(nextProps) {

  }

  updateShopCover() {
    console.log('updateShopCover==>>', this.localCoverImgUri)

    Actions.pop({
      refresh: {
        localCoverImgUri: this.localCoverImgUri,
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="text"
          leftText="取消"
          leftPress={() => Actions.pop()}
          title="编辑封面"
          rightType="text"
          rightText="完成"
          rightPress={()=>{this.updateShopCover()}}
        />
        <View style={styles.body}>
          <View style={{}}>
            <ImageInput
              {...shopCoverInput}
              containerStyle={{width: PAGE_WIDTH, height: normalizeH(156),borderWidth:0}}
              addImageBtnStyle={{top:0, left: 0, width: PAGE_WIDTH, height: normalizeH(156)}}
              choosenImageStyle={{width: PAGE_WIDTH, height: normalizeH(156)}}
              imageWidth={PAGE_WIDTH*2}
              imageHeight={normalizeH(156)*2}
              addImage={require('../../../assets/images/default_upload.png')}
              closeModalAfterSelectedImg={true}
              initValue={
                this.props.localCoverImgUri || this.props.userOwnedShopInfo.coverUrl
              }
              imageSelectedChangeCallback={(localImgUri)=>{this.localCoverImgUri = localImgUri}}
            />
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const userOwnedShopInfo = selectUserOwnedShopInfo(state)
  return {
    userOwnedShopInfo: userOwnedShopInfo
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  submitInputData,
  fetchUserOwnedShopInfo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UpdateShopCover4EditShop)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green,
    paddingTop: 20,
    height: 64,
  },
  headerLeftStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  headerRightStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    backgroundColor: '#fff'
  },

})