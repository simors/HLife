/**
 * Created by wanpeng on 2016/12/28.
 */
import {createAction} from 'redux-actions'
import * as doctorActionTypes from '../constants/doctorActionTypes'
import {getInputFormData, isInputFormValid} from '../selector/inputFormSelector'

import * as uiTypes from '../constants/uiActionTypes'

import * as lcDoctor from '../api/leancloud/doctor'

export const DOCTOR_FORM_SUBMIT_TYPE = {
  DOCTOR_CERTIFICATION: 'DOCTOR_CERTIFICATION',
  DOCTOR_CERTIFICATION_MODIFY: 'DOCTOR_CERTIFICATION_MODIFY',
  SUBMIT_DOCTOR_DESC: 'SUBMIT_DOCTOR_DESC',
}

export function submitDoctorFormData(payload) {
  return (dispatch, getState) => {
    let formCheck = createAction(uiTypes.INPUTFORM_VALID_CHECK)
    dispatch(formCheck({formKey: payload.formKey}))
    let isFormValid = isInputFormValid(getState(), payload.formKey)
    if (!isFormValid.isValid) {
      if (payload.error) {
        payload.error({message: isFormValid.errMsg})
      }
      return
    }
    const formData = getInputFormData(getState(), payload.formKey)
    switch (payload.submitType) {
      case DOCTOR_FORM_SUBMIT_TYPE.DOCTOR_CERTIFICATION:
        dispatch(handleDoctorCertification(payload, formData))
        break
      case DOCTOR_FORM_SUBMIT_TYPE.DOCTOR_CERTIFICATION_MODIFY:
        dispatch(handleDoctorCertificationModify(payload, formData))
        break
      case DOCTOR_FORM_SUBMIT_TYPE.SUBMIT_DOCTOR_DESC:
        dispatch(handleDoctorDescSubmit(payload, formData))
        break
    }
  }
}

function handleDoctorCertification(payload, formData) {
  return (dispatch, getState) => {
    let smsPayload = {
      phone: formData.phoneInput.text,
      smsAuthCode: formData.smsAuthCodeInput.text,
    }

    // lcAuth.verifySmsCode(smsPayload).then(() => {
    //   dispatch(doctorCertification(payload, formData))
    // }).catch((error) => {
    //   if(payload.error){
    //     payload.error(error)
    //   }
    // })
    dispatch(doctorCertification(payload, formData))
  }

}

function handleDoctorCertificationModify(payload, formData) {
  return (dispatch, getState) => {
    dispatch(doctorCertification(payload, formData))
  }
}

function doctorCertification(payload, formData) {
  return (dispatch, getState) => {
    let certPayload = {
      id: payload.id,
      name: formData.nameInput.text,
      ID: formData.IDInput.text,
      phone: formData.phoneInput.text,
      organization: formData.regionPicker.text,
      department: formData.medicalPicker.text,
      certifiedImage: formData.IDImageInput.text,
      certificate: formData.imgGroup.text,
    }
    lcDoctor.certification(certPayload).then((doctor) => {
      if (payload.success) {
        let updateDoctorInfoAction = createAction(doctorActionTypes.UPDATE_DOCTORINFO)
        dispatch(updateDoctorInfoAction({doctor: doctor.doctorInfo}))
        payload.success(doctor)
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchDoctorInfo(payload) {
  return (dispatch, getState) => {
    lcDoctor.getDoctorInfoByUserId(payload).then((doctor) => {
      let updateDoctorInfoAction = createAction(doctorActionTypes.UPDATE_DOCTORINFO)
      dispatch(updateDoctorInfoAction({doctor: doctor.doctorInfo}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchDoctorByUserId(payload) {
  return (dispatch, getState) => {
    lcDoctor.getDoctorInfoByUserId(payload).then((doctor) => {
      let updateDoctorListAction = createAction(doctorActionTypes.UPDATE_DOCTOR_LIST)
      dispatch(updateDoctorListAction({doctor: doctor}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchDoctorById(payload) {
  return (dispatch, getState) => {
    lcDoctor.getDoctorInfoById(payload).then((doctor) => {
      let updateDoctorListAction = createAction(doctorActionTypes.UPDATE_DOCTOR_LIST)
      dispatch(updateDoctorListAction({doctor: doctor}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchDoctorGroup(payload) {
  return (dispatch, getState) => {
    lcDoctor.getDoctorGroup(payload).then((doctorList) => {
      if (doctorList.length != 0) {
        let updateDoctorGroupAction = createAction(doctorActionTypes.UPDATE_DOCTOR_GROUP)
        dispatch(updateDoctorGroupAction({doctorGroup: doctorList}))
      }
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }

}

export function getDocterList(payload) {
  return (dispatch, getState) => {
    lcDoctor.fetchDocterList(payload).then((doctorList) => {
      const queryDoctors = createAction(doctorActionTypes.QUERY_DOCTORS)
      dispatch(queryDoctors({doctorList: doctorList}))
    })
  }
}

export function handleDoctorDescSubmit(payload, formData) {
  console.log("handleDoctorDescSubmit payload", payload)
  console.log("handleDoctorDescSubmit formData", formData)
  return (dispatch, getState) => {
    let descPayload = {
      id: payload.id,
      // desc: formData.
    }
    lcDoctor.submitDoctorDesc(payload).then((doctor) => {
      let updateDoctorInfoAction = createAction(doctorActionTypes.UPDATE_DOCTORINFO)
      dispatch(updateDoctorInfoAction({doctor: doctor.doctorInfo}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}