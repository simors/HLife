//
//  RCTPingPP.m
//  HLife
//
//  Created by 万朋 on 2017/3/29.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTPingPP.h"
#import "Base/RCTLog.h"
#import "Pingpp.h"

@implementation PingPPModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setDebugMode:(BOOL)enabled
                  :(RCTResponseSenderBlock)callback)
{
  [Pingpp setDebugMode:enabled];
  callback(@[[NSNull null]]);
}

RCT_EXPORT_METHOD(handleOpenURLInIOS8:(NSURL *)url
                  :(RCTResponseSenderBlock)callback)
{
  [Pingpp handleOpenURL:url withCompletion:^(NSString *result, PingppError *error) {
    callback(@[@(error.code), result]);
  }];
}

RCT_EXPORT_METHOD(handleOpenURLInIOS9:(NSURL *)url
                  :(NSString *)sourceApplication
                  :(RCTResponseSenderBlock)callback)
{
  [Pingpp handleOpenURL:url sourceApplication:sourceApplication withCompletion:^(NSString *result, PingppError *error) {
    callback(@[@(error.code), result]);
  }];
}

RCT_EXPORT_METHOD(createPayment:(NSDictionary *)charge
                  :(NSString *)schema
                  :(RCTResponseSenderBlock)callback)
{
  [Pingpp createPayment:charge appURLScheme:schema withCompletion:^(NSString *result, PingppError *error) {
//    NSLog(@"completion block: %@", result);
    if (error == nil) {
//      NSLog(@"PingppError is nil");
      callback(@[@(error.code), result]);
    } else {
//      NSLog(@"PingppError: code=%lu msg=%@", (unsigned  long)error.code, [error getMsg]);
      callback(@[@(error.code), [error getMsg]]);
    }
  }];
}

@end
