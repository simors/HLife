/**
 * Created by yangyang on 2017/1/19.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  InteractionManager,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import ScoreShow from '../common/ScoreShow'
import {fetchShopDetail} from '../../action/shopAction'
import {selectShopDetail} from '../../selector/shopSelector'

class ShopInfoCell extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchShopDetail({id: this.props.shopId})
    })
  }

  render() {
    if (!this.props.shopInfo) {
      return <View/>
    }
    return (
      <View style={styles.shopView}>
        <TouchableOpacity onPress={() => Actions.SHOP_DETAIL({id: this.props.shopId})}>
          <View style={{flexDirection: 'row', backgroundColor: 'rgba(242,242,242,0.50)'}}>
            <Image style={{width: 80, height: 80}} source={{uri: this.props.shopInfo.coverUrl}}></Image>
            <View style={{flex: 1, paddingLeft: 10, paddingTop: 16, paddingRight: 10}}>
              <Text style={{fontSize: 17, color: '#4a4a4a'}} numberOfLines={1}>{this.props.shopInfo.shopName}</Text>
              <View style={{marginTop: 12}}>
                <ScoreShow score={parseInt(this.props.shopInfo.score)} bgColor="grey"/>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let shopInfo = selectShopDetail(state, ownProps.shopId)
  console.log("shopInfo:", shopInfo)
  newProps.shopInfo = shopInfo
  return newProps
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchShopDetail,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopInfoCell)

const styles = StyleSheet.create({
  shopView: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 12,
  },
})