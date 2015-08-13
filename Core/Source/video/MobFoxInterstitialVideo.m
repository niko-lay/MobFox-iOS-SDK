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
    self.ad = [[MobFoxInlineVideoAd alloc] initWithFrame:CGRectMake(0,0,
                                [[UIScreen mainScreen] applicationFrame].size.width,
                                [[UIScreen mainScreen] applicationFrame].size.height)];
    self.ad.adDelegate = self;
    self->_main = main;
    return self;
}

- (NSString *)publisherIdForInlineVideoAd:(MobFoxInlineVideoAd *)banner{
   
    NSString* pubId =  [self.delegate publisherIdForInterstitialVideoAd:self];
   
    return pubId;
}

- (void)InlineVideoAdDidLoadMobFoxAd:(MobFoxInlineVideoAd *)banner{
    UIViewController* vc = [[UIViewController alloc] init];
    [vc.view addSubview:self.ad];
    [self->_main presentViewController:vc animated:TRUE completion:nil];
    
    if ([self.delegate respondsToSelector:@selector(InterstitialVideoAdDidLoadMobFoxAd:)]) {
        [self.delegate InterstitialVideoAdDidLoadMobFoxAd:self];
    }
    
}

- (void)InlineVideoAdDidFailToReceiveAdWithError:(NSError *)error{
    if ([self.delegate respondsToSelector:@selector(InterstitialVideoAdDidFailToReceiveAdWithError:)]) {
        [self.delegate InterstitialVideoAdDidFailToReceiveAdWithError:error];
    }
}

- (void)InlineVideoAdClosed{
    
    [self->_main dismissViewControllerAnimated:YES completion:nil];
    if ([self.delegate respondsToSelector:@selector(InterstitialVideoAdClosed)]) {
        [self.delegate InterstitialVideoAdClosed];
    }
}

- (void)InlineVideoAdClicked{
    if ([self.delegate respondsToSelector:@selector(InterstitialVideoAdClicked)]) {
        [self.delegate InterstitialVideoAdClicked];
    }
}

- (void)InlineVideoAdFinished{
    
    if ([self.delegate respondsToSelector:@selector(InterstitialVideoAdFinished)]) {
        [self.delegate InterstitialVideoAdFinished];
    }
}

-(void) loadAd{
    [self.ad loadAd];
}

@end