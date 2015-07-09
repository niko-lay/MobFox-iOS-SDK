//
//  MPAdConfiguration.h
//  MoPub
//
//  Copyright (c) 2012 MoPub, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MPGlobalMF.h"

enum {
    MPAdTypeUnknown = -1,
    MPAdTypeBanner = 0,
    MPAdTypeInterstitial = 1
};
typedef NSUInteger MPAdType;

extern NSString * const mobfox_kAdTypeHeaderKeyMF;
extern NSString * const mobfox_kClickthroughHeaderKeyMF;
extern NSString * const mobfox_kCustomSelectorHeaderKeyMF;
extern NSString * const mobfox_kCustomEventClassNameHeaderKeyMF;
extern NSString * const mobfox_kCustomEventClassDataHeaderKeyMF;
extern NSString * const mobfox_kFailUrlHeaderKeyMF;
extern NSString * const mobfox_kHeightHeaderKeyMF;
extern NSString * const mobfox_kImpressionTrackerHeaderKeyMF;
extern NSString * const mobfox_kInterceptLinksHeaderKeyMF;
extern NSString * const mobfox_kLaunchpageHeaderKeyMFMF;
extern NSString * const mobfox_kNativeSDKParametersHeaderKeyMF;
extern NSString * const mobfox_kNetworkTypeHeaderKey;
extern NSString * const mobfox_kRefreshTimeHeaderKeyMF;
extern NSString * const mobfox_kAdTimeoutHeaderKeyMF;
extern NSString * const mobfox_kScrollableHeaderKeyMF;
extern NSString * const mobfox_kWidthHeaderKeyMF;
extern NSString * const mobfox_kDspCreativeIdKeyMF;
extern NSString * const mobfox_kPrecacheRequiredKeyMF;

extern NSString * const mobfox_kInterstitialAdTypeHeaderKeyMF;
extern NSString * const mobofx_kOrientationTypeHeaderKeyMF;

extern NSString * const mobfox_kAdTypeHtml;
extern NSString * const mobfox_kAdTypeInterstitial;
extern NSString * const mobfox_kAdTypeMraid;

extern NSString * const mobfox_kAdTypeClearMF;
extern NSString * const mobofx_kAdTypeNativeMF;

@interface MPAdConfigurationMF : NSObject

@property (nonatomic, assign) MPAdType adType;
@property (nonatomic, copy) NSString *networkType;
@property (nonatomic, assign) CGSize preferredSize;
@property (nonatomic, retain) NSURL *clickTrackingURL;
@property (nonatomic, retain) NSURL *impressionTrackingURL;
@property (nonatomic, retain) NSURL *failoverURL;
@property (nonatomic, retain) NSURL *interceptURLPrefix;
@property (nonatomic, assign) BOOL shouldInterceptLinks;
@property (nonatomic, assign) BOOL scrollable;
@property (nonatomic, assign) NSTimeInterval refreshInterval;
@property (nonatomic, assign) NSTimeInterval adTimeoutInterval;
@property (nonatomic, copy) NSData *adResponseData;
@property (nonatomic, retain) NSDictionary *nativeSDKParameters;
@property (nonatomic, copy) NSString *customSelectorName;
@property (nonatomic, assign) Class customEventClass;
@property (nonatomic, retain) NSDictionary *customEventClassData;
@property (nonatomic, assign) MPInterstitialOrientationType orientationType;
@property (nonatomic, copy) NSString *dspCreativeId;
@property (nonatomic, assign) BOOL precacheRequired;
@property (nonatomic, retain) NSDate *creationTimestamp;

- (id)initWithHeaders:(NSDictionary *)headers data:(NSData *)data;

- (BOOL)hasPreferredSize;
- (NSString *)adResponseHTMLString;
- (NSString *)clickDetectionURLPrefix;

@end
