//
//  MobFoxNativeTrackingView.h
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 26.05.2014.
//
//

#import <UIKit/UIKit.h>
#import "MobFoxNativeAdController.h"

@interface MobFoxNativeTrackingView : UIView

@property (nonatomic, strong) NSArray* impressionTrackers;
@property (nonatomic, assign) IBOutlet __unsafe_unretained id <MobFoxNativeAdDelegate> delegate;

@end
