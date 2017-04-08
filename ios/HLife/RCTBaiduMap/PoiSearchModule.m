//
//  PoiSearchModule.m
//  HLife
//
//  Created by zachary on 2017/2/11.
//  Copyright © 2017年 Simors. All rights reserved.
//

#import "PoiSearchModule.h"

@implementation PoiSearchModule;

@synthesize bridge = _bridge;

static BMKPoiSearch *_poisearch;
static BMKSuggestionSearch *_suggestionSearch;

RCT_EXPORT_MODULE(BaiduPoiSearchModule);

RCT_EXPORT_METHOD(searchNearbyProcess:(NSString *)keyword centerLat:(double)centerLat
                  centerLng:(double)centerLng radius:(int)radius pageNum:(int)pageNum){
  [self getPoisearch].delegate = self;
  
  BMKNearbySearchOption *nearbySearchOption = [[BMKNearbySearchOption alloc]init];
  CLLocationCoordinate2D baiduCoor = CLLocationCoordinate2DMake(centerLat, centerLng);
  nearbySearchOption.keyword = keyword;
  nearbySearchOption.location = baiduCoor;
  nearbySearchOption.radius = radius;
  
  BOOL flag = [[self getPoisearch] poiSearchNearBy:nearbySearchOption];
  if(flag)
  {
    NSLog(@"周边检索发送成功");
  }
  else
  {
    NSLog(@"周边检索发送失败");
  }
}

RCT_EXPORT_METHOD(searchInCityProcess:(NSString *)city keyword:(NSString *)keyword pageNum:(int)pageNum){
  [self getPoisearch].delegate = self;
  
  BMKCitySearchOption *citySearchOption = [[BMKCitySearchOption alloc]init];

  citySearchOption.pageIndex = pageNum;
  citySearchOption.pageCapacity = 10;
  citySearchOption.city= city;
  citySearchOption.keyword = keyword;
  BOOL flag = [[self getPoisearch] poiSearchInCity:citySearchOption];
  if(flag)
  {
    NSLog(@"城市内检索发送成功");
  }
  else
  {
    NSLog(@"城市内检索发送失败");
  }
}

RCT_EXPORT_METHOD(requestSuggestion:(NSString *)city keyword:(NSString *)keyword cityLimit:(BOOL)cityLimit){
  [self getSuggestionSearch].delegate = self;
  
  BMKSuggestionSearchOption* option = [[BMKSuggestionSearchOption alloc] init];
  option.cityname = city;
  option.keyword = keyword;
  if(cityLimit) {
    option.cityLimit = cityLimit;
  }
  BOOL flag = [[self getSuggestionSearch] suggestionSearch: option];
  if(flag)
  {
    NSLog(@"建议检索发送成功");
  }
  else
  {
    NSLog(@"建议检索发送失败");
  }
}

- (void)onGetSuggestionResult:(BMKSuggestionSearch*)searcher result:(BMKSuggestionResult*)result errorCode:(BMKSearchErrorCode)error{
  NSLog(@"onGetSuggestionResult获取建议检索结果");
  NSMutableDictionary *body = [self getEmptyBody];
  
  if(error == BMK_SEARCH_NO_ERROR){
    NSMutableArray *suggestionList = [NSMutableArray array];
    for(int i = 0; i < result.keyList.count; i++) {
      NSMutableDictionary *item = [self getEmptyBody];
      NSString* key = [result.keyList objectAtIndex:i];
      NSString* city = [result.cityList objectAtIndex:i];
      NSString* district = [result.districtList objectAtIndex:i];
      NSValue* pt = [result.ptList objectAtIndex:i];
      if(pt != nil) {
        CLLocationCoordinate2D coor;
        [pt getValue:&coor];
        NSString *latitude = [NSString stringWithFormat:@"%f", coor.latitude];
        NSString *longitude = [NSString stringWithFormat:@"%f", coor.longitude];
        item[@"latitude"] = latitude;
        item[@"longitude"] = longitude;
      }
      item[@"key"] = key;
      item[@"city"] = city;
      item[@"district"] = district;
      [suggestionList addObject: item];
    }
    body[@"errcode"] = @"0";
    body[@"message"] = @"成功";
    body[@"suggestionList"] = suggestionList;
  }else{
    body[@"errcode"] = @"-1";
    body[@"message"] = @"失败";
  }
  
  [self sendEvent:@"onGetSuggestionResult" body:body];
}

- (void)onGetPoiResult:(BMKPoiSearch *)searcher result:(BMKPoiResult*)result errorCode:(BMKSearchErrorCode)error{
  NSLog(@"onGetPoiResult获取检索结果");
  NSMutableDictionary *body = [self getEmptyBody];
  
  if (error == BMK_SEARCH_NO_ERROR) {
    NSMutableArray *annotations = [NSMutableArray array];

    for (int i = 0; i < result.poiInfoList.count; i++) {
      BMKPoiInfo* poi = [result.poiInfoList objectAtIndex:i];
      NSMutableDictionary *item = [self getEmptyBody];
      item[@"name"] = poi.name;
      item[@"address"] = poi.address;
      NSString *latitude = [NSString stringWithFormat:@"%f", poi.pt.latitude];
      NSString *longitude = [NSString stringWithFormat:@"%f", poi.pt.longitude];
      item[@"latitude"] = latitude;
      item[@"longitude"] = longitude;
      [annotations addObject:item];
    }
    body[@"errcode"] = @"0";
    body[@"message"] = @"成功";
    body[@"poiResult"] = @{
                           @"poiInfos": annotations
                           };
  } else if (error == BMK_SEARCH_AMBIGUOUS_ROURE_ADDR){
    NSLog(@"起始点有歧义");
  } else {
    // 各种情况的判断。。。
  }
  [self sendEvent:@"onGetPoiResult" body:body];
  
}

-(BMKSuggestionSearch *) getSuggestionSearch{
  if(_suggestionSearch == nil) {
    _suggestionSearch = [[BMKSuggestionSearch alloc]init];
  }
  return _suggestionSearch;
}

-(BMKPoiSearch *) getPoisearch{
  if(_poisearch == nil) {
    _poisearch = [[BMKPoiSearch alloc]init];
  }
  return _poisearch;
}

@end
