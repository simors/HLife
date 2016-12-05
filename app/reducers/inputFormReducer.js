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
    case uiTypes.INPUTFORM_DESTROY:
      return inputFormOnDestroy(state, action)
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
  let input = new InputRecord({formKey: formKey, stateKey: stateKey, type: payload.type})
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

  let path = [formKey, "inputs", stateKey, 'data', 'text']
  state = state.updateIn(path, {}, text => payload.text)
  return state
}

function inputFormOnDestroy(state, action) {
  let formKey = action.payload.formKey
  state = state.delete(formKey)
  return state
}