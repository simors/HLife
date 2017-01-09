/**
 * Created by zachary on 2016/12/23.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Easing,
  Animated,
  ScrollView
} from 'react-native'

import TimerMixin from 'react-timer-mixin'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)

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

    this.state = {
      height: 0,
      scrollViewHeight: new Animated.Value(0),
    }
  }

  animatingShow(scrollViewHeight) {
    // this.state.height = PAGE_HEIGHT
    // this.setState({
    //   height: this.state.height
    // })
    Animated.delay(260)
    Animated.timing(this.state.scrollViewHeight, {
      toValue: scrollViewHeight,
      duration: 260,
      easing: Easing.linear
    }).start()

  }
  
  animatingHide() {
    Animated.timing(this.state.scrollViewHeight, {
      toValue: 0,
      duration: 260,
      easing: Easing.linear
    }).start()
    // this.state.scrollViewHeight.addListener(({value})=>{
    //   if(!value) {
    //     this.setState({
    //       height: 0
    //     })
    //   }
    // })
    // this.setTimeout(()=>{
    //   this.setState({
    //     height: 0
    //   })
    // }, 200)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.show != nextProps.show) {
      if(!nextProps.show) {
        if(nextProps.userTouching) {
          this.animatingHide()
        }
      }else {
        this.animatingShow(nextProps.optionListHeight)
      }

    }
  }

  render() {
    const { show, userTouching, hasOverlay, overlayPageX, overlayPageY, onPress, overlayStyles} = this.props;
    // if (!show && !userTouching) {
    //   return null
    // }
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View>
          {hasOverlay
            ? <View style={[styles.overlay, { top: 0, left: -overlayPageX, height: this.state.height }, overlayStyles]}>
              </View>
            : null

          }
          <AnimatedScrollView
            style={[styles.scrollView, {top: 0, left: -overlayPageX,  height: this.state.scrollViewHeight}]}
            automaticallyAdjustContentInsets={false}
            bounces={false}>
            {this.props.children}
          </AnimatedScrollView>
        </View>

      </TouchableWithoutFeedback>
    )
  }
}

Object.assign(Overlay.prototype, TimerMixin)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    width: PAGE_WIDTH,
    backgroundColor : "rgba(0,0,0,0.5)"
  },
  scrollView: {
    position: 'absolute',
    top: 0,
    width: PAGE_WIDTH,
    backgroundColor : "#fff"
  }
})