/**
 * Created by yangyang on 2016/12/4.
 */
import {Map} from 'immutable'

export function getInputByKey(state, formKey, stateKey) {
  let input = state.UI.INPUTFORM.getIn([formKey, 'inputs', stateKey])
  return input ? input : undefined
}

export function getInputData(state, formKey, stateKey) {
  let input = getInputByKey(state, formKey, stateKey)
  let data = undefined
  if (input) {
    data = input.get('data')
    return data
  }
  return {}
}

export function getInputFormData(state, formKey) {
  let inputs = state.UI.INPUTFORM.getIn([formKey, 'inputs'])
  let formData = Map()
  if (inputs) {
    inputs.map((input) => {
      let type = input.get('type')
      let data = input.get('data')
      formData = formData.set(type, data)
    })
  }
  return formData.toJS()
}