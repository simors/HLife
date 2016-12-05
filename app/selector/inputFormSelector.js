/**
 * Created by yangyang on 2016/12/4.
 */
import {Map} from 'immutable'

export function getInputData(state, formKey, stateKey) {
  let inputs = state.UI.INPUTFORM.getIn([formKey, 'inputs'])
  console.log(inputs)
  // let inputs = form.get('inputs')
  // let input = inputs.getIn([stateKey])
  return inputs
}