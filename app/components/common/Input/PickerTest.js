/**
 * Created by yangyang on 2016/12/18.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import MedicalLabPicker from './MedicalLabPicker'
import RegionPicker from './RegionPicker'
import Symbol from 'es6-symbol'

let formKey = Symbol('pickerForm')
const medicalPicker = {
  formKey: formKey,
  stateKey: Symbol('medicalPicker'),
  type: 'medicalPicker'
}

const regionPicker = {
  formKey: formKey,
  stateKey: Symbol('regionPicker'),
  type: 'regionPicker'
}

export default class PickerTest extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View>
        <View style={{marginTop: 30}}>
          <MedicalLabPicker {...medicalPicker}/>
        </View>
        <View style={{marginTop: 30}}>
          <RegionPicker {...regionPicker} level={3} />
        </View>
      </View>
    )
  }
}