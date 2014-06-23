//
//  VungleCustomEventFullscreen.m
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 18.06.2014.
//
//

#import "VungleCustomEventFullscreen.h"


@implementation VungleCustomEventFullscreen

- (void)loadFullscreenWithOptionalParameters:(NSString *)optionalParameters trackingPixel:(NSString *)trackingPixel
{
    self.trackingPixel = trackingPixel;
    

    Class SDKClass = NSClassFromString(@"VungleSDK");
    if(!SDKClass) {
        [self.delegate customEventFullscreenDidFailToLoadAd];
        return;
    }
    sdk = [SDKClass sharedSDK];
    [sdk startWithAppId:optionalParameters];
    [sdk setDelegate:self];

    checkStatusTimer = [NSTimer scheduledTimerWithTimeInterval:10 target:self selector:@selector(checkVungleReady) userInfo:nil repeats:NO]; //hack, Vungle doesn't provide delegate method  notifying about ad load status
}

- (void)showFullscreenFromRootViewController:(UIViewController *)rootViewController
{
    if(sdk) {
        [sdk playAd:rootViewController];
    }
}

- (void)vungleSDKwillShowAd {
    [self didDisplayAd];
    [self.delegate customEventFullscreenWillAppear];
}

- (void)vungleSDKwillCloseAdWithViewInfo:(NSDictionary*)viewInfo willPresentProductSheet:(BOOL)willPresentProductSheet {
    if(!willPresentProductSheet) {
        [self.delegate customEventFullscreenWillClose];
    }
}

- (void)vungleSDKwillCloseProductSheet:(id)productSheet {
    [self.delegate customEventFullscreenWillClose];
}

- (void)checkVungleReady {
    if(sdk && [sdk isCachedAdAvailable]) {
        [self.delegate customEventFullscreenDidLoadAd:self];
    } else {
        [self.delegate customEventFullscreenDidFailToLoadAd];
    }
}

- (void)dealloc
{
    if(checkStatusTimer) {
        [checkStatusTimer invalidate];
    }
    
    if(sdk) {
        [sdk setDelegate:nil];
    }
    sdk = nil;
}


@end
