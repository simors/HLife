/**
 * Created by zachary on 2016/12/23.
 */
import React, {Component} from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Text,
  Easing,
  Animated,
} from 'react-native'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)

export default class Items extends Component {

  static propTypes = {
    positionX: React.PropTypes.number,
    positionY: React.PropTypes.number,
    show: React.PropTypes.bool,
    onPress: React.PropTypes.func
  }

  static defaultProps = {
    width: 0,
    height: 0,
    positionX: 0,
    positionY: 0,
    show: false,
    onPress: () => {}
  }

  constructor(props) {
    super(props)
    this.state = {
      height : new Animated.Value(0)
    }
  }

  componentDidMount() {
    const { height } = this.props

    Animated.timing(this.state.height, {
      toValue: height * 3,
      duration: 200,
      easing :  Easing.linear
    }).start()
  }

  render() {
    const { items, positionX, positionY, show, onPress, width, height, optionListHeight } = this.props

    if (!show) {
      return null;
    }

    const renderedItems = React.Children.map(items, (item) => {

      return (
        <TouchableWithoutFeedback onPress={() => onPress(item.props.children, item.props.value) }>
          <View>
            {item}
          </View>
        </TouchableWithoutFeedback>
      )
    })

    return (
      <View style={[styles.container, {height: normalizeH(optionListHeight)}]}>
        <AnimatedScrollView
          style={{ height: this.state.height}}
          automaticallyAdjustContentInsets={false}
          bounces={false}>
          {renderedItems}
        </AnimatedScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor : "#fff"
  }
})