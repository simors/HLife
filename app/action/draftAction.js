/**
 * Created by lilu on 2017/4/13.
 */
import AV from 'leancloud-storage'
import {createAction} from 'redux-actions'
import * as draftTypes from '../constants/draftActionTypes'
import {getInputFormData, isInputFormValid} from '../selector/inputFormSelector'
import * as uiTypes from '../constants/uiActionTypes'
import  {Record,Map,List}from 'immutable'
import * as locSelector from '../selector/locSelector'
import {trim} from '../util/Utils'

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
      // let isFormValid = isInputFormValid(getState(), payload.formKey)
      // if (isFormValid && !isFormValid.isValid) {
      //   if (payload.error) {
      //     payload.error({message: isFormValid.errMsg})
      //   }
      //   return
      // }
      formData = getInputFormData(getState(), payload.formKey)
    }
    let city = locSelector.getCity(getState())
     console.log('data',formData)
    dispatch(updateTopicDraft({
      userId:payload.userId,
      id:payload.draftId,
      imgGroup:payload.images,
      draftDay:payload.draftDay,
      draftMonth:payload.draftMonth,
      categoryId:payload.categoryId,
      city:city,
      title: (formData.topicName!=undefined&&formData.topicName.text!=undefined)?trim(formData.topicName.text):'',
      content: (formData.topicContent!=undefined&&formData.topicContent.text!=undefined)?JSON.stringify(formData.topicContent.text):{},
      abstract: (formData.topicContent!=undefined&&formData.topicContent.abstract!=undefined)?trim(formData.topicContent.abstract):'',
      objectId: payload.topicId,
    }))
  }
}

export const fetchShopPromotionDraft=(payload)=>{
  // console.log('shopPromotionDraft',payload)

  return (dispatch)=>{
    dispatch(updateShopPomotionDraft({draftId:payload.draftId,...payload,coverUrl:payload.localCoverImgUri,}))
  }
}

export const handleDestroyTopicDraft=(payload)=>{
  // console.log('destroy',payload)
  return (dispatch)=>{

    dispatch(destroyTopicDraft(payload))
  }
}

export const handleDestroyShopPromotionDraft=(payload)=>{
  return (dispatch)=>{
    dispatch(destroyShopPromotionDraft(payload))
  }
}