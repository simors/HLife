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
      optionListHeight: 0
    }
  }

  animatingShow(scrollViewHeight, hasOverlay) {
    if(hasOverlay) {
      this.state.height = PAGE_HEIGHT
      this.setState({
        height: this.state.height
      })
    }
    // Animated.timing(this.state.scrollViewHeight, {
    //   toValue: scrollViewHeight,
    //   duration: 200,
    //   easing: Easing.linear
    // }).start()

  }
  
  animatingHide(hasOverlay) {
    this.setState({
      height: 0
    })
    // Animated.timing(this.state.scrollViewHeight, {
    //   toValue: 0,
    //   duration: 200,
    //   easing: Easing.linear
    // }).start()
    // if(hasOverlay) {
    //   this.state.scrollViewHeight.addListener(({value})=>{
    //     if(!value) {
    //       this.setState({
    //         height: 0
    //       })
    //     }
    //   })
      // this.setTimeout(()=>{
      //   this.setState({
      //     height: 0
      //   })
      // }, 200)
    // }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.show != nextProps.show) {
      if(!nextProps.show) {
        if(nextProps.userTouching) {
          this.animatingHide(nextProps.hasOverlay)
          this.setState({
            optionListHeight:0
          })
        }
      }else {
        this.animatingShow(nextProps.optionListHeight, nextProps.hasOverlay)
        this.setState({
          optionListHeight:nextProps.optionListHeight
        })
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
        <View
          style={[styles.scrollView, {top: overlayPageY ? overlayPageY : 40, left: -overlayPageX,  height: hasOverlay ? this.state.height : this.state.optionListHeight}]}
        >
          {hasOverlay
            ? <View style={[styles.overlay, { top: 0, left: 0, height: this.state.height }, overlayStyles]}>
              </View>
            : null

          }
          <View
            style={[styles.scrollView, {top: 0, left: 0,  height: this.state.optionListHeight}]}
          >
            <ScrollView
              style={[{height: this.state.optionListHeight}]}
              automaticallyAdjustContentInsets={false}
              bounces={false}>
              {this.props.children}
            </ScrollView>
          </View>
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
    backgroundColor : "#f2f2f2"
  }
})