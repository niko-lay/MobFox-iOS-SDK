//
//  CustomEventNative.h
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 01.07.2014.
//
//

#import "NativeAd.h"
#import "CustomEventNativeDelegate.h"

@interface CustomEventNative : NativeAd

-(void) loadNativeAdWithOptionalParameters:(NSString *)optionalParameters trackingPixel:(NSString *)trackingPixel;

@property (nonatomic, assign) id<CustomEventNativeDelegate> delegate;

@end
