//
//  QRCodeLocalImage.m
//  HLife
//
//  Created by 佐凯 on 2017/5/12.
//  Copyright © 2017年 simors. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCTLog.h"
#import "RCTUtils.h"
#import "QRCodeLocalImage.h"

@implementation RCTQRCodeLocalImage
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(decode:(NSString *)path callback:(RCTResponseSenderBlock)callback)
{
  UIImage *srcImage;
  if ([path hasPrefix:@"http://"] || [path hasPrefix:@"https://"]) {
    srcImage = [UIImage imageWithData: [NSData dataWithContentsOfURL:[NSURL URLWithString: path]]];
  } else {
    srcImage = [[UIImage alloc] initWithContentsOfFile:path];
  }
  if (nil==srcImage){
    NSLog(@"PROBLEM! IMAGE NOT LOADED\n");
    callback(@[RCTMakeError(@"IMAGE NOT LOADED!", nil, nil)]);
    return;
  }
  NSLog(@"OK - IMAGE LOADED\n");
  NSDictionary *detectorOptions = @{@"CIDetectorAccuracy": @"CIDetectorAccuracyHigh"};
  CIDetector *detector = [CIDetector detectorOfType:CIDetectorTypeQRCode context:nil options:detectorOptions];
  CIImage *image = [CIImage imageWithCGImage:srcImage.CGImage];
  NSArray *features = [detector featuresInImage:image];
  if (0==features.count) {
    NSLog(@"PROBLEM! Feature size is zero!\n");
    callback(@[RCTMakeError(@"Feature size is zero!", nil, nil)]);
    return;
  }
  
  CIQRCodeFeature *feature = [features firstObject];
  
  NSString *result = feature.messageString;
  NSLog(@"result: %@", result);
  
  if (result) {
    callback(@[[NSNull null], result]);
  } else {
    callback(@[RCTMakeError(@"QR Parse failed!", nil, nil)]);
    return;
  }
}
@end
