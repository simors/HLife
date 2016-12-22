/**
 * Created by zachary on 2016/12/16.
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  WebView,
  Platform
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Header from './Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

export default class CommonWebView extends Component {

  renderHeader() {
    if(this.props.showHeader) {
      return(
        <View>
          <Header
            headerContainerStyle={styles.headerContainerStyle}
            leftType={this.props.headerLeftType}
            leftIconName={this.props.headerLeftIconName}
            leftIconLabel={this.props.headerLeftIconLabel}
            leftImageSource={this.props.headerLeftImageSource}
            leftImageLabel={this.props.headerLeftImageLabel}
            leftText={this.props.headerLeftText}
            leftPress={this.props.headerLeftPress}
            title={this.props.headerTitle}
            rightType={this.props.headerRightType}
            rightImageSource={this.props.headerRightImageSource}
            rightPress={this.props.headerRightPress}
          />
          <View style={{marginTop: normalizeH(44)}} />
        </View>
      )
    }
  }

  render() {
    return(
      <View style={styles.container}>
        {this.renderHeader()}
        <WebView
          source={this.props.html ? {html: this.props.html} : {uri: this.props.url} }
          scrollEnabled={true}
          automaticallyAdjustContentInsets={true}
          style={{
            flex: 1,
            backgroundColor: 'white'
          }}
        />
      </View>
    )
  }
}

CommonWebView.defaultProps = {
  showHeader: false,
  headerLeftType: 'icon',
  leftIconName: 'ios-arrow-back',
  headerLeftIconLabel: '返回',
  headerLeftPress: () => Actions.pop()
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(20),
      }
    }),
  },
  headerContainerStyle: {
    ...Platform.select({
      ios: {
        paddingTop: 0,
        height: normalizeH(44)
      }
    })
  }
})