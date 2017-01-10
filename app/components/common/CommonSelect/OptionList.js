/**
 * Created by zachary on 2016/12/23.
 */
import React, {Component} from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native'

import Overlay from './Overlay'
import Items from './Items'

export default class OptionList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      userTouching: false,
      hasOverlay: false,

      width: 0,
      height: 0,

      overlayPageX: 0,
      overlayPageY: 0,

      positionX: 0,
      positionY: 0,

      optionListHeight: 120,

      items: [],
      selectedText: '',
      selectedValue: '',
      onSelect: () => { }
    }
    
  }

  _toggle(show, hasOverlay, userTouching, items, selectedText, selectedValue, positionX, positionY, width, height, optionListHeight, overlayPageX, overlayPageY, onSelect) {
    positionX = positionX - this.state.overlayPageX
    positionY = positionY - this.state.overlayPageY
    this.setState({
      positionX,
      positionY,
      overlayPageX,
      overlayPageY,
      width,
      height,
      items,
      selectedText,
      selectedValue,
      onSelect,
      optionListHeight,
      show: !!show,
      userTouching: !!userTouching,
      hasOverlay: hasOverlay !== false
    })
  }

  _onOverlayPress() {
    const { onSelect } = this.state;
    onSelect(null, null);

    this.setState({
      ...this.state,
      show: false
    })
  }

  _onItemPress(item, value) {
    const { onSelect } = this.state;
    onSelect(item, value);

    this.setState({
      ...this.state,
      show: false
    })
  }

  _blur() {
    this.setState({
      ...this.state,
      show : false
    })
  }

  render() {
    let {
      items, selectedText, selectedValue, overlayPageX, overlayPageY, positionX,
      positionY, width, height, show, optionListHeight, userTouching, hasOverlay
    } = this.state

    if(!overlayPageY) {
      overlayPageY = height
    }
    const {overlayStyles} = this.props
    // console.log('OptionList==this.state====', this.state)
    return (
      <Overlay
        overlayPageX={overlayPageX}
        overlayPageY={overlayPageY}
        show={show}
        userTouching={userTouching}
        hasOverlay={hasOverlay}
        optionListHeight={optionListHeight}
        onPress={ this._onOverlayPress.bind(this) }
        overlayStyles = {overlayStyles} >
        <Items
          items={items}
          selectedText={selectedText}
          selectedValue={selectedValue}
          positionX={positionX}
          positionY={positionY}
          optionListHeight={optionListHeight}
          width={width}
          height={height}
          show={show}
          userTouching={userTouching}
          onPress={ this._onItemPress.bind(this) }/>
      </Overlay>
    )
  }

}