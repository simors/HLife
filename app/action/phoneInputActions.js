
import {getInputByKey, getInputData, getInputFormData} from '../../../selector/inputFormSelector'

export const checkPhone = (payload) => {
	return (dispatch, getState) => {
		let inputData = getInputData(getState(), payload.formKey, payload.stateKey)
		if(!inputData.text){
			return "未填写手机号"
		}

		let phoneNum = inputData.text
    if (!(/^1[34578]\d{9}$/.test(phoneNum))) {
      return "手机号码有误，请重填"
    }
	}
}