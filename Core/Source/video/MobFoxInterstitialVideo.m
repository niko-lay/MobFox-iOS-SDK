//
//  MobFoxInterstitialVideo.m
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 8/12/15.
//
//

#import <Foundation/Foundation.h>
#include "MobFoxInterstitialVideo.h"

@implementation MobFoxInterstitialVideo{
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
   
    NSString* pubId =  [self.delegate publisherIdForInterstitialVideoAd:self];
   
    return pubId;
}

- (void)MobFoxAdDidLoad:(MobFoxAd *)banner{
    UIViewController* vc = [[UIViewController alloc] init];
    [vc.view addSubview:self.ad];
    [self->_main presentViewController:vc animated:TRUE completion:nil];
    
    if ([self.delegate respondsToSelector:@selector(InterstitialVideoAdDidLoadMobFoxAd:)]) {
        [self.delegate InterstitialVideoAdDidLoadMobFoxAd:self];
    }
    
}

- (void)MobFoxAdDidFailToReceiveAdWithError:(NSError *)error{
    if ([self.delegate respondsToSelector:@selector(InterstitialVideoAdDidFailToReceiveAdWithError:)]) {
        [self.delegate InterstitialVideoAdDidFailToReceiveAdWithError:error];
    }
}

- (void)MobFoxAdClosed{
    
    [self->_main dismissViewControllerAnimated:YES completion:nil];
    if ([self.delegate respondsToSelector:@selector(InterstitialVideoAdClosed)]) {
        [self.delegate InterstitialVideoAdClosed];
    }
}

- (void)MobFoxAdClicked{
    if ([self.delegate respondsToSelector:@selector(InterstitialVideoAdClicked)]) {
        [self.delegate InterstitialVideoAdClicked];
    }
}

- (void)MobFoxAdFinished{
    
    if ([self.delegate respondsToSelector:@selector(InterstitialVideoAdFinished)]) {
        [self.delegate InterstitialVideoAdFinished];
    }
}

-(void) loadAd{
    [self.ad loadVideoAd];
}

@end