/**
 * Created by yangyang on 2016/12/3.
 */
import {InputRecord, InputFormRecord} from '../models/inputFormModel'
import Immutable, {Map} from 'immutable'
import * as uiTypes from '../constants/uiActionTypes'

// (formKey, form)
const initialState = Map({})

export default function
  inputFormReducer(state = initialState, action) {
  switch (action.type) {
    case uiTypes.INPUTFORM_INIT_STATE:
      return inputFromInit(state, action)
    case uiTypes.INPUTFORM_ON_CHANGE:
      return inputFormOnChange(state, action)
    case uiTypes.INPUTFORM_DESTROY:
      return inputFormOnDestroy(state, action)
    case uiTypes.INPUTFORM_VALID_CHECK:
      return checkInputFormValid(state, action)
    default:
      return state
  }
}

function inputFromInit(state, action) {
  let payload = action.payload
  let formKey = payload.formKey
  let form = state.get(formKey)
  if (!form) {
    form = new InputFormRecord({formKey: formKey})
    state = state.setIn([formKey], form)
  }
  let stateKey = payload.stateKey
  let input
  if (payload.initValue && payload.initValue.text && 0 < payload.initValue.text.length) {
    input = new InputRecord({
      formKey: formKey,
      stateKey: stateKey,
      type: payload.type,
      validCallback: payload.checkValid,
      data: Immutable.fromJS(payload.initValue),
    })
  } else {
    input = new InputRecord({
      formKey: formKey,
      stateKey: stateKey,
      type: payload.type,
      validCallback: payload.checkValid,
      data: undefined,
    })
  }
  let inputs = form.get("inputs")
  inputs = inputs.setIn([stateKey], input)
  form = form.set("inputs", inputs)
  state = state.setIn([formKey], form)

  if ((payload.initValue && payload.initValue.text && 0 < payload.initValue.text.length) ||
      (payload.checkValid)){
    state = checkInputValid(state, formKey, stateKey, payload.initValue)
  }
  return state
}

function inputFormOnChange(state, action) {
  let payload = action.payload
  let formKey = payload.formKey
  let stateKey = payload.stateKey

  let path = [formKey, "inputs", stateKey, 'data']
  state = state.updateIn(path, {}, text => Immutable.fromJS(payload.data))

  // 校验input组件并更新state
  state = checkInputValid(state, formKey, stateKey, payload.data)
  return state
}

function inputFormOnDestroy(state, action) {
  let formKey = action.payload.formKey
  state = state.delete(formKey)
  return state
}

function checkInputValid(state, formKey, stateKey, data) {
  let input = state.getIn([formKey, 'inputs', stateKey])
  let validCallback = input.get('validCallback')
  let isValid = false
  let errMsg = ''
  if (validCallback) {
    let valid = validCallback(data)
    isValid = valid.isVal
    errMsg = valid.errMsg
  }
  state = state.updateIn([formKey, "inputs", stateKey, 'dataValid'], val => isValid)
  state = state.updateIn([formKey, "inputs", stateKey, 'invalidMsg'], val => errMsg)

  return state
}

function checkInputFormValid(state, action) {
  let formKey = action.payload.formKey
  let inputs = state.getIn([formKey, 'inputs'])
  if (!inputs) {
    return state
  }
  let originalLen = inputs.size
  let invalidMsg = ''
  inputs = inputs.filter((val, key) => {
        let inputValid = val.get('dataValid')
        if(invalidMsg == '' && !inputValid) {
          invalidMsg = val.get('invalidMsg')
        }
        return inputValid
  })
  if (inputs.size === originalLen) {
    state = state.updateIn([formKey, 'dataReady'], val => true)
    state = state.updateIn([formKey, 'error'], val => '表单数据校验通过')
  }
  else{
    state = state.updateIn([formKey, 'dataReady'], val => false)
    state = state.updateIn([formKey, 'error'], val => invalidMsg)
  }
  return state
}