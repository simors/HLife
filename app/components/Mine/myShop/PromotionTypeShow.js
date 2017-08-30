/**
 * Created by lilu on 2017/8/29.
 */
/**
 * Created by lilu on 2017/8/4.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager,
  TextInput
} from 'react-native'
import ToolBarContent from '../../shop/ShopCommentReply/ToolBarContent'
import KeyboardAwareToolBar from '../../common/KeyboardAwareToolBar'
import {isUserLogined, activeUserInfo} from '../../../selector/authSelector'

import {connect} from 'react-redux'
import {CachedImage} from "react-native-img-cache"
import {bindActionCreators} from 'redux'
import Svg from '../../common/Svgs'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import ImageInput from '../../common/Input/ImageInput'
import ImageGroupViewer from '../../common/Input/ImageGroupViewer'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as Toast from '../../common/Toast'
import Symbol from 'es6-symbol'
import {submitFormData, submitInputData, INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {fetchShopAnnouncements,} from '../../../action/shopAction'
import MultilineText from '../../common/Input/MultilineText'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import MyShopGoodListForChoose from './MyShopGoodListForChoose'
import {
  selectUserOwnedShopInfo,
  selectShopFollowers,
  selectShopFollowersTotalCount,
  selectSimilarShopList,
  selectShopDetail, selectShopList,
  selectGuessYouLikeShopList,
  selectLatestShopAnnouncemment,
  selectUserIsFollowShop,
  selectShopComments,
  selectShopCommentsTotalCount,
  selectUserIsUpedShop,
  selectGoodsList
} from '../../../selector/shopSelector'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let shopPromotionForm = 'shopPromotionForm'
let chooseTypeInput = {
  formKey: shopPromotionForm,
  stateKey: Symbol('chooseTypeInput'),
  type: "chooseTypeInput",
}


class PromotionTypeShow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shouldUploadImage: false,
      chooseTypeId: undefined,
      hideBottomView: false,
      isChoosen: false
    }
    this.replyInput = null

  }

  componentDidMount() {
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=> {

    })
  }

  unChooseType(index) {
    this.props.unChooseType()
  }

  changeType(index) {
    this.props.changeType()
  }

  componentWillReceiveProps(nextProps) {

  }

  onButtonPress() {
    if (this.props.chooseTypeId != undefined && this.props.chooseTypeId != '') {
      Actions.PUBLISH_SHOP_PROMOTION_CHOOSE_DATE()
    } else {
      Toast.show('请选择一个活动类型')
    }
  }


  renderChoosenType(type){
    return(
     <TouchableWithoutFeedback key={'type_'+type.id} onPress={()=> {
        this.unChooseType()
      }}>
       <View style={styles.typeBox}>
         <Text style={styles.chooseTypeText}>{type.type}</Text>
           <Svg style={styles.typeSvg} size={normalizeW(165)} height={normalizeH(69)} icon="selected_act"/>
       </View>
      </TouchableWithoutFeedback>
    )
  }

  renderUnchooseType(type){
    return(
        <TouchableWithoutFeedback key={'type_'+type.id} onPress={()=> {
          this.changeType()
        }}>
          <View style={styles.typeBox}>
            <View >
              <Svg style={styles.typeSvg} size={normalizeW(165)} height={normalizeH(69)} icon="unselect_act@2x">
                <Text style={styles.unChooseTypeText}>{type.type}</Text>
              </Svg>
            </View>
          </View>
        </TouchableWithoutFeedback>
    )
  }

  renderCustomType(type){
    return(
        <TouchableWithoutFeedback key={'type_'+type.id} onPress={()=> {
          this.changeType()
        }}>
          <View style={styles.typeBox}>
            <Text style={styles.unChoose4TypeText}>{type.type}</Text>
            <View style={styles.typeSvg}>
              <Svg size={normalizeW(165)} height={normalizeH(69)} icon="custom_act"/>
            </View>
          </View>
        </TouchableWithoutFeedback>
    )
  }

  renderType(){
    let type = this.props.type

    if(this.props.isChoosen){
      return(
        <View style={{flex:1}}>
          {this.renderChoosenType(type)}
        </View>
      )
    }else {
      if(this.props.type.id!=3){
        return(
          <View style={{flex:1}}>
            {this.renderUnchooseType(type)}
          </View>
        )
      } else{
      return(
        <View style={{flex:1}}>
          {this.renderCustomType(type)}
        </View>
      )
    }
    }

  }

  render() {
    console.log('isChoosening=====>',this.props.isChoosen)
    console.log('this.props.type=====>',this.props.type)

    return (
      <View style={{flex:1}}>
    {this.renderType()}
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

export default connect(mapStateToProps, mapDispatchToProps)(PromotionTypeShow)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green,
    paddingTop: normalizeH(20),
    height: normalizeH(64),
  },
  headerLeftStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  headerTitleStyle: {
    color: '#fff',
  },
  headerRightStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15)
  },
  scrollViewStyle: {
    flex: 1,
    width: PAGE_WIDTH,
  },
  bottomWrap: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  noticeTip: {
    marginLeft: normalizeW(12),
    fontSize: em(12),
    color: '#BEBEBE'
  },
  showTextBox: {
    paddingTop: normalizeH(15),
    paddingBottom: normalizeH(15)
  },
  showText: {
    fontSize: em(15),
    color: '#5A5A5A'
  },
  noGoodText: {
    position: 'absolute',
    left: normalizeW(91),
    top: normalizeH(52),
    fontSize: em(40),
    color: 'rgba(255,120,25,0.30)',
    letterSpacing: em(0, 48),
    zIndex: 10,
  },
  addGoodBox: {
    position: 'absolute',
    left: normalizeW(108),
    top: normalizeH(128),
    flexDirection: 'row',
    zIndex: 10,
    alignItems: 'center'
  },
  addGoodText: {
    fontSize: em(15),
    color: '#FF7819',
    letterSpacing: em(0.61),

  },
  submitBtn: {
    backgroundColor: '#FF7819',
    height: normalizeH(50),
    width: normalizeW(345),
    marginLeft: normalizeW(15),
    marginTop: normalizeH(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: em(18),
    letterSpacing: -em(0.45)
  },
  unChooseTypeText: {
    fontSize: em(20),
    color: '#FF7819',
    letterSpacing: em(0.24),
    zIndex: 80,
    position:'relative',


  },
  unChoose4TypeText: {
    fontSize: em(20),
    color: 'rgba(0,0,0,0.20)',
    letterSpacing: em(0.24),
    zIndex: 80,
    position:'relative',


  },
  chooseTypeText: {
    position:'relative',
    fontSize: em(20),
    color: '#FFFFFF',
    letterSpacing: em(0.24),
    zIndex: 100
  },
  typeBox: {
    height: normalizeH(69),
    width: normalizeW(165),
    marginLeft: normalizeW(15),
    marginTop: normalizeH(12),
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  typeSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: normalizeH(69),
    width: normalizeW(165),
  }
})