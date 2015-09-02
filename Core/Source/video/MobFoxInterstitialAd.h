//
//  MobFoxInterstitialVideo.h
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 8/12/15.
//
//

#ifndef MobFoxSDKSource_MobFoxInterstitialVideo_h
#define MobFoxSDKSource_MobFoxInterstitialVideo_h

#include "MobFoxAd.h"

@class MobFoxInterstitialAd;

@protocol MobFoxInterstitialAdDelegate <NSObject>

- (NSString *)publisherIdForMobFoxInterstitialAd:(MobFoxInterstitialAd *)interstitial;

@optional

- (void)MobFoxInterstitialAdDidLoad:(MobFoxInterstitialAd *)interstitial;

- (void)MobFoxInterstitialAdDidFailToReceiveAdWithError:(NSError *)error;

- (void)MobFoxInterstitialAdClosed;

- (void)MobFoxInterstitialAdClicked;

- (void)MobFoxInterstitialAdFinished;

@end


@interface MobFoxInterstitialAd : NSObject<MobFoxAdDelegate>



@property (nonatomic, assign) id<MobFoxInterstitialAdDelegate> delegate;
@property MobFoxAd* ad;


-(id) initWithMainViewController:(UIViewController*)main;
-(void) loadAd;


@end

#endif
