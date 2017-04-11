/**
 * Created by yangyang on 2017/3/18.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import ScoreShow from '../../common/ScoreShow'

class ShopFolloweesView extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let shopInfo = this.props.shopInfo
    return (
      <View>
        <TouchableOpacity onPress={()=>{
          Actions.SHOP_DETAIL({
            id: shopInfo.id, 
            backSceneName:'MYATTENTION',
            backSceneParams: {
              tabType: 1
            }
          })
        }}>
          <View style={[styles.shopInfoWrap]}>
            <View style={styles.coverWrap}>
              <Image style={styles.cover} source={{uri: shopInfo.coverUrl}}/>
            </View>
            <View style={styles.shopIntroWrap}>
              <Text style={styles.shopName} numberOfLines={1}>{shopInfo.shopName}</Text>
              <ScoreShow
                containerStyle={{flex:1}}
                score={shopInfo.score}
              />
              <View style={styles.subInfoWrap}>
                <Text style={styles.subTxt}>{shopInfo.geoName}</Text>
                {shopInfo.distance &&
                <Text style={styles.subTxt}>{shopInfo.distance}km</Text>
                }
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
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopFolloweesView)

const styles = StyleSheet.create({
  shopInfoWrap: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  coverWrap: {
    width: 80,
    height: 80
  },
  cover: {
    flex: 1
  },
  shopIntroWrap: {
    flex: 1,
    paddingLeft: 10,
  },
  shopName: {
    fontSize: em(17),
    color: '#8f8e94'
  },
  subInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5
  },
  subTxt: {
    marginRight: normalizeW(10),
    color: '#d8d8d8',
    fontSize: em(12)
  },
})