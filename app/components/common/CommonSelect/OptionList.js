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

      width: 0,
      height: 0,

      overlayPageX: 0,
      overlayPageY: 0,

      positionX: 0,
      positionY: 0,

      optionListHeight: 150,

      items: [],
      onSelect: () => { }
    }
  }

  _toggle(show, items, positionX, positionY, width, height, optionListHeight, overlayPageX, onSelect) {
    positionX = positionX - this.state.overlayPageX
    positionY = positionY - this.state.overlayPageY

    this.setState({
      ...this.state,
      positionX,
      positionY,
      overlayPageX,
      width,
      height,
      items,
      onSelect,
      optionListHeight,
      show: show
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
      items, overlayPageX, overlayPageY, positionX,
      positionY, width, height, show, optionListHeight
    } = this.state

    overlayPageY = height
    positionY = positionY

    const {overlayStyles} = this.props
    return (
      <Overlay
        overlayPageX={overlayPageX}
        overlayPageY={overlayPageY}
        show={show}
        onPress={ this._onOverlayPress.bind(this) }
        overlayStyles = {overlayStyles} >
        <Items
          items={items}
          positionX={positionX}
          positionY={positionY}
          optionListHeight={optionListHeight}
          width={width}
          height={height}
          show={show}
          onPress={ this._onItemPress.bind(this) }/>
      </Overlay>
    )
  }

}