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

@implementation LIFEPingPP

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setDebugMode:(BOOL)enabled
                  :(RCTResponseSenderBlock)callback)
{
  NSLog(@"setDebugMode = %d", enabled);
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
  NSLog(@"charge = %@", charge);
  [Pingpp createPayment:charge appURLScheme:schema withCompletion:^(NSString *result, PingppError *error) {
    callback(@[@(error.code), result]);
  }];
}

@end
