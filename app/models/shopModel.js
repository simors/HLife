/**
 * Created by zachary on 2016/12/20.
 */
import {Map, List, Record} from 'immutable'

export const Shop = Record({
  name: undefined,
  phone: undefined,
  shopName: undefined,
  shopAddress: undefined,
  invitationCode: undefined
}, 'Shop')