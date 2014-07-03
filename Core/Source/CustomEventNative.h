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

-(void)addImageAssetWithImageUrl:(NSString*)url andType:(NSString*)type;

-(void)addImpressionTrackerWithUrl:(NSString*)url;

-(void)addExtraAsset:(NSString*)asset withType:(NSString*)type;

@property (nonatomic, assign) id<CustomEventNativeDelegate> delegate;

@end
