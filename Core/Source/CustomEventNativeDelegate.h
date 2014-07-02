//
//  CustomEventNativeDelegate.h
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 01.07.2014.
//
//

#import <Foundation/Foundation.h>

@class NativeAd;

@protocol CustomEventNativeDelegate <NSObject>

-(void)customEventNativeFailed;
-(void)customEventNativeLoaded:(NativeAd*) nativeAd;

@end
