/**
 * Created by yangyang on 2016/12/3.
 */
import {Map, Record} from 'immutable'

export const InputRecord = Record({
  stateKey: undefined,          // Input组件的唯一标示
  formKey: undefined,           // Input组件所在表单的唯一标示
  dataValid: false,             // 数据是否有效
  invalidMsg: '输入不能为空',     // 错误提示
  validCallback: undefined,     // 判断数据有效性回调函数
  data: Map({})                 // 保存的数据
})

export const InputFormRecord = Record({
  formKey: undefined,           // 表单的唯一标示
  dataReady: false,             // 数据是否可以提交
  error: '输入不能为空',         // 错误提示
  inputs: Map({})                // 输入组件列表
})