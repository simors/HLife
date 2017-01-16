/**
 * Created by yangyang on 2016/12/3.
 */
import {Map, Record} from 'immutable'

export const InputRecord = Record({
  stateKey: undefined,          // Input组件的唯一标示
  formKey: undefined,           // Input组件所在表单的唯一标示
  type: undefined,              // 指定组件的类型，此指是一个字符串，并且在获取到表单中的数据是，以此值为健构造表单的所有数据
  dataValid: false,             // 数据是否有效
  invalidMsg: '输入不能为空',     // 错误提示
  validCallback: undefined,     // 判断数据有效性回调函数
  data: undefined               // 保存的数据
})

export const InputFormRecord = Record({
  formKey: undefined,           // 表单的唯一标示
  dataReady: false,             // 数据是否可以提交
  error: '表单错误',             // 错误提示
  inputs: Map({})               // 输入组件列表
})