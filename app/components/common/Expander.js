/**
 * Created by zachary on 2017/1/3.
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
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager
} from 'react-native'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'

export default class Expander extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showExpander: false,
      expander: true,
      numberOfLines: 5,
    }
  }

  _onCommentTextLayout(event) {
    const evtHeight = event.nativeEvent.layout.height
    if(evtHeight > 100) {
      this.setState({
        showExpander: true,
      })
    }
  }

  _toggleExpander() {
    this.setState({
      numberOfLines: this.state.expander ? undefined : 5,
      expander: !this.state.expander,
    })
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Text numberOfLines={this.state.numberOfLines} style={[styles.commentContent]}>{this.props.content}</Text>
        <Text onLayout={this._onCommentTextLayout.bind(this)} style={[styles.commentContent, {position:'absolute', left:-9999}]}>{this.props.content}</Text>
        {this.state.showExpander
          ? <TouchableWithoutFeedback onPress={this._toggleExpander.bind(this)}>
          <View>
            <Text style={[styles.expanderTxt, this.props.expanderTextStyle]}>{this.state.expander ? '全文' : '收起'}</Text>
          </View>
        </TouchableWithoutFeedback>
          : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentContent: {
    fontSize: em(15),
    color: THEME.colors.lessDark,
  },
  expanderTxt: {
    color: THEME.colors.green,
    lineHeight: 20,
    fontSize: em(12)
  },
})