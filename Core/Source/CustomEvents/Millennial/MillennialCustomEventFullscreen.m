//
//  MillennialCustomEventFullscreen.m
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 18.06.2014.
//
//

#import "MillennialCustomEventFullscreen.h"

#define COMPILE_MILLENNIAL_ADDITIONAL_NOTIFICATIONS 0 //disabled, would cause errors without Millennial framework attached. Basic delegate methods (ad loaded/failed to load) will still work

@interface MillennialCustomEventFullscreen()
@property (nonatomic, strong) NSString* adId;
@end


@implementation MillennialCustomEventFullscreen

- (void)loadFullscreenWithOptionalParameters:(NSString *)optionalParameters trackingPixel:(NSString *)trackingPixel
{
    self.trackingPixel = trackingPixel;
    self.adId = optionalParameters;
    
    Class interstitialClass = NSClassFromString(@"MMInterstitial");
    Class requestClass = NSClassFromString(@"MMRequest");
    Class SDKClass = NSClassFromString(@"MMSDK");
    if(!interstitialClass || !requestClass || !SDKClass) {
        [self notifyAdFailed];
        return;
    }
    [SDKClass initialize];
    
#if COMPILE_MILLENNIAL_ADDITIONAL_NOTIFICATIONS

    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(adModalWillDismiss:)
                                                 name:MillennialMediaAdModalWillDismiss
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(applicationWillTerminateFromAd:)
                                                 name:MillennialMediaAdWillTerminateApplication
                                               object:nil];
    
#endif

    MMRequest *request = [requestClass request];
    
    [interstitialClass fetchWithRequest:request
                                apid:optionalParameters
                        onCompletion:^(BOOL success, NSError *error) {
                            if (success) {
                                [self notifyAdLoaded];
                            }
                            else {
                                [self notifyAdFailed];
                            }
                        }];
    
}

- (void)showFullscreenFromRootViewController:(UIViewController *)rootViewController
{
    Class interstitialClass = NSClassFromString(@"MMInterstitial");
    if(interstitialClass && [interstitialClass isAdAvailableForApid:self.adId]) {
        [self notifyAdWillAppear];
        
        [interstitialClass displayForApid: self.adId
                 fromViewController: rootViewController
                    withOrientation: 0
                       onCompletion: nil];
    }
}


- (void)adModalWillDismiss:(NSNotification *)notification {
    [self notifyAdWillClose];
}

- (void)applicationWillTerminateFromAd:(NSNotification *)notification {
    [self notifyAdWillLeaveApplication];
}


- (void)dealloc
{
#if COMPILE_MILLENNIAL_ADDITIONAL_NOTIFICATIONS
    [[NSNotificationCenter defaultCenter] removeObserver:self];
#endif
}




@end
