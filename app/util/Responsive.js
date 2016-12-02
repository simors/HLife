'use strict'

import React, {Component} from 'react'
import {
  Dimensions
} from 'react-native'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const IPHONE6_PAGE_WIDTH = 375
const IPHONE6_PAGE_HEIGHT = 667

const RATIO_WIDTH = PAGE_WIDTH / 375
const RATIO_HEIGHT = PAGE_HEIGHT / 667

export function em(value) {
  return RATIO_WIDTH * value
}

export function normalizeW(value) {
  return RATIO_WIDTH * value
}

export function normalizeH(value) {
  return RATIO_HEIGHT * value
}
