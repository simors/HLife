//
//  RnBridge.m
//  HLife
//
//  Created by 杨阳 on 2016/12/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RnBridge.h"

@implementation RnBridge

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"updateProgress",@"updateDone",@"updateFail"];
}

RCT_EXPORT_METHOD(reloadJs){
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication]delegate];
  NSLog(@"The app will be reload...");
  [delegate.bridge reload];
}

@end
