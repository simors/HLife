/**
 * Created by zachary on 2016/12/22.
 */
'use strict'

import * as Responsive from './Responsive'
import THEME from '../constants/themes/theme1'

export function triAngle(params) {
  let direction = (params && params.direction) || 'up'
  let color = (params && params.color) || THEME.colors.light
  let width = (params && params.width) || 20
  let height = (params && params.height) || 20


  if(direction == 'right') {
    return {
      height: 0,
      width: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: Responsive.normalizeBorder(height),
      borderLeftColor: color,
      borderBottomWidth: Responsive.normalizeBorder(width),
      borderBottomColor: 'transparent',
      borderTopWidth: Responsive.normalizeBorder(width),
      borderTopColor: 'transparent',
      borderRightWidth: 0,
    }
  }else if(direction == 'right-down') {
    return {
      height: 0,
      width: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: Responsive.normalizeBorder(height),
      borderLeftColor: color,
      borderBottomWidth: Responsive.normalizeBorder(width),
      borderBottomColor: 'transparent',
      borderTopWidth: Responsive.normalizeBorder(width),
      borderTopColor: 'transparent',
      borderRightWidth: 0,
      transform: [{rotate:'45deg'}]
    }
  }else if(direction == 'right-up') {
    return {
      height: 0,
      width: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: Responsive.normalizeBorder(height),
      borderLeftColor: color,
      borderBottomWidth: Responsive.normalizeBorder(width),
      borderBottomColor: 'transparent',
      borderTopWidth: Responsive.normalizeBorder(width),
      borderTopColor: 'transparent',
      borderRightWidth: 0,
      transform: [{rotate:'-45deg'}]
    }
  }else if(direction == 'left') {
    return {
      height: 0,
      width: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderRightWidth: Responsive.normalizeBorder(height),
      borderRightColor: color,
      borderBottomWidth: Responsive.normalizeBorder(width),
      borderBottomColor: 'transparent',
      borderTopWidth: Responsive.normalizeBorder(width),
      borderTopColor: 'transparent',
      borderLeftWidth: 0,
    }
  }else if(direction == 'left-down') {
    return {
      height: 0,
      width: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderRightWidth: Responsive.normalizeBorder(height),
      borderRightColor: color,
      borderBottomWidth: Responsive.normalizeBorder(width),
      borderBottomColor: 'transparent',
      borderTopWidth: Responsive.normalizeBorder(width),
      borderTopColor: 'transparent',
      borderLeftWidth: 0,
      transform: [{rotate:'-45deg'}]
    }
  }else if(direction == 'left-up') {
    return {
      height: 0,
      width: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderRightWidth: Responsive.normalizeBorder(height),
      borderRightColor: color,
      borderBottomWidth: Responsive.normalizeBorder(width),
      borderBottomColor: 'transparent',
      borderTopWidth: Responsive.normalizeBorder(width),
      borderTopColor: 'transparent',
      borderLeftWidth: 0,
      transform: [{rotate:'45deg'}]
    }
  }else if(direction == 'up') {
    return {
      height: 0,
      width: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderRightWidth: Responsive.normalizeBorder(height),
      borderRightColor: 'transparent',
      borderLeftWidth: Responsive.normalizeBorder(height),
      borderLeftColor: 'transparent',
      borderBottomWidth: Responsive.normalizeBorder(width),
      borderBottomColor: color,
      borderTopWidth: 0,
    }
  }else if(direction == 'down') {
    return {
      height: 0,
      width: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderRightWidth: Responsive.normalizeBorder(height),
      borderRightColor: 'transparent',
      borderLeftWidth: Responsive.normalizeBorder(height),
      borderLeftColor: 'transparent',
      borderTopWidth: Responsive.normalizeBorder(width),
      borderTopColor: color,
      borderBottomWidth: 0,
    }
  }
}
