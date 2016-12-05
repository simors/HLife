/**
 * Created by yangyang on 2016/12/3.
 */
import {InputRecord, InputFormRecord} from '../models/inputFormModel'
import {Map} from 'immutable'
import * as uiTypes from '../constants/uiActionTypes'

// (formKey, form)
const initialState = Map({})

export default function inputFormReducer(state = initialState, action) {
  switch (action.type) {
    case uiTypes.INPUTFORM_INIT_STATE:
      return inputFromInit(state, action)
    case uiTypes.INPUTFORM_ON_CHANGE:
      return inputFormOnChange(state, action)
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
  let input = new InputRecord({formKey: formKey, stateKey: stateKey})
  let inputs = form.get("inputs")
  inputs = inputs.setIn([stateKey], input)
  form = form.set("inputs", inputs)
  state = state.setIn([formKey], form)
  return state
}

function inputFormOnChange(state, action) {
  let payload = action.payload
  let formKey = payload.formKey
  let stateKey = payload.stateKey
  let form = state.get(formKey)
  let inputs = form.get("inputs")
  let input = inputs.get(stateKey)
  let data = input.get('data')
  data = data.setIn(["text"], payload.text)
  input = input.set('data', data)
  inputs = inputs.setIn([stateKey], input)
  form = form.set('inputs', inputs)
  state = state.setIn([formKey], form)
  return state
}