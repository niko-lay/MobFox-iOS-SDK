//
//  MoPubCustomEventFullscreen.m
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 18.06.2014.
//
//

#import "MoPubCustomEventFullscreen.h"

@implementation MoPubCustomEventFullscreen


- (void)loadFullscreenWithOptionalParameters:(NSString *)optionalParameters trackingPixel:(NSString *)trackingPixel
{
    self.trackingPixel = trackingPixel;
    
    interstitial = [MPInterstitialAdController interstitialAdControllerForAdUnitId:optionalParameters];
    
    interstitial.delegate = self;
    
    [interstitial loadAd];
    
}

- (void)showFullscreenFromRootViewController:(UIViewController *)rootViewController
{
    if(interstitial.ready) {
        [interstitial showFromViewController:rootViewController];
    }
}

- (void)dealloc
{
    interstitial.delegate = nil;
    interstitial = nil;
}

#pragma mark delegate methods
- (void)interstitialDidLoadAd:(MPInterstitialAdController *)interstitial
{
    [self.delegate customEventFullscreenDidLoadAd:self];
}


- (void)interstitialDidFailToLoadAd:(MPInterstitialAdController *)interstitial
{
    [self.delegate customEventFullscreenDidFailToLoadAd];
}

- (void)interstitialDidAppear:(MPInterstitialAdController *)interstitial
{
    [self didDisplayAd];
    [self.delegate customEventFullscreenWillAppear];
}

- (void)interstitialWillDisappear:(MPInterstitialAdController *)interstitial
{
     [self.delegate customEventFullscreenWillClose];
}



@end
