/**
 * Created by zachary on 2016/12/22.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View
} from 'react-native'

import THEME from '../../constants/themes/theme1'

export default class Triangle extends Component {
  static propTypes = {
    direction: React.PropTypes.oneOf(['up', 'right', 'down', 'left', 'right-up', 'right-down', 'left-up', 'left-down']),
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    color: React.PropTypes.string,
  }

  static defaultProps = {
    direction: 'right-down',
    width: 15,
    height: 15,
    color: THEME.colors.lighterB,
  }
  
  constructor(props) {
    super(props)
  }

  _borderStyles() {
    if (this.props.direction == 'up') {
      return {
        borderTopWidth: 0,
        borderRightWidth: this.props.width/2.0,
        borderBottomWidth: this.props.height,
        borderLeftWidth: this.props.width/2.0,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: this.props.color,
        borderLeftColor: 'transparent',
      };
    } else if (this.props.direction == 'right') {
      return {
        borderTopWidth: this.props.height/2.0,
        borderRightWidth: 0,
        borderBottomWidth: this.props.height/2.0,
        borderLeftWidth: this.props.width,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: this.props.color,
      };
    } else if (this.props.direction == 'down') {
      return {
        borderTopWidth: this.props.height,
        borderRightWidth: this.props.width/2.0,
        borderBottomWidth: 0,
        borderLeftWidth: this.props.width/2.0,
        borderTopColor: this.props.color,
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
      };
    } else if (this.props.direction == 'left') {
      return {
        borderTopWidth: this.props.height/2.0,
        borderRightWidth: this.props.width,
        borderBottomWidth: this.props.height/2.0,
        borderLeftWidth: 0,
        borderTopColor: 'transparent',
        borderRightColor: this.props.color,
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
      };
    } else if (this.props.direction == 'left-up') {
      return {
        borderTopWidth: this.props.height,
        borderRightWidth: this.props.width,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderTopColor: this.props.color,
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
      };
    } else if (this.props.direction == 'left-down') {
      return {
        borderTopWidth: this.props.height,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: this.props.width,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: this.props.color,
      };
    } else if (this.props.direction == 'right-up') {
      return {
        borderTopWidth: 0,
        borderRightWidth: this.props.width,
        borderBottomWidth: this.props.height,
        borderLeftWidth: 0,
        borderTopColor: 'transparent',
        borderRightColor: this.props.color,
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
      };
    } else if (this.props.direction == 'right-down') {
      return {
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: this.props.height,
        borderLeftWidth: this.props.width,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: this.props.color,
        borderLeftColor: 'transparent',
      };
    } else {
      console.error('Triangle.js wrong direction. ' + this.props.direction + ' is invalid. Must be one of: ' + ['up', 'right', 'down', 'left', 'right-up', 'left-up', 'right-down', 'left-down']);
      return {};
    }
  }

  render() {
    let borderStyles = this._borderStyles();
    return (
      <View style={[styles.triangle, borderStyles, this.props.style]}/>
    )
  }
}

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },

})