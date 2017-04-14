/**
 * Created by lilu on 2017/4/13.
 */
import AV from 'leancloud-storage'
import {createAction} from 'redux-actions'
import * as draftTypes from '../constants/draftActionTypes'
import {getInputFormData, isInputFormValid} from '../selector/inputFormSelector'
import * as uiTypes from '../constants/uiActionTypes'
import  {Record,Map,List}from 'immutable'

export const updateTopicDraft = createAction(draftTypes.UPDATE_TOPIC_DRAFT)
export const updateShopPomotionDraft = createAction(draftTypes.UPDATE_SHOP_PROMOTION_DRAFT)
export const destroyTopicDraft = createAction(draftTypes.DESTROY_TOPIC_DRAFT)
export const destroyShopPromotionDraft = createAction(draftTypes.DESTROY_SHOP_PROMOTION_DRAFT)


export const fetchTopicDraft=(payload)=>{
  return (dispatch,getState)=>{
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

    dispatch(updateTopicDraft({id:payload.draftId,topicDraft:formData,images:payload.images}))
  }
}

export const fetchShopPromotionDraft=(payload)=>{
  return (dispatch)=>{
    dispatch(updateShopPomotionDraft(payload))
  }
}

export const handleDestroyTopicDraft=(payload)=>{
  return (dispatch)=>{
    dispatch(destroyTopicDraft(payload))
  }
}

export const handleDestroyShopPromotionDraft=(payload)=>{
  return (dispatch)=>{
    dispatch(destroyShopPromotionDraft(payload))
  }
}