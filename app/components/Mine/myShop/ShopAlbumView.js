/**
 * Created by wanpeng on 2017/5/23.
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
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import Header from '../../common/Header'
import ImageGroupViewer from '../../common/Input/ImageGroupViewer'
import {LazyloadView} from '../../common/Lazyload'


class ShopAlbumView extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <View>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="店铺相册"
        />
        <View style={styles.body}>
          <ScrollView>
            <View style={{marginTop: normalizeH(10)}}>
              <ImageGroupViewer images={this.props.album} imageLineCnt={3} lazyName='shopAlbumList'/>
            </View>
          </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopAlbumView)

const styles = StyleSheet.create({
  body: {
    marginTop: normalizeH(64),
  },

})