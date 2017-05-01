//
//  shareComponent.m
//  HLife
//
//  Created by 万朋 on 2017/4/20.
//  Copyright © 2017年 simors. All rights reserved.
//

#import "shareComponent.h"
#import <UIKit/UIKit.h>
#import <UShareUI/UShareUI.h>
@implementation shareComponent
  
  RCT_EXPORT_MODULE();
  
  /*
   *  0 -- 微博
   *  1 -- 微信好友
   *  2 -- 微信朋友圈
   *  4 -- QQ
   *  5 -- 空间
   */
  RCT_EXPORT_METHOD(shareTextWithPlate:(NSInteger)index info:(NSDictionary *)info){
    
    //创建分享消息对象
    UMSocialMessageObject *messageObject = [UMSocialMessageObject messageObject];
    
    //设置文本
    messageObject.text =[info objectForKey:@"text"];
    //调用分享接口
    [[UMSocialManager defaultManager] shareToPlatform:index messageObject:messageObject currentViewController:nil completion:^(id data, NSError *error) {
      if (error) {
        UMSocialLogInfo(@"************Share fail with error %@*********",error);
      }else{
        if ([data isKindOfClass:[UMSocialShareResponse class]]) {
          UMSocialShareResponse *resp = data;
          //分享结果消息
          UMSocialLogInfo(@"response message is %@",resp.message);
          //第三方原始返回的数据
          UMSocialLogInfo(@"response originalResponse data is %@",resp.originalResponse);
          
        }else{
          UMSocialLogInfo(@"response data is %@",data);
        }
      }
      [self alertWithError:error];
    }];
  }
  
  RCT_EXPORT_METHOD(shareURLWithPlate:(NSInteger)index info:(NSDictionary *)info){
    //创建分享消息对象
    UMSocialMessageObject *messageObject = [UMSocialMessageObject messageObject];
    NSString *title = [info objectForKey:@"title"]?[info objectForKey:@"title"]:@"汇邻优店";
    NSString *descr = [info objectForKey:@"descr"]?[info objectForKey:@"descr"]:@"汇邻优店";
    
    NSString *thumbURL = [info objectForKey:@"thumbURL"]?[info objectForKey:@"thumbURL"]:@"https://simors.github.io/ljyd_blog/ic_launcher.png";
    
    NSString *URL = [info objectForKey:@"URL"]?[info objectForKey:@"URL"]:@"https://simors.github.io";
    
    
    UMShareWebpageObject *shareObject = [UMShareWebpageObject shareObjectWithTitle:title descr:descr thumImage:thumbURL];
    //设置网页地址
    shareObject.webpageUrl = URL;
    
    //分享消息对象设置分享内容对象
    messageObject.shareObject = shareObject;
    
    //调用分享接口
    [[UMSocialManager defaultManager] shareToPlatform:index messageObject:messageObject currentViewController:nil completion:^(id data, NSError *error) {
      if (error) {
        UMSocialLogInfo(@"************Share fail with error %@*********",error);
      }else{
        if ([data isKindOfClass:[UMSocialShareResponse class]]) {
          UMSocialShareResponse *resp = data;
          //分享结果消息
          UMSocialLogInfo(@"response message is %@",resp.message);
          //第三方原始返回的数据
          UMSocialLogInfo(@"response originalResponse data is %@",resp.originalResponse);
          
        }else{
          UMSocialLogInfo(@"response data is %@",data);
        }
      }
      [self alertWithError:error];
    }];
    
  }
  
  
  
//  RCT_EXPORT_METHOD(isInstall:(RCTResponseSenderBlock)callback){
//    Boolean isQQInstall =  [QQApiInterface isQQInstalled];
//    Boolean isWechatInstall =  [WXApi isWXAppInstalled];
//    Boolean isWeiboInstall =  [WeiboSDK isWeiboAppInstalled];
//    
//    
//    
//    NSMutableDictionary *dic = [[NSMutableDictionary alloc]init];
//    [dic setObject:isQQInstall?@"1":@"0" forKey:@"QQ"];
//    [dic setObject:isWechatInstall?@"1":@"0" forKey:@"wechat"];
//    [dic setObject:isWeiboInstall?@"1":@"0" forKey:@"weibo"];
//    NSArray *array = [NSArray arrayWithObjects:dic, nil];
//    
//    
//    callback(array);
//  }
  
  RCT_EXPORT_METHOD(dissmissKeyboard){
    [[UIApplication sharedApplication] sendAction:@selector(resignFirstResponder)to:nil from:nil forEvent:nil];
  }
  
  RCT_EXPORT_METHOD(pushKeyBoard){
    if(!_text){
      _text = [UITextField new];
    }
    [_text becomeFirstResponder];
  }
  
  
  
- (dispatch_queue_t)methodQueue
  {
    return dispatch_get_main_queue();
  }
  
- (void)alertWithError:(NSError *)error
  {
    NSString *result = nil;
    if (!error) {
      result = [NSString stringWithFormat:@"分享成功"];
    }
    else{
      if (error) {
        result = [NSString stringWithFormat:@"Share fail with error code: %d\n",(int)error.code];
      }
      else{
        result = [NSString stringWithFormat:@"分享失败"];
      }
    }
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"share"
                                                    message:result
                                                   delegate:nil
                                          cancelButtonTitle:NSLocalizedString(@"sure", @"确定")
                                          otherButtonTitles:nil];
    [alert show];
  }
  @end

