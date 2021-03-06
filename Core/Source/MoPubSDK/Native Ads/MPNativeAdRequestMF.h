//
//  MPNativeAdRequest.h
//  Copyright (c) 2013 MoPub. All rights reserved.
//

#import <Foundation/Foundation.h>

@class MPNativeAdMF;
@class MPNativeAdRequestMF;
@class MPNativeAdRequestTargetingMF;

typedef void(^MPNativeAdRequestHandler)(MPNativeAdRequestMF *request,
                                      MPNativeAdMF *response,
                                      NSError *error);

////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The MPNativeAdRequest class is used to manage requests to the MoPub ad server for native ads.
 */

@interface MPNativeAdRequestMF : NSObject

/** @name Targeting Information */

/**
 * An object representing targeting parameters that can be passed to the MoPub ad server to
 * serve more relevant advertising.
 */
@property (nonatomic, retain) MPNativeAdRequestTargetingMF *targeting;

/** @name Initializing and Starting an Ad Request */

/**
 * Initializes a request object.
 *
 * @param identifier The ad unit identifier for this request. An ad unit is a defined placement in
 * your application set aside for advertising. Ad unit IDs are created on the MoPub website.
 *
 * @return An MPNativeAdRequest object.
 */
+ (MPNativeAdRequestMF *)requestWithAdUnitIdentifier:(NSString *)identifier;

/**
 * Executes a request to the MoPub ad server.
 *
 * @param handler A block to execute when the request finishes. The block includes as parameters the
 * request itself and either a valid MPNativeAd or an NSError object indicating failure.
 */
- (void)startWithCompletionHandler:(MPNativeAdRequestHandler)handler;

@end
