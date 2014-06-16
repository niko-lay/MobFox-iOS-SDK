//
//  FacebookCustomEventFullscreen.m
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 16.06.2014.
//
//

#import "FacebookCustomEventFullscreen.h"

@implementation FacebookCustomEventFullscreen

- (void)loadFullscreenWithOptionalParameters:(NSString *)optionalParameters trackingPixel:(NSString *)trackingPixel
{
    self.trackingPixel = trackingPixel;
    if(interstitial) {
        interstitial.delegate = nil;
        interstitial = nil;
    }
    
    Class interstitialClass = NSClassFromString(@"FBInterstitialAd");
    if(!interstitialClass) {
        [self.delegate customEventFullscreenDidFailToLoadAd];
        return;
    }
    
    interstitial = [[interstitialClass alloc] initWithPlacementID:optionalParameters];
    interstitial.delegate = self;
    
    [interstitial loadAd];
}

- (void)showFullscreenFromRootViewController:(UIViewController *)rootViewController
{
    if([interstitial isAdValid]) {
        if([interstitial showAdFromRootViewController:rootViewController]) {
            [self didDisplayAd];
            [self.delegate customEventFullscreenWillAppear];
        }
    }
    
}

- (void)dealloc
{
    interstitial.delegate = nil;
    interstitial = nil;
}

#pragma mark delegate methods

- (void)interstitialAdDidClick:(FBInterstitialAd *)interstitialAd {
    [self.delegate customEventFullscreenWillLeaveApplication];
}

- (void)interstitialAdWillClose:(FBInterstitialAd *)interstitialAd {
    [self.delegate customEventFullscreenWillClose];
}

- (void)interstitialAdDidLoad:(FBInterstitialAd *)interstitialAd {
    [self.delegate customEventFullscreenDidLoadAd:self];

}

- (void)interstitialAd:(FBInterstitialAd *)interstitialAd didFailWithError:(NSError *)error {
    [self.delegate customEventFullscreenDidFailToLoadAd];
}






@end
