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
      numberOfLines: this.props.showLines,
    }

    this.showLinesHeight = this.props.showLinesHeight || 100
  }

  _onCommentTextLayout(event) {
    const evtHeight = event.nativeEvent.layout.height
    // console.log('this.showLinesHeight===', this.showLinesHeight)
    // console.log('evtHeight===', evtHeight)
    if(evtHeight > this.showLinesHeight) {
      this.setState({
        showExpander: true,
      })
    }
  }

  _toggleExpander() {
    this.setState({
      numberOfLines: this.state.expander ? undefined : this.props.showLines,
      expander: !this.state.expander,
    })
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Text numberOfLines={this.state.numberOfLines} style={[styles.commentContent, this.props.textStyle]}>{this.props.content}</Text>
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

Expander.defaultProps = {
  showLines: 5,
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