/**
 * Created by wanpeng on 2017/6/8.
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
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import Header from '../../common/Header'
import ImageGroupInput from '../../common/Input/ImageGroupInput'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height


let shopGoodAlbumForm = Symbol('shopGoodAlbumForm')

const shopGoodAlbumInput = {
  formKey: shopGoodAlbumForm,
  stateKey: Symbol('shopGoodAlbumInput'),
  type: 'shopGoodAlbumInput'
}

class UpdateShopGoodAlbum extends Component {
  constructor(props) {
    super(props)
  }

  updateAlbum() {
    Actions.pop({
      refresh: {
        albums: this.albums,
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="选取商品相册"
          rightType="text"
          rightText="完成"
          rightPress={()=>{this.updateAlbum()}}
        />
        <View style={styles.body}>
          <View style={{marginTop: normalizeH(15)}}>
            <ImageGroupInput
              {...shopGoodAlbumInput}
              number={9}
              imageLineCnt={3}
              initValue={this.props.albums}
              getImageList={(localAlbums) => {this.albums = localAlbums}}
            />
          </View>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateShopGoodAlbum)

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
  },

})