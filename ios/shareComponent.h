//
//  shareComponent.h
//  HLife
//
//  Created by 万朋 on 2017/4/20.
//  Copyright © 2017年 simors. All rights reserved.
//

#ifndef shareComponent_h
#define shareComponent_h

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RCTBridgeModule.h"
@interface shareComponent : NSObject<RCTBridgeModule>
  @property(nonatomic,strong)UITextField *text;
  @end

#endif /* shareComponent_h */
