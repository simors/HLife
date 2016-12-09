/**
 * Created by zachary on 2016/12/9.
 */

import { NativeModules} from 'react-native'

/**
 * Common
 */
const CommonNative = NativeModules.jsVersionUpdate

export function event(name) {
  CommonNative.event(name)
}
