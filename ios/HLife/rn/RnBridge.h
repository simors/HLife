//
//  RnBridge.h
//  HLife
//
//  Created by 杨阳 on 2016/12/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#ifndef RnBridge_h
#define RnBridge_h

#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#import <Foundation/Foundation.h>
#import "AppDelegate.h"

@interface RnBridge : RCTEventEmitter<RCTBridgeModule>

@end

#endif /* RnBridge_h */
