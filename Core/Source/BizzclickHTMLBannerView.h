

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

enum {
    BizzClickErrorUnknown = 0,
    BizzClickErrorServerFailure = 1,
    BizzClickErrorInventoryUnavailable = 2,
    BizzClickErrorWrongInput = 3,
};

@class BizzclickHTMLBannerView;

@protocol BizzclickHTMLBannerViewDelegate <NSObject>

- (NSUUID *)appKeyForBizzclickHTMLBanner:(BizzclickHTMLBannerView *)banner;


@optional

- (void)bizzclickHTMLBannerViewDidLoadAd:(BizzclickHTMLBannerView *)banner;

- (void)bizzclickHTMLBannerViewDidLoadRefreshedAd:(BizzclickHTMLBannerView *)banner;

- (void)bizzclickHTMLBannerView:(BizzclickHTMLBannerView *)banner didFailToReceiveAdWithError:(NSError *)error;

- (BOOL)bizzclickHTMLBannerViewActionShouldBegin:(BizzclickHTMLBannerView *)banner willLeaveApplication:(BOOL)willLeave;

- (void)bizzclickHTMLBannerViewActionWillPresent:(BizzclickHTMLBannerView *)banner;

- (void)bizzclickHTMLBannerViewActionWillFinish:(BizzclickHTMLBannerView *)banner;

- (void)bizzclickHTMLBannerViewActionDidFinish:(BizzclickHTMLBannerView *)banner;

- (void)bizzclickHTMLBannerViewActionWillLeaveApplication:(BizzclickHTMLBannerView *)banner;

@end

@interface BizzclickHTMLBannerView : UIView
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