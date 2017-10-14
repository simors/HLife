/**
 * Created by yangyang on 2017/10/14.
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
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {Actions} from 'react-native-router-flux'
import THEME from '../../../constants/themes/theme1'
import Header from '../../common/Header'
import CommonButton from '../../common/CommonButton'
import {getInputData} from '../../../selector/inputFormSelector'
import {
  Option,
  OptionList,
  SelectInput
} from '../../common/CommonSelect'
import TagsInput from '../../common/Input/TagsInput'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class CompleteShopTypeTags extends PureComponent {
  constructor(props) {
    super(props)
    if(Platform.OS == 'ios') {
      this.state = {
        selectShow: false,
        shopTagsSelectShow: false,
        optionListPos: 179,
        shopTagsSelectTop: 379,
        selectedShopTags: [],
        shopCategoryContainedTag: [],
      }
    }else{
      this.state = {
        selectShow: false,
        shopTagsSelectShow: false,
        optionListPos: 159,
        shopTagsSelectTop: 359,
        selectedShopTags: [],
        shopCategoryContainedTag: [],
      }
    }
  }

  _onSelectPress(e){
    this.setState({
      selectShow: !this.state.selectShow,
    })
  }

  _getOptionList(OptionListRef) {
    return this.refs[OptionListRef]
  }

  _onSelectShopCategory(shopCategoryId) {
    this.updateShopCategoryContainedTags(shopCategoryId)
    this.setState({
      selectShow: !this.state.selectShow,
      selectedShopTags: []
    })
  }

  renderShopCategoryOptions() {
    let optionsView = <View />
    if(this.props.allShopCategories) {
      optionsView = this.props.allShopCategories.map((item, index) => {
        return (
          <Option ref={"option_"+index} key={"shopCategoryOption_" + index} value={item.id}>{item.text}</Option>
        )
      })
    }
    return optionsView
  }

  toggleShopTagsSelectShow() {
    this.setState({
      shopTagsSelectShow:!this.state.shopTagsSelectShow
    })
  }

  render() {
    let {inputs} = this.props
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="设置店铺类型标签"
          rightType="none"
        />
        <View style={styles.body}>
          <View style={{marginTop: normalizeH(50)}}>
            <View style={styles.inputWrap}>
              <View style={styles.inputLabelBox}>
                <Text style={styles.inputLabel}>店铺类型</Text>
              </View>
              <View style={styles.inputBox}>
                <SelectInput
                  {...inputs.shopCategoryInput}
                  show={this.state.selectShow}
                  onPress={(e)=>this._onSelectPress(e)}
                  style={{}}
                  styleOption={{height:50}}
                  selectRef="SELECT"
                  overlayPageX={0}
                  overlayPageY={this.state.optionListPos}
                  optionListHeight={240}
                  optionListRef={()=> this._getOptionList('SHOP_CATEGORY_OPTION_LIST')}
                  defaultText={'点击选择店铺类型'}
                  defaultValue={1}
                  onSelect={this._onSelectShopCategory.bind(this)}>
                  {this.renderShopCategoryOptions()}
                </SelectInput>
              </View>
            </View>

            <View style={styles.inputWrap}>
              <View style={styles.inputLabelBox}>
                <Text style={styles.inputLabel}>店铺标签</Text>
              </View>
              <View style={[styles.inputBox, styles.tagsBox]}>
                <TagsInput
                  {...inputs.tagsInput}
                  onPress={()=>{this.toggleShopTagsSelectShow()}}
                  tags={this.state.selectedShopTags}
                  containerStyle={{height:50}}
                  noCheckInput={true}
                />
              </View>
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(CompleteShopTypeTags)

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
  inputWrap: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#F5F5F5',
    paddingLeft: normalizeW(20),
  },
  inputLabelBox: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  inputLabel: {
    fontSize: em(17),
    color: THEME.colors.inputLabel
  },
  inputBox: {
    flex: 1
  },
  tagsBox: {
    justifyContent: 'center',
  },
})