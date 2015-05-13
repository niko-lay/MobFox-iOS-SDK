//
//  MoPubCustomEventFullscreen.h
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 18.06.2014.
//
//

#import "MFCustomEventFullscreen.h"
#import "MPInterstitialAdController.h"

@interface MoPubCustomEventFullscreen : MFCustomEventFullscreen <MPInterstitialAdControllerDelegate> {
    MPInterstitialAdController* interstitial;
}

@end
