//
//  MPNativeAdRequestTargeting.m
//  Copyright (c) 2014 MoPub. All rights reserved.
//

#import "MPNativeAdRequestTargetingMF.h"
#import "MPNativeAdConstantsMF.h"

@implementation MPNativeAdRequestTargetingMF

+ (MPNativeAdRequestTargetingMF *)targeting
{
    return [[[MPNativeAdRequestTargetingMF alloc] init] autorelease];
}

- (void)setDesiredAssets:(NSSet *)desiredAssets
{
    if (_desiredAssets != desiredAssets) {
        [_desiredAssets release];

        NSMutableSet *allowedAdAssets = [NSMutableSet setWithObjects:mobfox_kAdTitleKeyMF,
                                         mobfox_kAdTextKeyMF,
                                         mobfox_kAdIconImageKeyMF,
                                         mobfox_kAdMainImageKeyMF,
                                         mobfox_kAdCTATextKeyMF,
                                         mobfox_kAdStarRatingKeyMF,
                                         nil];
        [allowedAdAssets intersectSet:desiredAssets];
        _desiredAssets = [allowedAdAssets retain];
    }
}

- (void)dealloc
{
    [_keywords release];
    [_location release];
    [_desiredAssets release];
    [super dealloc];
}

@end
