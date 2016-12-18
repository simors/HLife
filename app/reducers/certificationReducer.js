/**
 * Created by wanpeng on 2016/12/17.
 */
import * as AuthTypes from '../constants/authActionTypes'
import {UserState, UserInfo, UserDetail, UserProfile} from '../models/userModels'
import {REHYDRATE} from 'redux-persist/constants'
import {Map, List} from 'immutable'
const initialState = new UserState()

