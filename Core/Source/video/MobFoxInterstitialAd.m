//
//  MobFoxInterstitialAd.m
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 8/12/15.
//
//

#import <Foundation/Foundation.h>
#include "MobFoxInterstitialAd.h"

@implementation MobFoxInterstitialAd{
    UIViewController* _main;
}
    
-(id) initWithMainViewController:(UIViewController*)main{
    self = [super init];
    self.ad = [[MobFoxAd alloc] initWithFrame:CGRectMake(0,0,
                                [[UIScreen mainScreen] applicationFrame].size.width,
                                [[UIScreen mainScreen] applicationFrame].size.height)];
    self.ad.adDelegate = self;
    self->_main = main;
    return self;
}

- (NSString *)publisherIdForMobFoxAd:(MobFoxAd *)banner{
   
    NSString* pubId =  [self.delegate publisherIdForMobFoxInterstitialAd:self];
    return pubId;
}

- (void)MobFoxAdDidLoad:(MobFoxAd *)banner{
    UIViewController* vc = [[UIViewController alloc] init];
    [vc.view addSubview:self.ad];
    [self->_main presentViewController:vc animated:TRUE completion:nil];
    
    if ([self.delegate respondsToSelector:@selector(MobFoxInterstitialAdDidLoad:)]) {
        [self.delegate MobFoxInterstitialAdDidLoad:self];
    }
    
}

- (void)MobFoxAdDidFailToReceiveAdWithError:(NSError *)error{
    if ([self.delegate respondsToSelector:@selector(MobFoxInterstitialAdDidFailToReceiveAdWithError:)]) {
        [self.delegate MobFoxInterstitialAdDidFailToReceiveAdWithError:error];
    }
}

- (void)MobFoxAdClosed{
    
    [self->_main dismissViewControllerAnimated:YES completion:nil];
    if ([self.delegate respondsToSelector:@selector(MobFoxInterstitialAdClosed)]) {
        [self.delegate MobFoxInterstitialAdClosed];
    }
}

- (void)MobFoxAdClicked{
    if ([self.delegate respondsToSelector:@selector(MobFoxInterstitialAdClicked)]) {
        [self.delegate MobFoxInterstitialAdClicked];
    }
}

- (void)MobFoxAdFinished{
    
    if ([self.delegate respondsToSelector:@selector(MobFoxInterstitialAdFinished)]) {
        [self.delegate MobFoxInterstitialAdFinished];
    }
}

-(void) loadAd{
    [self.ad loadVideoAd];
}

@end