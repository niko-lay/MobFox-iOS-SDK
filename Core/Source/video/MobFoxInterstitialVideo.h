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

@class MobFoxInterstitialVideo;

@protocol MobFoxInterstitialVideoDelegate <NSObject>

- (NSString *)publisherIdForInterstitialVideoAd:(MobFoxInterstitialVideo *)interstitial;

@optional

- (void)InterstitialVideoAdDidLoadMobFoxAd:(MobFoxInterstitialVideo *)interstitial;

- (void)InterstitialVideoAdDidFailToReceiveAdWithError:(NSError *)error;

- (void)InterstitialVideoAdClosed;

- (void)InterstitialVideoAdClicked;

- (void)InterstitialVideoAdFinished;

@end


@interface MobFoxInterstitialVideo : NSObject<MobFoxAdDelegate>



@property (nonatomic, assign) id<MobFoxInterstitialVideoDelegate> delegate;
@property MobFoxAd* ad;


-(id) initWithMainViewController:(UIViewController*)main;
-(void) loadAd;


@end

#endif
