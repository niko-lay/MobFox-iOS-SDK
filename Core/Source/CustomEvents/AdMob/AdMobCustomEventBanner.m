//
//  AdMobCustomEventBanner.m
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 25.02.2014.
//
//

#import "AdMobCustomEventBanner.h"
#import "GADBannerView.h"

@interface AdMobCustomEventBanner()
@property (nonatomic, retain) GADBannerView *adBannerView;
@end

@implementation AdMobCustomEventBanner

- (void)loadBannerWithSize:(CGSize)size optionalParameters:(NSString *)optionalParameters trackingPixel:(NSString *)trackingPixel
{
    [_adBannerView setFrame:CGRectMake(0, 0, size.width, size.height)];
    self.adBannerView.adUnitID = optionalParameters;
    self.adBannerView.rootViewController = [self.delegate viewControllerForPresentingModalView];

    GADRequest *request = [GADRequest request];
    request.testDevices = [NSArray arrayWithObjects: GAD_SIMULATOR_ID, nil];
    [_adBannerView loadRequest:request];
}

- (id)init
{
    self = [super init];
    if (self)
    {
        self.adBannerView = [[GADBannerView alloc] init];
        self.adBannerView.delegate = self;
    }
    return self;
}

- (void)dealloc
{
    self.adBannerView.delegate = nil;
    self.adBannerView = nil;
}

#pragma mark GADBannerViewDelegate methods

- (void)adViewDidReceiveAd:(GADBannerView *)bannerView
{
    [self.delegate customEventBannerDidLoadAd:self.adBannerView];
}

- (void)adView:(GADBannerView *)bannerView
didFailToReceiveAdWithError:(GADRequestError *)error
{
    [self didDisplayAd];
    [self.delegate customEventBannerDidFailToLoadAd];
}

- (void)adViewWillPresentScreen:(GADBannerView *)bannerView
{
    [self.delegate customEventBannerWillExpand];
}

- (void)adViewDidDismissScreen:(GADBannerView *)bannerView
{
    [self.delegate customEventBannerWillClose];
}


@end



