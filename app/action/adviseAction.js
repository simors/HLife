/**
 * Created by lilu on 2017/4/8.
 */
import {createAction} from 'redux-actions'
import * as topicActionTypes from '../constants/topicActionTypes'
import * as uiTypes from '../constants/uiActionTypes'
import {getInputFormData, isInputFormValid} from '../selector/inputFormSelector'
import {publishAdvise} from '../api/leancloud/advise'
import * as locSelector from '../selector/locSelector'
import AV from 'leancloud-storage'
import * as pointAction from '../action/pointActions'
import * as ImageUtil from '../util/ImageUtil'


export function publishAdviseFormData(payload) {
  return (dispatch, getState) => {
    let formData = undefined
    if (payload.formKey) {
      let formCheck = createAction(uiTypes.INPUTFORM_VALID_CHECK)
      dispatch(formCheck({formKey: payload.formKey}))
      let isFormValid = isInputFormValid(getState(), payload.formKey)
      if (isFormValid && !isFormValid.isValid) {
        if (payload.error) {
          payload.error({message: isFormValid.errMsg})
        }
        return
      }
      formData = getInputFormData(getState(), payload.formKey)
    }
   dispatch(handlePublishAdvise(payload,formData))
  }
}


function handlePublishAdvise(payload, formData) {
  return (dispatch, getState) => {
    let position = locSelector.getLocation(getState())
    let province = locSelector.getProvince(getState())
    let city = locSelector.getCity(getState())
    let district = locSelector.getDistrict(getState())
    let geoPoint = locSelector.getGeopoint(getState())
    if (geoPoint.latitude == 0 && geoPoint.longitude == 0) {
      if (payload.error) {
        payload.error({message: '请为应用打开地理位置权限！'})
      }
      return
    }
    if(payload.images && payload.images.length > 0) {
      return ImageUtil.batchUploadImgs(payload.images).then((leanUris) => {
        return leanUris
      }).then((leanUris) => {
        let publishTopicPayload = {
          position: position,
          geoPoint: new AV.GeoPoint(geoPoint.latitude, geoPoint.longitude),
          province: province,
          city: city,
          district: district,
          content: JSON.stringify(formData.adviseContent.text),
          imgGroup: leanUris,
          userId: payload.userId,
        }
        publishAdvise(publishTopicPayload).then((result) => {
          if (payload.success) {
            payload.success()
          }
           // 计算发布话题积分
        }).catch((error) => {
          console.log("error: ", error)
          if (payload.error) {
            payload.error(error)
          }
        })
      }).catch((error) => {
        if (payload.error) {
          payload.error(error)
        }
      })
    } else {
      let publishTopicPayload = {
        position: position,
        geoPoint: new AV.GeoPoint(geoPoint.latitude, geoPoint.longitude),
        province: province,
        city: city,
        district: district,
        content: JSON.stringify(formData.adviseContent.text),
        // abstract: formData.topicContent.abstract,
        imgGroup: payload.images,
        userId: payload.userId,
      }
      publishAdvise(publishTopicPayload).then((result) => {
        if (payload.success) {
          payload.success()
        }
          // 计算发布话题积分
      }).catch((error) => {
        console.log("error: ", error)
        if (payload.error) {
          payload.error(error)
        }
      })
    }
  }
}