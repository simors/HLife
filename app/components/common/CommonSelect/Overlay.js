/**
 * Created by zachary on 2016/12/23.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class Overlay extends Component {

  static propTypes = {
    pageX: React.PropTypes.number,
    pageY: React.PropTypes.number,
    show: React.PropTypes.bool,
    overlayStyles : React.PropTypes.object
  }

  static defaultProps = {
    pageX: 0,
    pageY: 0,
    show: false,
    overlayStyles : {}
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { overlayPageX, overlayPageY, show, onPress, overlayStyles } = this.props;

    if (!show) {
      return null
    }

    return (
      <TouchableWithoutFeedback style={styles.container} onPress={onPress}>
        <View style={[styles.overlay, { top: overlayPageY, left: -overlayPageX }, overlayStyles]}>
          {this.props.children}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  overlay: {
    position: 'absolute',
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    flex : 1,
    justifyContent : "flex-start",
    backgroundColor : "rgba(0,0,0,0.5)"
  }
})