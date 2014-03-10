//
//  AdMobCustomEventFullscreen.m
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 10.03.2014.
//
//

#import "AdMobCustomEventFullscreen.h"

@implementation AdMobCustomEventFullscreen

- (void)loadFullscreenWithOptionalParameters:(NSString *)optionalParameters trackingPixel:(NSString *)trackingPixel
{
    interstitial_ = [[GADInterstitial alloc] init];
    interstitial_.adUnitID = optionalParameters;
    interstitial_.delegate = self;
    [interstitial_ loadRequest:[GADRequest request]];
}

- (void)showFullscreenFromRootViewController:(UIViewController *)rootViewController
{
    [interstitial_ presentFromRootViewController:rootViewController];
}

#pragma mark GADInterstitialDelegate methods
- (void)interstitialDidReceiveAd:(GADInterstitial *)interstitial
{
    [self.delegate customEventFullscreenDidLoadAd:self];
}

- (void)interstitial:(GADInterstitial *)interstitial didFailToReceiveAdWithError:(GADRequestError *)error
{
    [self.delegate customEventFullscreenDidFailToLoadAd];
}

- (void)interstitialWillPresentScreen:(GADInterstitial *)interstitial
{
    [self didDisplayAd];
    [self.delegate customEventFullscreenWillAppear];
}

- (void)interstitialWillDismissScreen:(GADInterstitial *)interstitial
{
    [self.delegate customEventFullscreenWillClose];
}

- (void)interstitialWillLeaveApplication:(GADInterstitial *)interstitial
{
    [self.delegate customEventFullscreenWillLeaveApplication];
}



@end
