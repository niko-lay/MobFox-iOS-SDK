

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

enum {
    BizzClickErrorUnknown = 0,
    BizzClickErrorServerFailure = 1,
    BizzClickErrorInventoryUnavailable = 2,
    BizzClickErrorWrongInput = 3,
};

@class MobFoxHTMLBannerView;

@protocol BizzclickHTMLBannerViewDelegate <NSObject>

- (NSString *)publisherIdForMobFoxHTMLBannerView:(MobFoxHTMLBannerView *)banner;
- (NSUUID *)appKeyForBizzclickHTMLBanner:(MobFoxHTMLBannerView *)banner;


@optional

- (void)mobfoxHTMLBannerViewDidLoadMobFoxAd:(MobFoxHTMLBannerView *)banner;

- (void)mobfoxHTMLBannerViewDidLoadRefreshedAd:(MobFoxHTMLBannerView *)banner;

- (void)mobfoxHTMLBannerView:(MobFoxHTMLBannerView *)banner didFailToReceiveAdWithError:(NSError *)error;

- (BOOL)mobfoxHTMLBannerViewActionShouldBegin:(MobFoxHTMLBannerView *)banner willLeaveApplication:(BOOL)willLeave;

- (void)mobfoxHTMLBannerViewActionWillPresent:(MobFoxHTMLBannerView *)banner;

- (void)mobfoxHTMLBannerViewActionWillFinish:(MobFoxHTMLBannerView *)banner;

- (void)mobfoxHTMLBannerViewActionDidFinish:(MobFoxHTMLBannerView *)banner;

- (void)mobfoxHTMLBannerViewActionWillLeaveApplication:(MobFoxHTMLBannerView *)banner;

@end

@interface MobFoxHTMLBannerView : UIView
{
	NSString *advertisingSection;
	BOOL bannerLoaded;
	BOOL bannerViewActionInProgress;

	BOOL _tapThroughLeavesApp;
	BOOL _shouldScaleWebView;
	BOOL _shouldSkipLinkPreflight;
	BOOL _statusBarWasVisible;
	NSURL *_tapThroughURL;
    NSInteger _refreshInterval;
	NSTimer *_refreshTimer;
}

@property (nonatomic, assign) IBOutlet __unsafe_unretained id <BizzclickHTMLBannerViewDelegate> delegate;
@property (nonatomic, copy) NSString *advertisingSection;
@property (nonatomic, assign) UIViewAnimationTransition refreshAnimation;

@property (nonatomic, assign) NSInteger adspaceWidth;
@property (nonatomic, assign) NSInteger adspaceHeight;
@property (nonatomic, assign) BOOL adspaceStrict;

@property (nonatomic, readonly, getter=isBannerLoaded) BOOL bannerLoaded;
@property (nonatomic, readonly, getter=isBannerViewActionInProgress) BOOL bannerViewActionInProgress;

@property (nonatomic, assign) BOOL refreshTimerOff;
@property (nonatomic, assign) NSInteger customReloadTime;
@property (nonatomic, retain) UIImage *_bannerImage;
@property (nonatomic, readonly ) NSString *requestURL;
@property (nonatomic, assign) NSInteger userAge;
@property (nonatomic, strong) NSString* userGender;
@property (nonatomic, retain) NSArray* keywords;

@property (nonatomic, assign) BOOL locationAwareAdverts;
@property (nonatomic, retain) CLLocationManager *locationManager;


- (bool)setLocationWithLatitude:(CGFloat)latitude longitude:(CGFloat)longitude;

//- (void)requestAd;
- (BOOL)requestAd: (NSNumber*) adspaceID;

@end

extern NSString * const ErrorDomain;