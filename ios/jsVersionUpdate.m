////
////  jsVersionUpdate.m
////  HLife
////
////  Created by 李鲁 on 2017/4/20.
////  Copyright © 2017年 simors. All rights reserved.
////
//
//
//#import "jsVersionUpdate.h"
//
//#import <AVOSCloud/AVOSCloud.h>
//@implementation jsVersionUpdate
//RCT_EXPORT_MODULE();
//
//- (NSArray<NSString *> *)supportedEvents {
//  return @[@"updateProgress",@"updateDone",@"updateFail"];
//}
//
//RCT_EXPORT_METHOD(getVersion:(RCTResponseSenderBlock)callback)
//{
//  //执行自己的业务，且可以回调
//  NSString *version = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
//  NSString *plateform = @"ios";
//  
//  NSString *path = [NSString stringWithFormat:@"%@/bundle/update.json",[NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) firstObject]];
//  
//  //在此做一层校验 若不能找到update.json 我们就意味着当前版本已损坏了 return
//  NSFileManager *manager = [NSFileManager defaultManager];
//  if (![manager fileExistsAtPath:path]) {
//    return;
//  }
//  
//  NSData *data = [NSData dataWithContentsOfFile:path];
//  NSError *serializaError;
//  NSDictionary *dictionary = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:&serializaError];
//  if (serializaError) {
//    return ;
//  }
//  NSString *bundleVersion = [dictionary objectForKey:@"version"];
//  NSMutableDictionary *dic = [[NSMutableDictionary alloc]init];
//  [dic setObject:version forKey:@"version"];
//  [dic setObject:plateform forKey:@"plateform"];
//  [dic setObject:bundleVersion forKey:@"bundleVersion"];
//  NSArray *array = [NSArray arrayWithObjects:dic, nil];
//  callback(array);
//}
//RCT_EXPORT_METHOD(doPatchUpdate:(NSString *)url md5:(NSString *)md5Sting)
//{
//  //接收js传过来的参数，实现自己的业务
//  [self updateWithPatch:url md5:md5Sting downProgress:^(NSString *progress) {
//    NSDictionary *dic  = [NSDictionary dictionaryWithObject:progress forKey:@"progress"];
//    [self sendEventWithName:@"updateProgress" body:dic];
//  }];
//  
//}
//
//
//RCT_EXPORT_METHOD(doFullUpdate:(NSString *)url md5:(NSString *)md5Sting)
//{
//  //接收js传过来的参数，实现自己的业务
//  [self updateWithBundle:url md5:md5Sting downProgress:^(NSString  *progress) {
//    NSDictionary *dic  = [NSDictionary dictionaryWithObject:progress forKey:@"progress"];
//    [self sendEventWithName:@"updateProgress" body:dic];
//    
//  }];
//  
//}
//
//
//RCT_EXPORT_METHOD(visitPageWithName:(NSString *)name){
//  [AVAnalytics beginLogPageView:name];
//}
//
//RCT_EXPORT_METHOD(dissmissPageWithName:(NSString *)name){
//  [AVAnalytics endLogPageView:name];
//}
//
//RCT_EXPORT_METHOD(event:(NSString *)name){
//  [AVAnalytics event:name];
//}
//
//RCT_EXPORT_METHOD(reloadJs){
//  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication]delegate];
//  [delegate.bridge reload];
//}
//
//
//
//- (void)updateWithPatch:(NSString *)url md5:(NSString *)md5Sting downProgress:(downloadProgress)callback{
//  ReactNativeUpdater *update = [ReactNativeUpdater sharedInstance];
//  update.md5String = md5Sting;
//  [update updateWithUrl:url updateType:ReactNativeUpdatePatch Success:^(UpdateOperation *opreation) {
//    //    if (opreation.code == 200) {
//    //      NSLog(@"reload");
//    //      AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication]delegate];
//    //      [delegate.bridge reload];
//    //    }
//    [self sendEventWithName:@"updateDone" body:@""];
//  } failure:^(UpdateOperation *opreation) {
//    //使用老的bundle 不做任何操作，已经是原来bundle了
//    [self sendEventWithName:@"updateFail" body:@""];
//  } Progress:^(NSString *progress) {
//    callback(progress);
//  }];
//}
//
//- (void)updateWithBundle:(NSString *)url md5:(NSString *)md5Sting downProgress:(downloadProgress)callback{
//  ReactNativeUpdater *update = [ReactNativeUpdater sharedInstance];
//  update.md5String = md5Sting;
//  [update updateWithUrl:url updateType:ReactNativeUpdateFull Success:^(UpdateOperation *opreation) {
//    [self sendEventWithName:@"updateDone" body:@""];
//  } failure:^(UpdateOperation *opreation) {
//    [self sendEventWithName:@"updateFail" body:@""];
//  } Progress:^(NSString *progress) {
//    callback(progress);
//  }];
//}
//
//
//
//
//- (dispatch_queue_t)methodQueue
//{
//  return dispatch_get_main_queue();
//}
//@end
