

#import "MobFoxVideoInterstitialViewController.h"
#import <MediaPlayer/MPMoviePlayerController.h>
#import "NSString+MobFox.h"
#import "DTXMLDocument.h"
#import "DTXMLElement.h"
#import "VASTXMLParser.h"

#import "NSURL+MobFox.h"
#import "MobFoxAdBrowserViewController.h"
#import "MobFoxToolBar.h"

#import "MobFoxBannerView.h"

#import "UIImage+MobFox.h"
#import "UIButton+MobFox.h"

#import <QuartzCore/QuartzCore.h>

#import "UIDevice+IdentifierAddition.h"

#include "MobFoxVideoPlayerViewController.h" 
#include "MobFoxInterstitialPlayerViewController.h"

#import <AdSupport/AdSupport.h>
#import "AdMobCustomEventFullscreen.h"
#import "CustomEvent.h"

NSString * const MobFoxVideoInterstitialErrorDomain = @"MobFoxVideoInterstitial";

@interface MobFoxVideoInterstitialViewController ()<UIGestureRecognizerDelegate, UIActionSheetDelegate, CustomEventFullscreenDelegate> {
    BOOL videoSkipButtonShow;
    NSTimeInterval videoSkipButtonDisplayDelay;
    BOOL videoTimerShow;
    NSInteger videoDuration;
    BOOL videoSkipButtonDisplayed;
    BOOL videoHtmlOverlayDisplayed;
    NSTimeInterval videoHTMLOverlayDisplayDelay;
    BOOL videoVideoFailedToLoad;
    NSInteger videoCheckLoadedCount;
    BOOL videoWasSkipped;
    BOOL interstitialSkipButtonShow;
    BOOL interstitialLoadedFromURL;
    NSTimeInterval interstitialSkipButtonDisplayDelay;
    BOOL interstitialSkipButtonDisplayed;
    BOOL interstitialAutoCloseDisabled;
    NSTimeInterval interstitialAutoCloseDelay;
    BOOL interstitialTimerShow;
    BOOL readyToPlaySecondaryInterstitial;

    BOOL currentlyPlayingInterstitial;
    float statusBarHeight;
    BOOL statusBarWasVisible;
    BOOL videoWasPlaying;
    BOOL videoWasPlayingBeforeResign;
    float buttonSize;
    MobFoxAdType advertTypeCurrentlyPlaying;
    BOOL advertRequestInProgress;
    NSTimeInterval stalledVideoStartTime;

    NSString *adVideoOrientation;
    NSString *adInterstitialOrientation;

    UIViewController *viewController;
    UIViewController *videoViewController;
    UIViewController *interstitialViewController;

    UIView *tempView;
}

@property (nonatomic, strong) MobFoxVideoPlayerViewController *mobFoxVideoPlayerViewController;
@property (nonatomic, strong) MPMoviePlayerController *videoPlayer;
@property (nonatomic, strong) NSMutableArray *videoTopToolbarButtons;
@property (nonatomic, strong) MobFoxToolBar *videoTopToolbar;
@property (nonatomic, strong) NSMutableArray *vastAds;
@property (nonatomic, strong) MobFoxToolBar *videoBottomToolbar;
@property (nonatomic, strong) UIImage *videoPauseButtonImage;
@property (nonatomic, strong) UIImage *videoPlayButtonImage;
@property (nonatomic, strong) UIImage *videoPauseButtonDisabledImage;
@property (nonatomic, strong) UIImage *videoPlayButtonDisabledImage;
@property (nonatomic, strong) NSTimer *videoTimer;
@property (nonatomic, strong) UILabel *videoTimerLabel;
@property (nonatomic, strong) NSString *videoHTMLOverlayHTML;
@property (nonatomic, strong) UIWebView *videoHTMLOverlayWebView;
@property (nonatomic, strong) UIButton *videoSkipButton;
@property (nonatomic, strong) NSTimer *videoStalledTimer;

@property (nonatomic, strong) MobFoxInterstitialPlayerViewController *mobFoxInterstitialPlayerViewController;

@property (nonatomic, retain) CustomEventFullscreen *customEventFullscreen;
@property (nonatomic, retain) NSMutableArray *customEvents;

@property (nonatomic, strong) MobFoxToolBar *interstitialTopToolbar;
@property (nonatomic, strong) MobFoxToolBar *interstitialBottomToolbar;
@property (nonatomic, strong) NSMutableArray *interstitialTopToolbarButtons;
@property (nonatomic, strong) UIView *interstitialHoldingView;
@property (nonatomic, strong) UIWebView *interstitialWebView;
@property (nonatomic, strong) NSDate *timerStartTime;
@property (nonatomic, strong) NSTimer *interstitialTimer;
@property (nonatomic, strong) UILabel *interstitialTimerLabel;
@property (nonatomic, strong) NSString *interstitialMarkup;
@property (nonatomic, strong) UIButton *browserBackButton;
@property (nonatomic, strong) UIButton *browserForwardButton;
@property (nonatomic, strong) NSString *interstitialURL;
@property (nonatomic, strong) UIButton *interstitialSkipButton;

@property (nonatomic, strong) NSMutableArray *advertTrackingEvents;
@property (nonatomic, strong) NSString *advertAnimation;

@property (nonatomic, strong) NSString *demoAdTypeToShow;
@property (nonatomic, strong) NSString *IPAddress;

@property (nonatomic, assign) CGFloat currentLatitude;
@property (nonatomic, assign) CGFloat currentLongitude;

@property(nonatomic, readwrite, getter=isAdvertLoaded) BOOL advertLoaded;
@property(nonatomic, readwrite, getter=isAdvertViewActionInProgress) BOOL advertViewActionInProgress;

@property (nonatomic, strong) NSString *userAgent;

@property (nonatomic, strong) NSMutableDictionary *browserUserAgentDict;

- (BOOL)videoCreateAdvert:(DTXMLElement*)videoElement;
- (BOOL)videoCreateTopToolbar:(DTXMLElement*)xml;
- (BOOL)videoCreateBottomToolbar:(DTXMLElement*)xml;
- (void)videoReplayButtonAction:(id)sender;
- (void)videoStartTimer;
- (void)videoStopTimer;
- (void)videoShowSkipButton;
- (void)videoShowHTMLOverlay;
- (void)videoPlayAdvert;
- (void)videoStalledStartTimer;
- (void)videoStalledStopTimer;
- (void)videoFailedToLoad;
- (void)checkVideoLoadedAndReadyToPlay;
- (void)checkVideoToInterstitialVideoLoadedAndReadyToPlay:(NSDictionary*)dictionary;
- (void)videoTidyUpAfterAnimationOut;
- (void)videoTidyUpAfterInterstitialToVideoAnimationOut;

- (BOOL)interstitialCreateAdvert:(DTXMLElement*)interstitialElement;
- (BOOL)interstitialCreateTopToolbar:(DTXMLElement*)xml;
- (BOOL)interstitialCreateBottomToolbarBottomToolbar:(DTXMLElement*)xml;
- (void)interstitialLoadWebPage;
- (void)interstitialStartTimer;
- (void)interstitialStopTimer;
- (void)interstitialSkipAction:(id)sender;
- (void)interstitialPlayAdvert;

- (void)advertAddNotificationObservers:(MobFoxAdGroupType)adGroup;
- (void)advertRemoveNotificationObservers:(MobFoxAdGroupType)adGroup;
- (void)advertCreationFailed;
- (void)advertCreatedSuccessfully:(MobFoxAdType)advertType;
- (void)advertActionTrackingEvent:(NSString*)eventType;
- (void)advertAnimateIn:(NSString*)animationType advertTypeLoaded:(MobFoxAdType)advertType viewToAnimate:(UIView*)viewToAnimate;
- (void)advertAnimateOut:(NSString*)animationType advertTypeLoaded:(MobFoxAdType)advertType viewToAnimate:(UIView*)viewToAnimate;
- (void)advertTidyUpAfterAnimationOut:(MobFoxAdType)advertType;
- (void)videoToInterstitialAnimateSecondaryIn:(NSString*)animationType advertTypeLoaded:(MobFoxAdType)advertType viewToAnimate:(UIView*)viewToAnimate;
- (void)interstitialToVideoAnimateSecondaryOut:(NSString*)animationType viewToAnimate:(UIView*)viewToAnimate;

- (void)setup;
- (void)showStatusBarIfNecessary;
- (void)hideStatusBar;

- (void)applyFrameSize:(UIInterfaceOrientation)interfaceOrientation;
- (void)applyToolbarFrame:(MobFoxToolBar*)theToolBar bottomToolbar:(BOOL)bottomToolbar orientation:(UIInterfaceOrientation)interfaceOrientation;
- (void)updateAllFrames:(UIInterfaceOrientation)interfaceOrientation;
- (CGRect)returnVideoHTMLOverlayFrame;
- (CGRect)returnInterstitialWebFrame;
- (NSString*)returnDeviceIPAddress;

@end


@implementation MobFoxVideoInterstitialViewController

@synthesize delegate, locationAwareAdverts, currentLatitude, currentLongitude, advertLoaded, advertViewActionInProgress, requestURL;

@synthesize demoAdTypeToShow, advertAnimation,advertTrackingEvents, IPAddress;
@synthesize mobFoxVideoPlayerViewController, videoPlayer, videoTopToolbar, videoBottomToolbar, videoTopToolbarButtons, videoSkipButton, videoStalledTimer; 
@synthesize videoPauseButtonDisabledImage, videoPlayButtonDisabledImage,videoPauseButtonImage, videoPlayButtonImage, videoTimer, videoTimerLabel, interstitialTimer;
@synthesize videoHTMLOverlayHTML, videoHTMLOverlayWebView;
@synthesize timerStartTime, interstitialTimerLabel;
@synthesize interstitialTopToolbar, interstitialBottomToolbar, interstitialTopToolbarButtons, interstitialSkipButton;
@synthesize interstitialURL, interstitialHoldingView, interstitialWebView, interstitialMarkup, browserBackButton, browserForwardButton;
@synthesize userAgent;
@synthesize vastAds;

static float animationDuration = 0.50;

#pragma mark - Init/Dealloc Methods

- (UIColor *)randomColor
{
    CGFloat red = (arc4random()%256)/256.0;
    CGFloat green = (arc4random()%256)/256.0;
    CGFloat blue = (arc4random()%256)/256.0;

    return [UIColor colorWithRed:red green:green blue:blue alpha:1.0];
}

- (id)init {
    self = [super init];
    if (self) {
        [self setup];
    }
    return self;
}

- (void)setup
{
    UIWebView* webView = [[UIWebView alloc] initWithFrame:CGRectZero];
    self.userAgent = [webView stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];

    [self setUpBrowserUserAgentStrings];

    if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPhone)
    {
        buttonSize = 30.0f;
    }
    else
    {
        buttonSize = 50.0f;
    }
    UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];

    if (UIInterfaceOrientationIsPortrait(interfaceOrientation)) {
        statusBarHeight = [UIApplication sharedApplication].statusBarFrame.size.height;
    } else {
        statusBarHeight = [UIApplication sharedApplication].statusBarFrame.size.width;
    }

    CGRect mainFrame = [UIScreen mainScreen].applicationFrame;
    self.view = [[UIView alloc] initWithFrame:mainFrame];
    self.view.backgroundColor = [UIColor clearColor];

	self.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    self.wantsFullScreenLayout = YES;
    self.view.autoresizesSubviews = YES;

    self.view.alpha = 0.0f;
    self.view.hidden = YES;
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appDidBecomeActive:) name:UIApplicationDidBecomeActiveNotification object:nil];
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appWillResignActive:) name:UIApplicationWillResignActiveNotification object:nil];

    self.IPAddress = [self returnDeviceIPAddress];

}

- (void)viewDidLoad
{
    [super viewDidLoad];

}

- (void)viewDidUnload
{
    [super viewDidUnload];

}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return YES;
}

-(BOOL)shouldAutorotate {
    return YES;
}

- (NSUInteger)supportedInterfaceOrientations{
    return UIInterfaceOrientationMaskAll;
}

- (void)dealloc 
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];

    self.delegate = nil;
    [self videoStopTimer]; 
    [self interstitialStopTimer];

    self.videoHTMLOverlayWebView.delegate = nil;
}

#pragma mark - Utilities

- (void)setUpBrowserUserAgentStrings {

    NSArray *array;
    self.browserUserAgentDict = [NSMutableDictionary dictionaryWithCapacity:0];
	array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.2.2"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.2.1"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.2"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.1.9"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.1.8"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.1.7"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.1.6"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.1.5"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.1.4"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.1.3"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.1.2"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.1.1"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.1"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.0.2"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.0.1"];
    array = @[@" Version/6.0", @" Safari/8536.25"];
    [self.browserUserAgentDict setObject:array forKey:@"6.0"];
    array = @[@" Version/5.1", @" Safari/7534.48.3"];
    [self.browserUserAgentDict setObject:array forKey:@"5.1.1"];
    array = @[@" Version/5.1", @" Safari/7534.48.3"];
    [self.browserUserAgentDict setObject:array forKey:@"5.1"];
    array = @[@" Version/5.1", @" Safari/7534.48.3"];
    [self.browserUserAgentDict setObject:array forKey:@"5.0.1"];
    array = @[@" Version/5.1", @" Safari/7534.48.3"];
    [self.browserUserAgentDict setObject:array forKey:@"5.0"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.3.5"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.3.4"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.3.3"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.3.2"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.3.1"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.3"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.2.10"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.2.9"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.2.8"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.2.7"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.2.6"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.2.5"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.2.1"];
    array = @[@" Version/5.0.2", @" Safari/6533.18.5"];
    [self.browserUserAgentDict setObject:array forKey:@"4.2"];
    array = @[@" Version/4.0.5", @" Safari/6531.22.7"];
    [self.browserUserAgentDict setObject:array forKey:@"4.1"];
}

- (NSString*)browserAgentString
{

    NSString *osVersion = [UIDevice currentDevice].systemVersion;
    NSArray *agentStringArray = self.browserUserAgentDict[osVersion];

    NSMutableString *agentString = [NSMutableString stringWithString:self.userAgent];
    NSRange range = [agentString rangeOfString:@"like Gecko)"];

    if (range.location != NSNotFound && range.length) {

        NSInteger theIndex = range.location + range.length;

		if ([agentStringArray objectAtIndex:0]) {
			[agentString insertString:[agentStringArray objectAtIndex:0] atIndex:theIndex];
			[agentString appendString:[agentStringArray objectAtIndex:1]];
		}
        else {
			[agentString insertString:@" Version/unknown" atIndex:theIndex];
			[agentString appendString:@" Safari/unknown"];
		}

    }

    return agentString;
}

- (NSString*)returnDeviceIPAddress {

    NSString *IPAddressToReturn;

    #if TARGET_IPHONE_SIMULATOR
        IPAddressToReturn = [UIDevice localSimulatorIPAddress];
    #else

        IPAddressToReturn = [UIDevice localWiFiIPAddress];

        if(!IPAddressToReturn) {
            IPAddressToReturn = [UIDevice localCellularIPAddress];
        }

    #endif

    return IPAddressToReturn;
}

- (id) traverseResponderChainForUIViewController 
{
    id nextResponder = [self nextResponder];
    if ([nextResponder isKindOfClass:[UIViewController class]]) {
        return nextResponder;
    } else if ([nextResponder isKindOfClass:[UIView class]]) {
        return [nextResponder traverseResponderChainForUIViewController];
    } else {
        return nil;
    }
}

- (UIViewController *) firstAvailableUIViewController 
{
    return (UIViewController *)[self traverseResponderChainForUIViewController];
}

- (void)removeUIWebViewBounce:(UIWebView*)theWebView {

    for (id subview in theWebView.subviews) {
        if ([[subview class] isSubclassOfClass: [UIScrollView class]]) {
            ((UIScrollView *)subview).bounces = NO;
        }
    }

}

- (void)showErrorLabelWithText:(NSString *)text
{
	UILabel *label = [[UILabel alloc] initWithFrame:self.view.bounds];
	label.numberOfLines = 0;
	label.backgroundColor = [UIColor clearColor];
	label.font = [UIFont boldSystemFontOfSize:12];
	label.textAlignment = UITextAlignmentCenter;
	label.textColor = [UIColor redColor];

	label.text = text;
	[self.view addSubview:label];
}

- (NSString *)extractStringFromContents:(NSString *)beginningString endingString:(NSString *)endingString contents:(NSString *)contents {
    if (!contents) {
        return nil;
    }

	NSMutableString *localContents = [NSMutableString stringWithString:contents];
	NSRange theRangeBeginning = [localContents rangeOfString:beginningString options:NSCaseInsensitiveSearch];
	if (theRangeBeginning.location == NSNotFound) {
		return nil;
	}
	int location = theRangeBeginning.location + theRangeBeginning.length;
	int length = [localContents length] - location;
	NSRange theRangeToSearch = {location, length};
	NSRange theRangeEnding = [localContents rangeOfString:endingString options:NSCaseInsensitiveSearch range:theRangeToSearch];
	if (theRangeEnding.location == NSNotFound) {
		return nil;
	}
	location = theRangeBeginning.location + theRangeBeginning.length ; 
	length = theRangeEnding.location - location;
	if (length == 0) {
		return nil;
	}
	NSRange theRangeToGet = {location, length};
	return [localContents substringWithRange:theRangeToGet];	
}

- (MobFoxAdType)adTypeEnumValue:(NSString*)adType {

    if ([adType isEqualToString:@"video-to-interstitial"]) {
        return MobFoxAdTypeVideoToInterstitial;
    }

    if ([adType isEqualToString:@"video"]) {
        return MobFoxAdTypeVideo;
    }

    if ([adType isEqualToString:@"interstitial"]) {
        return MobFoxAdTypeInterstitial;
    }

    if ([adType isEqualToString:@"interstitial-to-video"]) {
        return MobFoxAdTypeInterstitialToVideo;
    }

    if ([adType isEqualToString:@"noAd"]) {
        return MobFoxAdTypeNoAdInventory;
    }

    if ([adType isEqualToString:@"error"]) {
        return MobFoxAdTypeError;
    }
    
    if ([adType isEqualToString:@"textAd"]) {
        return MobFoxAdTypeText;
    }
    
    if ([adType isEqualToString:@"imageAd"]) {
        return MobFoxAdTypeImage;
    }
    
    if ([adType isEqualToString:@"mraidAd"]) {
        return MobFoxAdTypeMraid;
    }

    return MobFoxAdTypeUnknown;
}

- (NSURL *)serverURL
{
	return [NSURL URLWithString:self.requestURL];
}

#pragma mark Properties

#pragma mark - Demo Ad Requests

- (void)requestDemoVideoAdvert {
    self.demoAdTypeToShow = @"Video";

    [self requestAd];
}

- (void)requestDemoInterstitualAdvert {
    self.demoAdTypeToShow = @"Interstitial";

    [self requestAd];
}

- (void)requestDemoVideoToInterstitualAdvert {
    self.demoAdTypeToShow = @"VideoToInterstitial";

    [self requestAd];
}

- (void)requestDemoInterstitualToVideoAdvert {
    self.demoAdTypeToShow = @"InterstitialToVideo";

    [self requestAd];
}

#pragma mark - Location

- (void)setLocationWithLatitude:(CGFloat)latitude longitude:(CGFloat)longitude {
    self.currentLatitude = latitude;
    self.currentLongitude = longitude;
}

#pragma mark - Ad Request

- (void)requestAd
{
    if (self.advertLoaded || self.advertViewActionInProgress || advertRequestInProgress) {
        return;
    }

    if (!delegate)
	{
		[self showErrorLabelWithText:@"MobFoxVideoInterstitialViewDelegate not set"];

		return;
	}
	if (![delegate respondsToSelector:@selector(publisherIdForMobFoxVideoInterstitialView:)])
	{
		[self showErrorLabelWithText:@"MobFoxVideoInterstitialViewDelegate does not implement publisherIdForMobFoxBannerView:"];

		return;
	}

	NSString *publisherId = [delegate publisherIdForMobFoxVideoInterstitialView:self];
	if (![publisherId length])
	{
		[self showErrorLabelWithText:@"MobFoxVideoInterstitialViewDelegate returned invalid publisher ID."];

        NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Invalid publisher ID or Publisher ID not set" forKey:NSLocalizedDescriptionKey];

        NSError *error = [NSError errorWithDomain:MobFoxVideoInterstitialErrorDomain code:MobFoxInterstitialViewErrorInventoryUnavailable userInfo:userInfo];
        [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];

		return;
	}
	[self performSelectorInBackground:@selector(asyncRequestAdWithPublisherId:) withObject:publisherId];

}

- (void)asyncRequestAdWithPublisherId:(NSString *)publisherId
{
	@autoreleasepool
	{
        NSString *mRaidCapable = @"1";
        
        NSString *adWidth = @"320";
        NSString *adHeight = @"480";
        NSString *adStrict = @"1";
        
        NSString *requestType;
        if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPhone)
        {
            requestType = @"iphone_app";
        }
        else
        {
            requestType = @"ipad_app";
        }
        
        NSString *osVersion = [UIDevice currentDevice].systemVersion;
        
        NSString *requestString;
        
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 60000
        NSString *iosadvid;
        if ([ASIdentifierManager instancesRespondToSelector:@selector(advertisingIdentifier )]) {
            iosadvid = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
            NSString *o_iosadvidlimit = @"0";
            if (NSClassFromString(@"ASIdentifierManager")) {
                
                if (![ASIdentifierManager sharedManager].advertisingTrackingEnabled) {
                    o_iosadvidlimit = @"1";
                }
            }
            
            requestString=[NSString stringWithFormat:@"c.mraid=%@&o_iosadvidlimit=%@&rt=%@&u=%@&u_wv=%@&u_br=%@&o_iosadvid=%@&v=%@&s=%@&iphone_osversion=%@",
						   [mRaidCapable stringByUrlEncoding],
						   [o_iosadvidlimit stringByUrlEncoding],
						   [requestType stringByUrlEncoding],
						   [self.userAgent stringByUrlEncoding],
						   [self.userAgent stringByUrlEncoding],
						   [[self browserAgentString] stringByUrlEncoding],
						   [iosadvid stringByUrlEncoding],
						   [SDK_VERSION stringByUrlEncoding],
						   [publisherId stringByUrlEncoding],
						   [osVersion stringByUrlEncoding]];
            
        } else {
			requestString=[NSString stringWithFormat:@"c.mraid=%@&rt=%@&u=%@&u_wv=%@&u_br=%@&v=%@&s=%@&iphone_osversion=%@",
                           [mRaidCapable stringByUrlEncoding],
                           [requestType stringByUrlEncoding],
                           [self.userAgent stringByUrlEncoding],
                           [self.userAgent stringByUrlEncoding],
                           [[self browserAgentString] stringByUrlEncoding],
                           [SDK_VERSION stringByUrlEncoding],
                           [publisherId stringByUrlEncoding],
                           [osVersion stringByUrlEncoding]];
            
        }
#else
        
        requestString=[NSString stringWithFormat:@"c.mraid=%@&rt=%@&u=%@&u_wv=%@&u_br=%@&v=%@&s=%@&iphone_osversion=%@",
                       [mRaidCapable stringByUrlEncoding],
                       [requestType stringByUrlEncoding],
                       [self.userAgent stringByUrlEncoding],
                       [self.userAgent stringByUrlEncoding],
                       [[self browserAgentString] stringByUrlEncoding],
                       [SDK_VERSION stringByUrlEncoding],
                       [publisherId stringByUrlEncoding],
                       [osVersion stringByUrlEncoding]];
        
#endif
        NSString *requestStringWithLocation;
        if(locationAwareAdverts && self.currentLatitude && self.currentLongitude)
        {
            NSString *latitudeString = [NSString stringWithFormat:@"%+.6f", self.currentLatitude];
            NSString *longitudeString = [NSString stringWithFormat:@"%+.6f", self.currentLongitude];
            
            requestStringWithLocation = [NSString stringWithFormat:@"%@&latitude=%@&longitude=%@",
                                         requestString,
                                         [latitudeString stringByUrlEncoding],
                                         [longitudeString stringByUrlEncoding]
                                         ];
        }
        else
        {
            requestStringWithLocation = requestString;
        }
        
        
        NSString *fullRequestString;

        fullRequestString = [NSString stringWithFormat:@"%@&adspace.width=%@&adspace.height=%@&adspace.strict=%@",
                                 requestStringWithLocation,
                                 [adWidth stringByUrlEncoding],
                                 [adHeight stringByUrlEncoding],
                                 [adStrict stringByUrlEncoding]
                                 ];

        
        NSURL *serverURL = [self serverURL];
        
        if (!serverURL) {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error - no or invalid requestURL. Please set requestURL" forKey:NSLocalizedDescriptionKey];
            
            NSError *error = [NSError errorWithDomain:MobFoxVideoInterstitialErrorDomain code:MobFoxInterstitialViewErrorUnknown userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }
        
        NSURL *url;
        url = [NSURL URLWithString:[NSString stringWithFormat:@"%@?%@", serverURL, fullRequestString]];

        
        NSMutableURLRequest *request;
        NSError *error;
        NSURLResponse *response;
        NSData *dataReply;
        
        request = [NSMutableURLRequest requestWithURL:url];
        [request setHTTPMethod: @"GET"];
        [request setValue:@"text/xml" forHTTPHeaderField:@"Accept"];
        [request setValue:self.userAgent forHTTPHeaderField:@"User-Agent"];
        
        dataReply = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
        
        DTXMLDocument *xml = [DTXMLDocument documentWithData:dataReply];
        
        if (!xml)
        {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error parsing xml response from server" forKey:NSLocalizedDescriptionKey];
            
            NSError *error = [NSError errorWithDomain:MobFoxVideoInterstitialErrorDomain code:MobFoxInterstitialViewErrorUnknown userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }
        NSString *bannerUrlString = [xml.documentRoot getNamedChild:@"imageurl"].text;
        
        if ([bannerUrlString length])
        {
            NSURL *bannerUrl = [NSURL URLWithString:bannerUrlString];
            _bannerImage = [[UIImage alloc]initWithData:[NSData dataWithContentsOfURL:bannerUrl]];
        }
        
        [self performSelectorOnMainThread:@selector(advertCreateFromXML:) withObject:xml waitUntilDone:YES];
        
	}
    
}


#pragma mark - Ad Creation

- (void)advertCreateFromXML:(DTXMLDocument *)xml
{
	if ([xml.documentRoot.name isEqualToString:@"error"])
	{
		NSString *errorMsg = xml.documentRoot.text;

		NSDictionary *userInfo = [NSDictionary dictionaryWithObject:errorMsg forKey:NSLocalizedDescriptionKey];

		NSError *error = [NSError errorWithDomain:MobFoxVideoInterstitialErrorDomain code:MobFoxInterstitialViewErrorUnknown userInfo:userInfo];
		[self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
		return;	
	}
    NSString *adType = [xml.documentRoot.attributes objectForKey:@"type"];
    self.advertAnimation = [xml.documentRoot.attributes objectForKey:@"animation"];
    
    if ([adType isEqualToString:@"vast"]) {
        DTXMLElement *htmlElement = [xml.documentRoot getNamedChild:@"htmlString"];
        advertTypeCurrentlyPlaying = [self VASTDecideTypeOfAdvert:htmlElement];
    } else {
         advertTypeCurrentlyPlaying = [self adTypeEnumValue:adType];
    }

    videoWasSkipped = NO;
    videoCheckLoadedCount = 0;
    
    //custom events:
    [_customEvents removeAllObjects];
    DTXMLElement *customEventsElement = [xml.documentRoot getNamedChild:@"customevents"];
    if(customEventsElement)
    {
        NSArray *customEventElements = [customEventsElement getNamedChildren:@"customevent"];
        for(int i=0; i<[customEventElements count];i++)
        {
            DTXMLElement *customEventElement = [customEventElements objectAtIndex:i];
            CustomEvent *customEvent = [[CustomEvent alloc] init];
            customEvent.className = [customEventElement getNamedChild:@"class"].text;
            customEvent.optionalParameter = [customEventElement getNamedChild:@"classparameter"].text;
            customEvent.pixelUrl = [customEventElement getNamedChild:@"pixel"].text;
            [_customEvents addObject:customEvent];
        }
    }
    if([_customEvents count] > 0)
    {
        [self loadCustomEvent];
        if(!_customEventFullscreen)
        {
            [_customEvents removeAllObjects];
        }
    }
    //eo custom events
    
    
    

    switch (advertTypeCurrentlyPlaying) {
        case MobFoxAdTypeVideo:{

            DTXMLElement *htmlElement = [xml.documentRoot getNamedChild:@"htmlString"];

            if ([self videoCreateAdvert:htmlElement]) {

                [self checkVideoLoadedAndReadyToPlay];

            } else {
                [self videoFailedToLoad];
            }

            break;
        }

        case MobFoxAdTypeInterstitial:{
            DTXMLElement *htmlElement = [xml.documentRoot getNamedChild:@"htmlString"];
            if ([self interstitialCreateAdvert:htmlElement]) {

                [self advertCreatedSuccessfully:MobFoxAdTypeInterstitial];

            } else {
                [self advertCreationFailed];
            }
            break;

        }

        case MobFoxAdTypeVideoToInterstitial:{
            DTXMLElement *htmlElement = [xml.documentRoot getNamedChild:@"htmlString"];

            if ([self videoCreateAdvert:htmlElement]) {

                NSNumber *adType = [NSNumber numberWithInt:MobFoxAdTypeVideoToInterstitial];

                NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                            htmlElement, @"interstitialElement",
                                            adType, @"adType", nil];
                [NSTimer scheduledTimerWithTimeInterval:0.1 target:self selector:@selector(checkVideoToInterstitialVideoLoadedAndReadyToPlay:) userInfo:dictionary repeats:NO];

            } else {
                [self videoFailedToLoad];
            }

            break;
        }

        case MobFoxAdTypeInterstitialToVideo:{
            DTXMLElement *htmlElement = [xml.documentRoot getNamedChild:@"htmlString"];

            if ([self videoCreateAdvert:htmlElement]) {

                NSNumber *adType = [NSNumber numberWithInt:MobFoxAdTypeInterstitialToVideo];

                NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                            htmlElement, @"interstitialElement",
                                            adType, @"adType", nil];
                [NSTimer scheduledTimerWithTimeInterval:0.1 target:self selector:@selector(checkVideoToInterstitialVideoLoadedAndReadyToPlay:) userInfo:dictionary repeats:NO];

            } else {
                [self videoFailedToLoad];
            }

            break;
        }
            
        case MobFoxAdTypeText:
        case MobFoxAdTypeImage:
        case MobFoxAdTypeMraid: {
            if ([self interstitialFromBannerCreateAdvert:xml]) {
                [self advertCreatedSuccessfully:advertTypeCurrentlyPlaying];
            } else {
                [self videoFailedToLoad];
            }
            break;
        }
            
        case MobFoxAdTypeNoAdInventory:{

            if([_customEvents count] == 0)
            {
                NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"No inventory for ad request" forKey:NSLocalizedDescriptionKey];
                NSError *error = [NSError errorWithDomain:MobFoxVideoInterstitialErrorDomain code:MobFoxInterstitialViewErrorInventoryUnavailable userInfo:userInfo];
                [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            }
                return;

            break;
        }
        case MobFoxAdTypeError:{

            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Unknown error" forKey:NSLocalizedDescriptionKey];

            NSError *error = [NSError errorWithDomain:MobFoxVideoInterstitialErrorDomain code:MobFoxInterstitialViewErrorUnknown userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            break;
        }


        default: {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:[NSString stringWithFormat:@"Unknown ad type '%@'", adType] forKey:NSLocalizedDescriptionKey];

            NSError *error = [NSError errorWithDomain:MobFoxVideoInterstitialErrorDomain code:MobFoxInterstitialViewErrorUnknown userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            break;

        }
    }

}

- (void) loadCustomEvent
{
    _customEventFullscreen = nil;
    while ([_customEvents count] > 0 && !_customEventFullscreen)
    {
        CustomEvent *event = [_customEvents objectAtIndex:0];
        [_customEvents removeObjectAtIndex:0];
        if ([event.className isEqualToString:@"AdMob"])
            {
                _customEventFullscreen = [[AdMobCustomEventFullscreen alloc]init];
                _customEventFullscreen.delegate = self;
                [_customEventFullscreen loadFullscreenWithOptionalParameters:event.optionalParameter trackingPixel:event.pixelUrl];
            }
    }
}

- (BOOL)interstitialFromBannerCreateAdvert:(DTXMLDocument*)document {
    interstitialAutoCloseDisabled = YES;
    interstitialSkipButtonDisplayed = YES;
    
    
    self.mobFoxInterstitialPlayerViewController = [[MobFoxInterstitialPlayerViewController alloc] init];
    self.mobFoxInterstitialPlayerViewController.adInterstitialOrientation = adInterstitialOrientation;
    self.mobFoxInterstitialPlayerViewController.view.backgroundColor = [UIColor clearColor];
    self.mobFoxInterstitialPlayerViewController.view.frame = self.view.bounds;
    self.mobFoxInterstitialPlayerViewController.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    self.interstitialHoldingView = [[UIView alloc] initWithFrame:self.view.bounds];
    self.interstitialHoldingView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    self.interstitialHoldingView.backgroundColor = [UIColor clearColor];
    self.interstitialHoldingView.autoresizesSubviews = YES;
    
    MobFoxBannerView* bannerView = [[MobFoxBannerView alloc] init];
    bannerView.allowDelegateAssigmentToRequestAd = NO;
    
//    bannerView.delegate = self;
    bannerView._bannerImage = _bannerImage;
    
    [bannerView performSelectorOnMainThread:@selector(setupAdFromXml:) withObject:document waitUntilDone:YES];
    
    [self.interstitialHoldingView addSubview:bannerView];
    
    interstitialSkipButtonShow = YES;
    
    UIImage *buttonImage = [UIImage mobfoxSkipButtonImage];
    UIImage *buttonDisabledImage = buttonDisabledImage = [UIImage mobfoxSkipButtonDisabledImage];
    
    float skipButtonSize = buttonSize + 4.0f;
                
    self.interstitialSkipButton=[UIButton buttonWithType:UIButtonTypeCustom];
    [self.interstitialSkipButton setFrame:CGRectMake(0, 0, skipButtonSize, skipButtonSize)];
    [self.interstitialSkipButton addTarget:self action:@selector(interstitialSkipAction:) forControlEvents:UIControlEventTouchUpInside];
    [self.interstitialSkipButton setImage:buttonImage forState:UIControlStateNormal];
    [self.interstitialSkipButton setImage:buttonDisabledImage forState:UIControlStateHighlighted];
  
    self.interstitialSkipButton.autoresizingMask = UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleBottomMargin;

    return [bannerView isBannerLoaded];
}


- (BOOL)interstitialCreateAdvert:(DTXMLElement*)interstitialElement {
    vastAds = [VASTXMLParser parseVAST: interstitialElement];
    if(!vastAds) return NO;
    
    
    VAST_Creative *creative;
    VAST_Companion *companion;
    
    for(VAST_Ad* ad in vastAds) {
        if(ad.InLine) {
            for(VAST_Creative* c in ad.InLine.creatives) {
                if(c.companionAds && c.companionAds.companions.count != 0)
                {
                    creative = c;
                    companion = [c.companionAds.companions objectAtIndex:0];
                    break;
                }
            }
        }
        if(companion) break;
    }
    
    if(!companion)
    {
        return NO;
    }
    
    interstitialAutoCloseDisabled = YES;
    interstitialSkipButtonDisplayed = YES;
    
    
    if (companion.staticResource)
    {
        interstitialLoadedFromURL = NO;
        if([companion.staticResource.type rangeOfString:@"image"].location != NSNotFound)
        {
            self.interstitialMarkup = [NSString stringWithFormat: @"<img src=\"%@\">",companion.staticResource.url];
        }
        else if([companion.staticResource.type rangeOfString:@"x-javascript"].location != NSNotFound)
        {
            self.interstitialMarkup = [NSString stringWithFormat: @"<script src=\"%@\"></script>",companion.staticResource.url];
        }
        
    }
    else if(companion.iFrameResource)
    {
        self.interstitialURL = companion.iFrameResource;
        if (self.interstitialURL) {
            NSError* error = nil;
            self.interstitialMarkup = [NSString stringWithContentsOfURL:[NSURL URLWithString:self.interstitialURL] encoding:NSUTF8StringEncoding error:&error];
            
            interstitialLoadedFromURL = YES;
        }
    }
    else if(companion.htmlResource)
    {
        self.interstitialMarkup = companion.htmlResource;
        interstitialLoadedFromURL = NO;
    }
    else
    {
        return NO;
    }

    if (self.interstitialMarkup) {
        self.mobFoxInterstitialPlayerViewController = [[MobFoxInterstitialPlayerViewController alloc] init];
        self.mobFoxInterstitialPlayerViewController.adInterstitialOrientation = adInterstitialOrientation;
        self.mobFoxInterstitialPlayerViewController.view.backgroundColor = [UIColor clearColor];
        self.mobFoxInterstitialPlayerViewController.view.frame = self.view.bounds;
        self.mobFoxInterstitialPlayerViewController.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        self.interstitialHoldingView = [[UIView alloc] initWithFrame:self.view.bounds];
        self.interstitialHoldingView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        self.interstitialHoldingView.backgroundColor = [UIColor clearColor];
        self.interstitialHoldingView.autoresizesSubviews = YES;
        self.interstitialWebView = [[UIWebView alloc]initWithFrame:self.view.bounds];
        self.interstitialWebView.delegate = (id)self;
        self.interstitialWebView.dataDetectorTypes = UIDataDetectorTypeAll;
        self.interstitialWebView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        self.interstitialWebView.allowsInlineMediaPlayback = YES;
        self.interstitialWebView.scalesPageToFit = YES;

        [self removeUIWebViewBounce:self.interstitialWebView];

        [self interstitialLoadWebPage];
        UITapGestureRecognizer *touch = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleSingleTap:)]; 
        touch.delegate = self;
        [self.interstitialWebView addGestureRecognizer:touch];

        DTXMLElement *navigationBarsElement = [interstitialElement getNamedChild:@"navigation"];

        BOOL adInterstitialToolbarBarsShow = [[navigationBarsElement.attributes objectForKey:@"show"] isEqualToString:@"1"];

        if (adInterstitialToolbarBarsShow) {
            if ([self interstitialCreateTopToolbar:navigationBarsElement]) {
                [self.interstitialHoldingView addSubview:self.interstitialTopToolbar];
            }

            if ([self interstitialCreateBottomToolbarBottomToolbar:navigationBarsElement]) {
                [self.interstitialHoldingView addSubview:self.interstitialBottomToolbar];
            }

        }
        self.interstitialWebView.frame = [self returnInterstitialWebFrame];
        [self.interstitialHoldingView addSubview:self.interstitialWebView];
        NSMutableDictionary *skipButtonElementAttributes = [interstitialElement getNamedChild:@"skipbutton"].attributes;
        interstitialSkipButtonShow = [[skipButtonElementAttributes objectForKey:@"show"] isEqualToString:@"1"];
        if(interstitialSkipButtonShow || !adInterstitialToolbarBarsShow) {

            UIBarButtonItem *flexiblespace = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:
                                              UIBarButtonSystemItemFlexibleSpace target:nil action:nil];

            interstitialSkipButtonDisplayDelay = (NSTimeInterval)[[skipButtonElementAttributes objectForKey:@"showafter"] doubleValue];
            UIImage *buttonImage = [UIImage imageNamed:@""];
            UIImage *buttonDisabledImage = [UIImage imageNamed:@""];

            NSString *adSkipButtonGraphicURL = [skipButtonElementAttributes objectForKey:@"graphic"];

            if (![adSkipButtonGraphicURL isEqualToString:@""]) {

                NSURL *imageURL = [NSURL URLWithString:adSkipButtonGraphicURL];
                buttonImage = [[UIImage alloc]initWithData:[NSData dataWithContentsOfURL:imageURL]];
                buttonDisabledImage = buttonImage;
            }
            if (!buttonImage) {
                buttonImage = [UIImage mobfoxSkipButtonImage];
                buttonDisabledImage = [UIImage mobfoxSkipButtonDisabledImage];
            }

            if (buttonImage) {
                float skipButtonSize = buttonSize + 4.0f;

                self.interstitialSkipButton=[UIButton buttonWithType:UIButtonTypeCustom];
                [self.interstitialSkipButton setFrame:CGRectMake(0, 0, skipButtonSize, skipButtonSize)];
                [self.interstitialSkipButton addTarget:self action:@selector(interstitialSkipAction:) forControlEvents:UIControlEventTouchUpInside];
                [self.interstitialSkipButton setImage:buttonImage forState:UIControlStateNormal];
                [self.interstitialSkipButton setImage:buttonDisabledImage forState:UIControlStateHighlighted];

                if (self.interstitialTopToolbar) {
                    UIBarButtonItem *theButton = [[UIBarButtonItem alloc] initWithCustomView:self.interstitialSkipButton];
                    self.interstitialTopToolbarButtons = [NSMutableArray arrayWithArray:self.interstitialTopToolbar.items];
                    [self.interstitialTopToolbarButtons addObject:flexiblespace];
                    [self.interstitialTopToolbarButtons addObject:theButton];

                }   else {

                    self.interstitialSkipButton.autoresizingMask = UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleBottomMargin;

                } 
            }

        }
        return YES;

    }

    return NO;
}

- (BOOL)interstitialCreateTopToolbar:(DTXMLElement*)xml {

    NSMutableDictionary *topBarElementAttributes = [xml getNamedChild:@"topbar"].attributes;

    BOOL topBarShow = [[topBarElementAttributes objectForKey:@"show"] isEqualToString:@"1"];

    if (topBarShow) {
        self.interstitialTopToolbar = [[MobFoxToolBar alloc] initWithFrame:CGRectZero];
        self.interstitialTopToolbar.autoresizingMask = UIViewAutoresizingFlexibleWidth;

        self.interstitialTopToolbar.barStyle = UIBarStyleBlack;
        self.interstitialTopToolbar.translucent = NO;

        NSString *topBarCustomBackgroundURL = [topBarElementAttributes objectForKey:@"custombackgroundurl"];

        if (![topBarCustomBackgroundURL isEqualToString:@""]) {

            NSURL *imageURL = [NSURL URLWithString:topBarCustomBackgroundURL];
            UIImage *theImage = [[UIImage alloc]initWithData:[NSData dataWithContentsOfURL:imageURL]];
            if(theImage) {
                self.interstitialTopToolbar.backgroundImage = theImage;
            } else {
                self.interstitialTopToolbar.backgroundImage = [UIImage mobfoxToolBarImage];
            }

        } else {
            self.interstitialTopToolbar.backgroundImage = [UIImage mobfoxToolBarImage];
        }

        NSString *titleType = [topBarElementAttributes objectForKey:@"title"];
        NSString *titleContent = @"";

        if([titleType isEqualToString:@"fixed"]) {
            titleContent = [topBarElementAttributes objectForKey:@"titlecontent"];
        }

        if([titleType isEqualToString:@"variable"]) {

            titleContent = [self extractStringFromContents:@"<title>" endingString:@"</title>" contents:self.interstitialMarkup];
        }
        if (titleContent && self.interstitialTopToolbar) {

            UILabel *titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 250, 44)];
            [titleLabel setFont:[UIFont boldSystemFontOfSize:20]];
            titleLabel.backgroundColor = [UIColor clearColor];
            titleLabel.textColor = [UIColor whiteColor];
            titleLabel.shadowColor = [UIColor blackColor];
            titleLabel.shadowOffset = CGSizeMake(1.0,-1.0);
            titleLabel.text = titleContent;

            UIBarButtonItem *theButton = [[UIBarButtonItem alloc] initWithCustomView:titleLabel];

            NSMutableArray *topBarItems = [NSMutableArray arrayWithArray:self.interstitialTopToolbar.items];
            [topBarItems addObject:theButton];
            self.interstitialTopToolbar.items = topBarItems;

        }
        UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];;
        [self applyToolbarFrame:self.interstitialTopToolbar bottomToolbar:NO orientation:interfaceOrientation];

        return YES;

    }

    return NO;

}

- (BOOL)interstitialCreateBottomToolbarBottomToolbar:(DTXMLElement*)xml {
    DTXMLElement *bottomBarElement = [xml getNamedChild:@"bottombar"];

    NSMutableDictionary *bottomBarElementAttributes = bottomBarElement.attributes;

    BOOL bottomBarShow = [[bottomBarElementAttributes objectForKey:@"show"] isEqualToString:@"1"];

    if(bottomBarShow) {

        self.interstitialBottomToolbar = [[MobFoxToolBar alloc] initWithFrame:CGRectZero];

        self.interstitialBottomToolbar.autoresizingMask = UIViewAutoresizingFlexibleWidth | 
        UIViewAutoresizingFlexibleTopMargin |
        UIViewAutoresizingFlexibleRightMargin |
        UIViewAutoresizingFlexibleLeftMargin;

        self.interstitialBottomToolbar.barStyle = UIBarStyleBlack;
        self.interstitialTopToolbar.translucent = NO;

        NSString *bottomBarCustomBackgroundURL = [bottomBarElementAttributes objectForKey:@"custombackgroundurl"];

        if (![bottomBarCustomBackgroundURL isEqualToString:@""]) {

            NSURL *imageURL = [NSURL URLWithString:bottomBarCustomBackgroundURL];
            UIImage *theImage = [[UIImage alloc]initWithData:[NSData dataWithContentsOfURL:imageURL]];

            if(theImage) {
                self.interstitialBottomToolbar.backgroundImage = theImage;
            } else {
                self.interstitialBottomToolbar.backgroundImage = [UIImage mobfoxToolBarImage];
            }
        } else {
            self.interstitialBottomToolbar.backgroundImage = [UIImage mobfoxToolBarImage];
        }
        UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];;
        [self applyToolbarFrame:self.interstitialBottomToolbar bottomToolbar:YES orientation:interfaceOrientation];

        UIBarButtonItem *flexiblespace = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:
                                          UIBarButtonSystemItemFlexibleSpace target:nil action:nil];

        BOOL bottomBarBackbutton = [[bottomBarElementAttributes objectForKey:@"backbutton"] isEqualToString:@"1"];
        if(bottomBarBackbutton) {
            NSMutableArray *bottomBarItems = [NSMutableArray arrayWithArray:self.interstitialBottomToolbar.items];

            self.browserBackButton=[UIButton buttonWithType:UIButtonTypeCustom];
            [self.browserBackButton setFrame:CGRectMake(0, 0, buttonSize, buttonSize)];
            [self.browserBackButton addTarget:self action:@selector(browserBackButtonAction:) forControlEvents:UIControlEventTouchUpInside];
            [self.browserBackButton setImage:[UIImage mobfoxBrowserBackButtonImage] forState:UIControlStateNormal];
            [self.browserBackButton setImage:[UIImage mobfoxBrowserBackButtonDisabledImage] forState:UIControlStateDisabled];
            [self.browserBackButton setImage:[UIImage mobfoxBrowserBackButtonDisabledImage] forState:UIControlStateHighlighted];
            UIBarButtonItem *theButton = [[UIBarButtonItem alloc] initWithCustomView:self.browserBackButton];
            [bottomBarItems addObject:theButton];
            [bottomBarItems addObject:flexiblespace];
            self.interstitialBottomToolbar.items = bottomBarItems;

        }

        BOOL bottomBarForwardbutton = [[bottomBarElementAttributes objectForKey:@"forwardbutton"] isEqualToString:@"1"];
        if(bottomBarForwardbutton) {
            NSMutableArray *bottomBarItems = [NSMutableArray arrayWithArray:self.interstitialBottomToolbar.items];

            self.browserForwardButton = [UIButton buttonWithType:UIButtonTypeCustom];
            [self.browserForwardButton setFrame:CGRectMake(0, 0, buttonSize, buttonSize)];
            [self.browserForwardButton addTarget:self action:@selector(browserForwardButtonAction:) forControlEvents:UIControlEventTouchUpInside];
            [self.browserForwardButton setImage:[UIImage mobfoxBrowserForwardButtonImage] forState:UIControlStateNormal];
            [self.browserForwardButton setImage:[UIImage mobfoxBrowserForwardButtonDisabledImage] forState:UIControlStateDisabled];
            [self.browserForwardButton setImage:[UIImage mobfoxBrowserForwardButtonDisabledImage] forState:UIControlStateHighlighted];

            UIBarButtonItem *theButton = [[UIBarButtonItem alloc] initWithCustomView:self.browserForwardButton];
            [bottomBarItems addObject:theButton];
            [bottomBarItems addObject:flexiblespace];
            self.interstitialBottomToolbar.items = bottomBarItems;

        }

        BOOL bottomBarReloadbutton = [[bottomBarElementAttributes objectForKey:@"reloadbutton"] isEqualToString:@"1"];
        if(bottomBarReloadbutton) {
            NSMutableArray *bottomBarItems = [NSMutableArray arrayWithArray:self.interstitialBottomToolbar.items];

            UIButton *button=[UIButton buttonWithType:UIButtonTypeCustom];
            [button setFrame:CGRectMake(0, 0, buttonSize, buttonSize)];
            [button addTarget:self action:@selector(browserReloadButtonAction:) forControlEvents:UIControlEventTouchUpInside];
            [button setImage:[UIImage mobfoxReplayButtonImage] forState:UIControlStateNormal];
            [button setImage:[UIImage mobfoxReplayButtonDisabledImage] forState:UIControlStateHighlighted];

            UIBarButtonItem *theButton = [[UIBarButtonItem alloc] initWithCustomView:button];
            [bottomBarItems addObject:theButton];
            [bottomBarItems addObject:flexiblespace];
            self.interstitialBottomToolbar.items = bottomBarItems;

        }

        if (interstitialLoadedFromURL) {

            BOOL bottomBarExternalbutton = [[bottomBarElementAttributes objectForKey:@"externalbutton"] isEqualToString:@"1"];
            if(bottomBarExternalbutton) {
                NSMutableArray *bottomBarItems = [NSMutableArray arrayWithArray:self.interstitialBottomToolbar.items];

                UIButton *button=[UIButton buttonWithType:UIButtonTypeCustom];
                [button setFrame:CGRectMake(0, 0, buttonSize, buttonSize)];
                [button addTarget:self action:@selector(browserExternalButtonAction:) forControlEvents:UIControlEventTouchUpInside];
                [button setImage:[UIImage mobfoxExportButtonImage] forState:UIControlStateNormal];
                [button setImage:[UIImage mobfoxExportButtonDisabledImage] forState:UIControlStateHighlighted];

                UIBarButtonItem *theButton = [[UIBarButtonItem alloc] initWithCustomView:button];
                [bottomBarItems addObject:theButton];
                [bottomBarItems addObject:flexiblespace];
                self.interstitialBottomToolbar.items = bottomBarItems;

            }

        }

        interstitialTimerShow = NO;

        if (!interstitialAutoCloseDisabled) {

            interstitialTimerShow = [[bottomBarElementAttributes objectForKey:@"timer"] isEqualToString:@"1"];

            if(interstitialTimerShow) {
                NSMutableArray *bottomBarItems = [NSMutableArray arrayWithArray:self.interstitialBottomToolbar.items];

                self.interstitialTimerLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 60, 44)];
                [self.interstitialTimerLabel setFont:[UIFont boldSystemFontOfSize:20]];
                self.interstitialTimerLabel.backgroundColor = [UIColor clearColor];
                self.interstitialTimerLabel.textColor = [UIColor whiteColor];
                self.interstitialTimerLabel.shadowColor = [UIColor blackColor];
                self.interstitialTimerLabel.shadowOffset = CGSizeMake(1.0,-1.0);

                self.interstitialTimerLabel.textAlignment = UITextAlignmentRight;

                UIBarButtonItem *theButton = [[UIBarButtonItem alloc] initWithCustomView:self.interstitialTimerLabel];

                [bottomBarItems addObject:theButton];
                self.interstitialBottomToolbar.items = bottomBarItems;

            }

        }

        return YES;
    }

    return NO;
}

- (void)interstitialLoadWebPage {

    if (interstitialLoadedFromURL) {

        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:self.interstitialURL]];

        [self.interstitialWebView loadRequest:request];

    } else {
        [self.interstitialWebView loadHTMLString:self.interstitialMarkup baseURL:nil];
    }

}

- (NSInteger)VASTDecideTypeOfAdvert:(DTXMLElement*)vastElement {
    vastAds = [VASTXMLParser parseVAST: vastElement];
    NSInteger interstitialSequence = -1;
    NSInteger videoSequence = -1;
    
    for(VAST_Ad* ad in vastAds) {
        if(ad.InLine) {
            for(VAST_Creative* c in ad.InLine.creatives) {
                if(c.linear && c.linear.mediaFiles.count != 0)
                {
                    videoSequence = c.sequence;
                }
                if(c.companionAds && c.companionAds.companions.count != 0) {
                    interstitialSequence = c.sequence;
                }
            }
        }
    }
    
    if(interstitialSequence != -1 && videoSequence != -1) {
        if(videoSequence < interstitialSequence) {
            return MobFoxAdTypeVideoToInterstitial;
        } else {
            return MobFoxAdTypeInterstitialToVideo;
        }
    }
    else if(videoSequence != -1) {
        return MobFoxAdTypeVideo;
    }
    else if(interstitialSequence != -1) {
        return MobFoxAdTypeInterstitial;
    }
    return MobFoxAdTypeError;
}


- (int)getTimeFromString:(NSString*)string {
    
    NSArray *components = [string componentsSeparatedByString:@":"];
    
    NSInteger hours   = [[components objectAtIndex:0] integerValue];
    NSInteger minutes = [[components objectAtIndex:1] integerValue];
    NSInteger seconds = [[components objectAtIndex:2] integerValue];
    
    return (hours * 60 * 60) + (minutes * 60) + seconds;
}

- (BOOL)videoCreateAdvert:(DTXMLElement*)videoElement {
    vastAds = [VASTXMLParser parseVAST: videoElement];
    
    if(vastAds)
    {
        VAST_Ad *vastAd;
        VAST_Creative *creative;
        VAST_Linear *linear;
        VAST_MediaFile *mediaFile;
        
        for(VAST_Ad* ad in vastAds) {
            if(ad.InLine) {
                for(VAST_Creative* c in ad.InLine.creatives) {
                    if(c.linear && c.linear.mediaFiles.count != 0)
                    {
                        vastAd = ad;
                        creative = c;
                        linear = c.linear;
                        mediaFile = [c.linear.mediaFiles objectAtIndex:0];
                        break;
                    }
                }
            }
            if(mediaFile) break;
        }
        
        if(!mediaFile)
        {
            return NO;
        }
        
        NSString *adVideoURL = mediaFile.url;
        
        NSArray *videoTrackingEvents = linear.trackingEvents;
        if(!adVideoURL)
        {
            return NO;
        }
        
        
        [self advertAddNotificationObservers:MobFoxAdGroupVideo];
        
        videoCheckLoadedCount = 0;
        videoVideoFailedToLoad = NO;
        self.mobFoxVideoPlayerViewController = [[MobFoxVideoPlayerViewController alloc] init];
        self.mobFoxVideoPlayerViewController.adVideoOrientation = adVideoOrientation;
        self.mobFoxVideoPlayerViewController.view.backgroundColor = [UIColor clearColor];
        
        self.videoPlayer = [[MPMoviePlayerController alloc] initWithContentURL:[NSURL URLWithString:adVideoURL]];
        
        [self.videoPlayer prepareToPlay];
        
        self.videoPlayer.view.backgroundColor = [UIColor blackColor];
        self.videoPlayer.view.frame = self.view.bounds;
        self.videoPlayer.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        self.mobFoxVideoPlayerViewController.view.frame = self.view.bounds;
        self.mobFoxVideoPlayerViewController.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        
        self.videoPlayer.shouldAutoplay = NO;
        
        self.videoPlayer.controlStyle = MPMovieControlStyleNone;
        
        videoDuration = [self getTimeFromString:linear.duration];
        
        if (videoVideoFailedToLoad) {
            return NO;
        }
        //        DTXMLElement *navigationBarsElement = [videoElement getNamedChild:@"navigation"];
        
        videoSkipButtonShow = (linear.skipoffset != nil);
        
        if(videoSkipButtonShow) {
            
            videoSkipButtonDisplayDelay = (NSTimeInterval)[self getTimeFromString:linear.skipoffset];
            UIImage *buttonImage;
            UIImage *buttonDisabledImage;
            
            buttonImage = [UIImage mobfoxSkipButtonImage];
            buttonDisabledImage = [UIImage mobfoxSkipButtonDisabledImage];
            
            if (buttonImage) {
                float skipButtonSize = buttonSize + 4.0f;
                
                self.videoSkipButton = [UIButton buttonWithType:UIButtonTypeCustom];
                [self.videoSkipButton setFrame:CGRectMake(0, 0, skipButtonSize, skipButtonSize)];
                [self.videoSkipButton addTarget:self action:@selector(videoSkipAction:) forControlEvents:UIControlEventTouchUpInside];
                [self.videoSkipButton setImage:buttonImage forState:UIControlStateNormal];
                [self.videoSkipButton setImage:buttonDisabledImage forState:UIControlStateHighlighted];
                
                if (self.videoTopToolbar) {
                    
                    UIBarButtonItem *flexiblespace = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:
                                                      UIBarButtonSystemItemFlexibleSpace target:nil action:nil];
                    
                    UIBarButtonItem *theButton = [[UIBarButtonItem alloc] initWithCustomView:self.videoSkipButton];
                    self.videoTopToolbarButtons = [NSMutableArray arrayWithArray:self.videoTopToolbar.items];
                    [self.videoTopToolbarButtons addObject:flexiblespace];
                    [self.videoTopToolbarButtons addObject:theButton];
                    
                } else {
                    
                    self.videoSkipButton.autoresizingMask = UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleBottomMargin;
                    
                }
            }
            
        }
        
        if (videoVideoFailedToLoad) {
            return NO;
        }
        
        if ([videoTrackingEvents count]) {
            
            self.advertTrackingEvents = [NSMutableArray arrayWithCapacity:0];
            
            for (VAST_Tracking *tracking in videoTrackingEvents)
            {
                
                NSString *type = tracking.event;
                NSString *clickUrl = tracking.url;
                
                if (clickUrl && type) {
                    NSDictionary *trackingEvent = [NSDictionary dictionaryWithObjectsAndKeys:
                                                   clickUrl, type,
                                                   nil];
                    
                    [self.advertTrackingEvents addObject:trackingEvent];
                }
                
            }
            
        }
        
        VAST_NonLinear *nonLinear;
        for (VAST_Creative *creative in vastAd.InLine.creatives)
        {
            for (VAST_NonLinear *nonL in creative.nonLinearAds.nonLinears)
            {
                if (nonL)
                {
                    nonLinear = nonL;
                    break;
                }
            }
            if(nonLinear)
                break;
        }
        
        
        videoHTMLOverlayDisplayDelay = (NSTimeInterval)0;
        
        if(nonLinear.staticResource)
        {
            NSString *resource;
            NSString *type = nonLinear.staticResource.type;
            if([type isEqualToString:@"image/gif"] || [type isEqualToString:@"image/jpeg"] || [type isEqualToString:@"image/png"])
            {
                resource = [NSString stringWithFormat:@"<img src=\"%@\">", nonLinear.staticResource.url];
                self.videoHTMLOverlayHTML = resource;
            }
            else if([type isEqualToString:@"application/x-javascript"])
            {
                resource = [NSString stringWithFormat:@"<script src=\"%@\"></script>", nonLinear.staticResource.url];
                self.videoHTMLOverlayHTML = resource;
            }
        }
        else if(nonLinear.iFrameResource)
        {
            NSString *resource = [NSString stringWithFormat:@"<iframe src=\"%@\"></iframe>", nonLinear.iFrameResource];
            self.videoHTMLOverlayHTML = resource;
        }
        else if(nonLinear.htmlResource)
        {
            self.videoHTMLOverlayHTML = nonLinear.htmlResource;
        }
        
        
        if (videoVideoFailedToLoad) {
            return NO;
        }
        
        return YES;
    }
    else
    {
        return NO;
    }

}

- (BOOL)videoCreateTopToolbar:(DTXMLElement*)xml {

    NSMutableDictionary *topBarElementAttributes = [xml getNamedChild:@"topbar"].attributes;

    BOOL topBarShow = [[topBarElementAttributes objectForKey:@"show"] isEqualToString:@"1"];

    if (topBarShow) {
        self.videoTopToolbar = [[MobFoxToolBar alloc] initWithFrame:CGRectZero];
        self.videoTopToolbar.autoresizingMask = UIViewAutoresizingFlexibleWidth;

        self.videoTopToolbar.barStyle = UIBarStyleBlack;
        self.videoTopToolbar.translucent = YES;

        NSString *topBarCustomBackgroundURL = [topBarElementAttributes objectForKey:@"custombackgroundurl"];

        if (![topBarCustomBackgroundURL isEqualToString:@""]) {

            NSURL *imageURL = [NSURL URLWithString:topBarCustomBackgroundURL];
            UIImage *theImage = [[UIImage alloc]initWithData:[NSData dataWithContentsOfURL:imageURL]];
            if(theImage)
            {
                self.videoTopToolbar.backgroundImage = theImage;

            }  else {
                self.videoTopToolbar.backgroundImage = [UIImage mobfoxToolBarImage];
            }

        }  else {
            self.videoTopToolbar.backgroundImage = [UIImage mobfoxToolBarImage];
        }

        UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];;
        [self applyToolbarFrame:self.videoTopToolbar bottomToolbar:NO orientation:interfaceOrientation];

        return YES;

    }

    return NO;

}

- (BOOL)videoCreateBottomToolbar:(DTXMLElement*)xml {

    DTXMLElement *bottomBarElement = [xml getNamedChild:@"bottombar"];

    NSMutableDictionary *bottomBarElementAttributes = bottomBarElement.attributes;

    BOOL bottomBarShow = [[bottomBarElementAttributes objectForKey:@"show"] isEqualToString:@"1"];

    if(bottomBarShow) {

        self.videoBottomToolbar = [[MobFoxToolBar alloc] initWithFrame:CGRectZero];

        self.videoBottomToolbar.autoresizingMask =  UIViewAutoresizingFlexibleWidth | 
        UIViewAutoresizingFlexibleTopMargin |
        UIViewAutoresizingFlexibleRightMargin |
        UIViewAutoresizingFlexibleLeftMargin;

        self.videoBottomToolbar.barStyle = UIBarStyleBlack;
        self.videoBottomToolbar.translucent = YES;

        NSString *bottomBarCustomBackgroundURL = [bottomBarElementAttributes objectForKey:@"custombackgroundurl"];

        if (![bottomBarCustomBackgroundURL isEqualToString:@""]) {

            NSURL *imageURL = [NSURL URLWithString:bottomBarCustomBackgroundURL];
            UIImage *theImage = [[UIImage alloc]initWithData:[NSData dataWithContentsOfURL:imageURL]];

            if(theImage)
            {
                self.videoBottomToolbar.backgroundImage = theImage;
            } else {
                self.videoBottomToolbar.backgroundImage = [UIImage mobfoxToolBarImage];
            }

        } else {
            self.videoBottomToolbar.backgroundImage = [UIImage mobfoxToolBarImage];
        }
        UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];;
        [self applyToolbarFrame:self.videoBottomToolbar bottomToolbar:YES orientation:interfaceOrientation];

        BOOL bottomBarReplayButtonShow = [[bottomBarElementAttributes objectForKey:@"replaybutton"] isEqualToString:@"1"];
        if(bottomBarReplayButtonShow) {
            NSMutableArray *bottomBarItems = [NSMutableArray arrayWithArray:self.videoBottomToolbar.items];
            UIImage *buttonImage = [UIImage imageNamed:@""];
            UIImage *buttonDisabledImage = [UIImage imageNamed:@""];

            NSString *bottomBarReplayButtonURL = [bottomBarElementAttributes objectForKey:@"replaybuttonurl"];
            if (![bottomBarReplayButtonURL isEqualToString:@""]) {

                NSURL *imageURL = [NSURL URLWithString:bottomBarReplayButtonURL];
                buttonImage = [[UIImage alloc]initWithData:[NSData dataWithContentsOfURL:imageURL]];
                buttonDisabledImage = buttonImage;
            }

            if (!buttonImage) {
                buttonImage = [UIImage mobfoxReplayButtonImage];
                buttonDisabledImage = [UIImage mobfoxReplayButtonDisabledImage];
            }

            if(buttonImage)
            {
                UIButton *button=[UIButton buttonWithType:UIButtonTypeCustom];
                [button setFrame:CGRectMake(0, 0, buttonSize, buttonSize)];
                [button addTarget:self action:@selector(videoReplayButtonAction:) forControlEvents:UIControlEventTouchUpInside];
                [button setImage:buttonImage forState:UIControlStateNormal];
                [button setImage:buttonDisabledImage forState:UIControlStateHighlighted];

                UIBarButtonItem *theButton = [[UIBarButtonItem alloc] initWithCustomView:button];
                [bottomBarItems addObject:theButton];
                self.videoBottomToolbar.items = bottomBarItems;
            }

        }

        BOOL bottomBarPausePlayButtonShow = [[bottomBarElementAttributes objectForKey:@"pausebutton"] isEqualToString:@"1"];
        if(bottomBarPausePlayButtonShow) {
            NSMutableArray *bottomBarItems = [NSMutableArray arrayWithArray:self.videoBottomToolbar.items];

            NSString *bottomBarPauseButtonURL = [bottomBarElementAttributes objectForKey:@"pausebuttonurl"];
            UIImage *pauseButtonImage = [UIImage imageNamed:@""];
            UIImage *pauseButtonDisabledImage = [UIImage imageNamed:@""];

            if (![bottomBarPauseButtonURL isEqualToString:@""]) {

                NSURL *imageURL;

                imageURL = [NSURL URLWithString:bottomBarPauseButtonURL];
                pauseButtonImage = [[UIImage alloc]initWithData:[NSData dataWithContentsOfURL:imageURL]];
                pauseButtonDisabledImage = pauseButtonImage;
            }
            if (!pauseButtonImage) {
                pauseButtonImage = [UIImage mobfoxPauseButtonImage];
                pauseButtonDisabledImage = [UIImage mobfoxPauseButtonDisabledImage];
            }

            self.videoPauseButtonImage = pauseButtonImage;
            self.videoPauseButtonDisabledImage = pauseButtonDisabledImage;

            NSString *bottomBarPlayButtonURL = [bottomBarElementAttributes objectForKey:@"playbuttonurl"];
            UIImage *playButtonImage = [UIImage imageNamed:@""];
            UIImage *playButtonDisabledImage = [UIImage imageNamed:@""];

            if (![bottomBarPlayButtonURL isEqualToString:@""]) {

                NSURL *imageURL;

                imageURL = [NSURL URLWithString:bottomBarPlayButtonURL];
                playButtonImage = [[UIImage alloc]initWithData:[NSData dataWithContentsOfURL:imageURL]];
                playButtonDisabledImage = playButtonImage;
            }
            if (!playButtonImage) {
                playButtonImage = [UIImage mobfoxPlayButtonImage];
                playButtonDisabledImage = [UIImage mobfoxPlayButtonDisabledImage];

            }
            self.videoPlayButtonImage = playButtonImage;
            self.videoPlayButtonDisabledImage = playButtonDisabledImage;

            if(self.videoPlayButtonImage && self.videoPauseButtonImage)
            {

                UIButton *button=[UIButton buttonWithType:UIButtonTypeCustom];
                [button setFrame:CGRectMake(0, 0, buttonSize, buttonSize)];
                [button addTarget:self action:@selector(videoPausePlayButtonAction:) forControlEvents:UIControlEventTouchUpInside];
                [button setImage:pauseButtonImage forState:UIControlStateNormal];
                [button setImage:pauseButtonDisabledImage forState:UIControlStateHighlighted];

                UIBarButtonItem *theButton = [[UIBarButtonItem alloc] initWithCustomView:button];

                [bottomBarItems addObject:theButton];
                self.videoBottomToolbar.items = bottomBarItems;

            }

        }

        videoTimerShow = NO;

        if (videoDuration != 0) {
            videoTimerShow = [[bottomBarElementAttributes objectForKey:@"timer"] isEqualToString:@"1"];

            if(videoTimerShow) {
                NSMutableArray *bottomBarItems = [NSMutableArray arrayWithArray:self.videoBottomToolbar.items];

                self.videoTimerLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 60, 44)];
                [self.videoTimerLabel setFont:[UIFont boldSystemFontOfSize:20]];
                self.videoTimerLabel.backgroundColor = [UIColor clearColor];
                self.videoTimerLabel.textColor = [UIColor whiteColor];
                self.videoTimerLabel.shadowColor = [UIColor blackColor];
                self.videoTimerLabel.shadowOffset = CGSizeMake(1.0,-1.0);
                int minutes = floor(videoDuration/60);
                int seconds = trunc(videoDuration - minutes * 60);
                self.videoTimerLabel.text = [NSString stringWithFormat:@"%i:%.2d", minutes, seconds];

                self.videoTimerLabel.textAlignment = UITextAlignmentRight;

                UIBarButtonItem *theButton = [[UIBarButtonItem alloc] initWithCustomView:self.videoTimerLabel];

                [bottomBarItems addObject:theButton];
                self.videoBottomToolbar.items = bottomBarItems;

            }

        }

        NSArray *navIcons = [bottomBarElement getNamedChildren:@"navicon"];

        if ([navIcons count]) {
            NSMutableArray *bottomBarItems = [NSMutableArray arrayWithArray:self.videoBottomToolbar.items];

            UIBarButtonItem *flexiblespace = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:
                                              UIBarButtonSystemItemFlexibleSpace target:nil action:nil];
            [bottomBarItems addObject:flexiblespace];

            UIView *navIconsView = [[UIView alloc] initWithFrame:CGRectZero];
            navIconsView.backgroundColor = [UIColor clearColor];

            int offset = 0;
            int offsetIncrement = buttonSize * 1.75;

            for (DTXMLElement *navIcon in navIcons)
            {

                NSMutableDictionary *navIconAttributes = navIcon.attributes;

                NSString *title = [navIconAttributes objectForKey:@"title"];

                NSString *iconUrl = [navIconAttributes objectForKey:@"iconurl"];
                NSString *openType = [navIconAttributes objectForKey:@"opentype"];
                NSString *clickUrl = [navIconAttributes objectForKey:@"clickurl"];

                if (iconUrl) {
                    NSURL *imageURL = [NSURL URLWithString:iconUrl];
                    UIImage *theImage = [[UIImage alloc]initWithData:[NSData dataWithContentsOfURL:imageURL]];

                    if(theImage) {

                        UIButton *thebutton=[UIButton buttonWithType:UIButtonTypeCustom];
                        [thebutton setFrame:CGRectMake(offset, 0, buttonSize, buttonSize)];
                        [thebutton addTarget:self action:@selector(navIconAction:) forControlEvents:UIControlEventTouchUpInside];
                        [thebutton setImage:theImage forState:UIControlStateNormal];

                        if(title) {
                            [thebutton setTitle:title forState:UIControlStateNormal];
                        }

                        NSDictionary *buttonDictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                                          openType,@"openType",
                                                          clickUrl,@"clickUrl", nil];

                        thebutton.objectTag = buttonDictionary;

                        [navIconsView addSubview:thebutton];
                        offset += offsetIncrement;

                    }

                }

            }

            navIconsView.frame = CGRectMake(0, 0, offset - (offsetIncrement-buttonSize), buttonSize);

            UIBarButtonItem *theButton = [[UIBarButtonItem alloc] initWithCustomView:navIconsView];
            [bottomBarItems addObject:theButton];

            self.videoBottomToolbar.items = bottomBarItems;
        }

        return YES;

    }

    return NO;

}

- (void)advertCreationFailed {

    NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Advert could not be created" forKey:NSLocalizedDescriptionKey];

    NSError *error = [NSError errorWithDomain:MobFoxVideoInterstitialErrorDomain code:MobFoxInterstitialViewErrorUnknown userInfo:userInfo];
    [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
}

- (void)advertCreatedSuccessfully:(MobFoxAdType)advertType {

    NSNumber *advertTypeNumber = [NSNumber numberWithInt:advertType];
    [self performSelectorOnMainThread:@selector(reportSuccess:) withObject:advertTypeNumber waitUntilDone:YES];
}

- (void)checkVideoToInterstitialVideoLoadedAndReadyToPlay:(NSTimer*)timer {

    NSDictionary *dictionary = [timer userInfo];

    DTXMLElement *interstitialElement = [dictionary objectForKey:@"interstitialElement"];
    MobFoxAdType adType = [[dictionary objectForKey:@"adType"] intValue];
    if (videoVideoFailedToLoad || videoCheckLoadedCount > 100) {
        [self videoFailedToLoad];

    } else {
        if ([self.videoPlayer loadState] == MPMovieLoadStateUnknown) {
            videoCheckLoadedCount++;

            [NSTimer scheduledTimerWithTimeInterval:0.1 target:self selector:@selector(checkVideoToInterstitialVideoLoadedAndReadyToPlay:) userInfo:dictionary repeats:NO];
            return;
        }

        if ([self interstitialCreateAdvert:interstitialElement]) {
            [self advertCreatedSuccessfully:adType];

        } else {
            [self advertCreationFailed];

        }

    }

}

- (void)checkVideoLoadedAndReadyToPlay {
    if (videoVideoFailedToLoad || videoCheckLoadedCount > 100) {
        [self videoFailedToLoad];

    } else {
        if ([self.videoPlayer loadState] == MPMovieLoadStateUnknown) {
            videoCheckLoadedCount++;

            [NSTimer scheduledTimerWithTimeInterval:0.25 target:self selector:@selector(checkVideoLoadedAndReadyToPlay) userInfo:nil repeats:NO];
            return;
        }

        [self advertCreatedSuccessfully:MobFoxAdTypeVideo];
    }

}

- (void)videoFailedToLoad {
    [self advertCreationFailed];

    videoWasSkipped = NO;

    [self advertTidyUpAfterAnimationOut:MobFoxAdTypeVideo];

}

#pragma mark - CustomEventFullscreenDelegate methods
- (void)customEventFullscreenDidLoadAd:(CustomEventFullscreen *)fullscreen
{
    [self advertCreatedSuccessfully:advertTypeCurrentlyPlaying];
}

- (void)customEventFullscreenDidFailToLoadAd
{
    [self loadCustomEvent];
    if(_customEventFullscreen || advertTypeCurrentlyPlaying != MobFoxAdTypeNoAdInventory)
    {
        return;
    }
    else
    {
        [self advertCreationFailed];
    }
}

- (void)customEventFullscreenWillAppear
{
    
}

- (void)customEventFullscreenWillClose
{
    
}

- (void)customEventFullscreenWillLeaveApplication
{
    
}


#pragma mark - Ad Presentation

- (void)presentAd:(MobFoxAdType)advertType {

    switch (advertType) {
        case MobFoxAdTypeVideo:
        case MobFoxAdTypeVideoToInterstitial:
            if(_customEventFullscreen) {
                [_customEventFullscreen showFullscreenFromRootViewController:self];
            }
            else if (self.videoPlayer.view) {
                tempView = [[UIView alloc]initWithFrame:self.videoPlayer.view.frame];
                tempView.backgroundColor = [UIColor blackColor];
                [self.view addSubview:tempView];

                [self.mobFoxVideoPlayerViewController.view addSubview:self.videoPlayer.view];

                videoViewController = [self firstAvailableUIViewController];

                videoViewController.wantsFullScreenLayout = YES;

                [videoViewController presentModalViewController:self.mobFoxVideoPlayerViewController animated:NO];

                [self advertAnimateIn:self.advertAnimation advertTypeLoaded:advertType viewToAnimate:self.mobFoxVideoPlayerViewController.view];

}
            break;
        case MobFoxAdTypeInterstitial:
        case MobFoxAdTypeMraid:
        case MobFoxAdTypeImage:
        case MobFoxAdTypeText:
        case MobFoxAdTypeInterstitialToVideo:
            if(_customEventFullscreen) {
                [_customEventFullscreen showFullscreenFromRootViewController:self];
            }
            else if (self.interstitialHoldingView) {

                [self.mobFoxInterstitialPlayerViewController.view addSubview:self.interstitialHoldingView];

                interstitialViewController = [self firstAvailableUIViewController];

                interstitialViewController.wantsFullScreenLayout = YES;

                [interstitialViewController presentModalViewController:self.mobFoxInterstitialPlayerViewController animated:NO];

                [self advertAnimateIn:self.advertAnimation advertTypeLoaded:advertType viewToAnimate:self.mobFoxInterstitialPlayerViewController.view];

            }
            break;
        case MobFoxAdTypeUnknown:
        case MobFoxAdTypeError:
            break;
        case MobFoxAdTypeNoAdInventory:
            if(_customEventFullscreen) {
                [_customEventFullscreen showFullscreenFromRootViewController:self];
            }
            break;
    }

}

- (void)interstitialPlayAdvert {

    [self interstitialStartTimer];
    [self advertAddNotificationObservers:MobFoxAdGroupInterstitial];

    currentlyPlayingInterstitial = YES;
}

- (void)interstitialStopAdvert {

    currentlyPlayingInterstitial = NO;

    if (advertTypeCurrentlyPlaying == MobFoxAdTypeInterstitialToVideo) {

        [self videoTidyUpAfterAnimationOut];

    }

    [self advertRemoveNotificationObservers:MobFoxAdGroupInterstitial];

    [self advertAnimateOut:self.advertAnimation advertTypeLoaded:MobFoxAdTypeInterstitial viewToAnimate:self.mobFoxInterstitialPlayerViewController.view];
}

- (void)videoPlayAdvert {

    if ([self.videoPlayer loadState] == MPMovieLoadStateUnknown) {
        [self.videoPlayer prepareToPlay];

        [NSTimer scheduledTimerWithTimeInterval:0.1 target:self selector:@selector(videoPlayAdvert) userInfo:nil repeats:NO];
        return;
    } else {
        [self advertAddNotificationObservers:MobFoxAdGroupVideo];

        [self videoStartTimer];
        [self advertActionTrackingEvent:@"start"];
        [self.videoPlayer play];

    }

}

- (void)videoStopAdvert {
    [self advertRemoveNotificationObservers:MobFoxAdGroupVideo];

    if (advertTypeCurrentlyPlaying == MobFoxAdTypeInterstitialToVideo) {

        if (self.interstitialHoldingView) {
            [self.interstitialWebView reload];

            [videoViewController dismissModalViewControllerAnimated:NO];
            [self videoTidyUpAfterAnimationOut];
            UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];
            [self updateAllFrames:interfaceOrientation];

            [self.mobFoxInterstitialPlayerViewController.view addSubview:self.interstitialHoldingView];

            interstitialViewController = [self firstAvailableUIViewController];

            interstitialViewController.wantsFullScreenLayout = YES;

            [interstitialViewController presentModalViewController:self.mobFoxInterstitialPlayerViewController animated:NO];

            [self advertAnimateIn:self.advertAnimation advertTypeLoaded:MobFoxAdTypeInterstitial viewToAnimate:self.mobFoxInterstitialPlayerViewController.view];
        }

        return;
    }

    if (advertTypeCurrentlyPlaying == MobFoxAdTypeVideoToInterstitial && !videoWasSkipped) {
        if (self.interstitialHoldingView) {
            [self.interstitialWebView reload];

            [videoViewController dismissModalViewControllerAnimated:NO]; 
            [self videoTidyUpAfterAnimationOut];
            UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];
            [self updateAllFrames:interfaceOrientation];

            [self.mobFoxInterstitialPlayerViewController.view addSubview:self.interstitialHoldingView];

            interstitialViewController = [self firstAvailableUIViewController];

            interstitialViewController.wantsFullScreenLayout = YES;

            [interstitialViewController presentModalViewController:self.mobFoxInterstitialPlayerViewController animated:NO];

            [self advertAnimateIn:self.advertAnimation advertTypeLoaded:MobFoxAdTypeInterstitial viewToAnimate:self.mobFoxInterstitialPlayerViewController.view];
        }

        return;

    }
    if (advertTypeCurrentlyPlaying == MobFoxAdTypeVideoToInterstitial) {
        [self interstitialTidyUpAfterAnimationOut];
    }
    [self advertAnimateOut:self.advertAnimation advertTypeLoaded:MobFoxAdTypeVideo viewToAnimate:self.mobFoxVideoPlayerViewController.view];
}

- (void)playAdvert:(MobFoxAdType)advertType {

    if (!self.advertViewActionInProgress) {
        switch (advertType) {
            case MobFoxAdTypeVideo:
            case MobFoxAdTypeVideoToInterstitial:
                [self videoPlayAdvert];
                break;
            case MobFoxAdTypeInterstitial:
            case MobFoxAdTypeInterstitialToVideo:
                [self interstitialPlayAdvert];
                break;
            case MobFoxAdTypeUnknown:
            case MobFoxAdTypeError:
            case MobFoxAdTypeImage:
            case MobFoxAdTypeText:
            case MobFoxAdTypeMraid:
            case MobFoxAdTypeNoAdInventory:
                break;
        }

        return;
    }

    self.advertViewActionInProgress = YES;

}

#pragma mark - Ad Animation

- (void)advertAnimateIn:(NSString*)animationType advertTypeLoaded:(MobFoxAdType)advertType viewToAnimate:(UIView*)viewToAnimate {
    if (advertTypeCurrentlyPlaying == advertType) {

        if ([delegate respondsToSelector:@selector(mobfoxVideoInterstitialViewActionWillPresentScreen:)])
        {
            [delegate mobfoxVideoInterstitialViewActionWillPresentScreen:self];
        }

        [self hideStatusBar];

    }

    UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];;
    [self updateAllFrames:interfaceOrientation];

    if ([animationType isEqualToString:@"None"] || [animationType isEqualToString:@"none"] || [animationType isEqualToString:@""]) {
        viewToAnimate.alpha = 1.0f;
        viewToAnimate.hidden = NO;
        [self playAdvert:advertType];
    }

    if ([animationType isEqualToString:@"fade-in"]) {
        viewToAnimate.alpha = 0.0f;
        viewToAnimate.hidden = NO;

        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.alpha = 1.0;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self playAdvert:advertType]; 
                             }
                         }];
        return;
    }

    if ([animationType isEqualToString:@"slide-in-top"]) {
        viewToAnimate.alpha = 1.0f;
        viewToAnimate.hidden = NO;

        CGRect startPosition = CGRectMake(0, 0 - viewToAnimate.frame.size.height, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        CGRect endPosition = CGRectMake(0, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        viewToAnimate.frame = startPosition;
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self playAdvert:advertType]; 
                             }
                         }];
        return;
    }

    if ([animationType isEqualToString:@"slide-in-bottom"]) {
        viewToAnimate.alpha = 1.0f;
        viewToAnimate.hidden = NO;

        CGRect startPosition = CGRectMake(0, viewToAnimate.frame.size.height, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        CGRect endPosition = CGRectMake(0, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        viewToAnimate.frame = startPosition;
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self playAdvert:advertType]; 
                             }
                         }];

    }

    if ([animationType isEqualToString:@"slide-in-left"]) {
        viewToAnimate.alpha = 1.0f;
        viewToAnimate.hidden = NO;

        CGRect startPosition = CGRectMake(0 - viewToAnimate.frame.size.width, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        CGRect endPosition = CGRectMake(0, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        viewToAnimate.frame = startPosition;
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self playAdvert:advertType]; 
                             }
                         }];
        return;
    }

    if ([animationType isEqualToString:@"slide-in-right"]) {
        viewToAnimate.alpha = 1.0f;
        viewToAnimate.hidden = NO;

        CGRect startPosition = CGRectMake(viewToAnimate.frame.size.width, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        CGRect endPosition = CGRectMake(0, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        viewToAnimate.frame = startPosition;
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self playAdvert:advertType]; 
                             }
                         }];
        return;
    }

    if ([animationType isEqualToString:@"flip-in"]) {

        viewToAnimate.hidden = NO;
        viewToAnimate.alpha = 1.0;

        [UIView transitionFromView:viewToAnimate toView:viewToAnimate 
                          duration:1.25 
                           options:UIViewAnimationOptionTransitionFlipFromRight | UIViewAnimationOptionShowHideTransitionViews
                        completion:^(BOOL finished) {
                            if (finished) {
                                [self playAdvert:advertType]; 
                            }
                        }];
        return;
    }

}

- (void)playInterstitialAfterVideoToInterstitial:(MobFoxAdType)advertType {
    [self playAdvert:advertType];
}

- (void)videoToInterstitialAnimateSecondaryIn:(NSString*)animationType advertTypeLoaded:(MobFoxAdType)advertType viewToAnimate:(UIView*)viewToAnimate {

    if ([animationType isEqualToString:@"None"] || [animationType isEqualToString:@"none"] || [animationType isEqualToString:@""]) {
        viewToAnimate.alpha = 1.0f;
        viewToAnimate.hidden = NO;
        [self playInterstitialAfterVideoToInterstitial:advertType];
    }

    if ([animationType isEqualToString:@"fade-in"]) {
        viewToAnimate.alpha = 0.0f;
        viewToAnimate.hidden = NO;

        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.alpha = 1.0;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self playInterstitialAfterVideoToInterstitial:advertType]; 
                             }
                         }];
        return;
    }

    if ([animationType isEqualToString:@"slide-in-top"]) {
        viewToAnimate.alpha = 1.0f;
        viewToAnimate.hidden = NO;

        CGRect startPosition = CGRectMake(0, 0 - viewToAnimate.frame.size.height, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        CGRect endPosition = CGRectMake(0, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        viewToAnimate.frame = startPosition;
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self playInterstitialAfterVideoToInterstitial:advertType]; 
                             }
                         }];
        return;
    }

    if ([animationType isEqualToString:@"slide-in-bottom"]) {
        viewToAnimate.alpha = 1.0f;
        viewToAnimate.hidden = NO;

        CGRect startPosition = CGRectMake(0, viewToAnimate.frame.size.height, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        CGRect endPosition = CGRectMake(0, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        viewToAnimate.frame = startPosition;
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self playInterstitialAfterVideoToInterstitial:advertType]; 
                             }
                         }];

    }

    if ([animationType isEqualToString:@"slide-in-left"]) {
        viewToAnimate.alpha = 1.0f;
        viewToAnimate.hidden = NO;

        CGRect startPosition = CGRectMake(0 - viewToAnimate.frame.size.width, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        CGRect endPosition = CGRectMake(0, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        viewToAnimate.frame = startPosition;
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self playInterstitialAfterVideoToInterstitial:advertType]; 
                             }
                         }];
        return;
    }

    if ([animationType isEqualToString:@"slide-in-right"]) {
        viewToAnimate.alpha = 1.0f;
        viewToAnimate.hidden = NO;

        CGRect startPosition = CGRectMake(viewToAnimate.frame.size.width, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        CGRect endPosition = CGRectMake(0, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        viewToAnimate.frame = startPosition;
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self playInterstitialAfterVideoToInterstitial:advertType]; 
                             }
                         }];
        return;
    }

    if ([animationType isEqualToString:@"flip-in"]) {

        viewToAnimate.hidden = NO;
        viewToAnimate.alpha = 1.0;

        [UIView transitionFromView:viewToAnimate toView:viewToAnimate 
                          duration:1.25 
                           options:UIViewAnimationOptionTransitionFlipFromRight | UIViewAnimationOptionShowHideTransitionViews
                        completion:^(BOOL finished) {
                            if (finished) {
                                [self playInterstitialAfterVideoToInterstitial:advertType]; 
                            }
                        }];
        return;
    }

}

- (void)interstitialTidyUpAfterAnimationOut {

    if (self.interstitialWebView) {

        [self interstitialStopTimer];

        [self.interstitialTopToolbar removeFromSuperview];
        [self.interstitialBottomToolbar removeFromSuperview];

        self.interstitialTopToolbar = nil;
        self.interstitialBottomToolbar = nil;

        self.interstitialSkipButton = nil;

        interstitialSkipButtonDisplayed = NO;

        self.interstitialWebView.delegate = nil;
        [self.interstitialWebView removeFromSuperview];
        self.interstitialWebView = nil;

        [self.interstitialHoldingView removeFromSuperview];
        self.interstitialHoldingView = nil;

    }

}

- (void)advertTidyUpAfterAnimationOut:(MobFoxAdType)advertType {

    [self showStatusBarIfNecessary];

    UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];;
    [self updateAllFrames:interfaceOrientation];

    if (advertType == MobFoxAdTypeVideo) {
        [videoViewController dismissModalViewControllerAnimated:NO]; 
        [self videoTidyUpAfterAnimationOut];
    }

    if (advertType == MobFoxAdTypeInterstitial) {
        [interstitialViewController dismissModalViewControllerAnimated:NO];
       [self interstitialTidyUpAfterAnimationOut];
    }
    self.view.hidden = YES;
    self.view.alpha = 0.0;

    if ([delegate respondsToSelector:@selector(mobfoxVideoInterstitialViewDidDismissScreen:)])
    {
        [delegate mobfoxVideoInterstitialViewDidDismissScreen:self];
    }

    self.advertViewActionInProgress = NO;
    self.advertLoaded = NO;

}

- (void)advertAnimateOut:(NSString*)animationType advertTypeLoaded:(MobFoxAdType)advertType viewToAnimate:(UIView*)viewToAnimate {

    if ([delegate respondsToSelector:@selector(mobfoxVideoInterstitialViewWillDismissScreen:)])
	{
		[delegate mobfoxVideoInterstitialViewWillDismissScreen:self];
	}

    if ([animationType isEqualToString:@"None"] || [animationType isEqualToString:@"none"] || [animationType isEqualToString:@""]) {
        [self advertTidyUpAfterAnimationOut:advertType];
    }

    if ([animationType isEqualToString:@"fade-in"]) {
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.alpha = 0.0;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self advertTidyUpAfterAnimationOut:advertType];
                             }
                         }];
        return;
    }

    if ([animationType isEqualToString:@"slide-in-top"]) {

        CGRect endPosition = CGRectMake(0, 0 - viewToAnimate.frame.size.height, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self advertTidyUpAfterAnimationOut:advertType]; 
                             }
                         }];

        return;
    }

    if ([animationType isEqualToString:@"slide-in-bottom"]) {

        CGRect endPosition = CGRectMake(0, viewToAnimate.frame.size.height, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self advertTidyUpAfterAnimationOut:advertType]; 
                             }
                         }];

        return;
    }

    if ([animationType isEqualToString:@"slide-in-left"]) {

        CGRect endPosition = CGRectMake(0 - viewToAnimate.frame.size.width, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self advertTidyUpAfterAnimationOut:advertType]; 
                             }
                         }];

        return;
    }

    if ([animationType isEqualToString:@"slide-in-right"]) {

        CGRect endPosition = CGRectMake(viewToAnimate.frame.size.width, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self advertTidyUpAfterAnimationOut:advertType]; 
                             }
                         }];

        return;
    }

    if ([animationType isEqualToString:@"flip-in"]) {
        viewToAnimate.hidden = YES;
        viewToAnimate.alpha = 0.0;

        [UIView transitionFromView:viewToAnimate toView:viewToAnimate 
                          duration:1.25 
                           options:UIViewAnimationOptionTransitionFlipFromRight | UIViewAnimationOptionShowHideTransitionViews
                        completion:^(BOOL finished) {
                            if (finished) {
                                [self advertTidyUpAfterAnimationOut:advertType]; 
                            }
                        }];
        return;
    }

}

- (void)interstitialToVideoAnimateSecondaryOut:(NSString*)animationType viewToAnimate:(UIView*)viewToAnimate {

    if ([animationType isEqualToString:@"None"] || [animationType isEqualToString:@"none"] || [animationType isEqualToString:@""]) {
        [self videoTidyUpAfterInterstitialToVideoAnimationOut];
    }

    if ([animationType isEqualToString:@"fade-in"]) {
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.alpha = 0.0;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self videoTidyUpAfterInterstitialToVideoAnimationOut];
                             }
                         }];
        return;
    }

    if ([animationType isEqualToString:@"slide-in-top"]) {

        CGRect endPosition = CGRectMake(0, 0 - viewToAnimate.frame.size.height, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self videoTidyUpAfterInterstitialToVideoAnimationOut];
                             }
                         }];

        return;
    }

    if ([animationType isEqualToString:@"slide-in-bottom"]) {

        CGRect endPosition = CGRectMake(0, viewToAnimate.frame.size.height, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self videoTidyUpAfterInterstitialToVideoAnimationOut];
                             }
                         }];

        return;
    }

    if ([animationType isEqualToString:@"slide-in-left"]) {

        CGRect endPosition = CGRectMake(0 - viewToAnimate.frame.size.width, 0, viewToAnimate.frame.size.width, viewToAnimate.frame.size.height);
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self videoTidyUpAfterInterstitialToVideoAnimationOut];
                             }
                         }];

        return;
    }

    if ([animationType isEqualToString:@"slide-in-right"]) {

        CGRect endPosition = CGRectMake(self.videoPlayer.view.frame.size.width, 0, self.videoPlayer.view.frame.size.width, self.videoPlayer.view.frame.size.height);
        [UIView animateWithDuration:animationDuration
                         animations:^{viewToAnimate.frame = endPosition;}
                         completion:^(BOOL finished) {
                             if (finished) {
                                 [self videoTidyUpAfterInterstitialToVideoAnimationOut];
                             }
                         }];

        return;
    }

    if ([animationType isEqualToString:@"flip-in"]) {
        viewToAnimate.hidden = YES;
        viewToAnimate.alpha = 0.0;

        [UIView transitionFromView:viewToAnimate toView:viewToAnimate 
                          duration:1.25 
                           options:UIViewAnimationOptionTransitionFlipFromRight | UIViewAnimationOptionShowHideTransitionViews
                        completion:^(BOOL finished) {
                            if (finished) {
                                [self videoTidyUpAfterInterstitialToVideoAnimationOut];
                            }
                        }];
        return;
    }

}

- (void)videoTidyUpAfterAnimationOut {

    if (self.videoPlayer) {
        if (self.videoPlayer.playbackState != MPMoviePlaybackStateStopped ) {
            [self.videoPlayer stop];
        }

        [self videoStopTimer];

        self.videoHTMLOverlayWebView = nil;
        self.videoBottomToolbar = nil;
        self.videoTopToolbar = nil;

        self.videoSkipButton = nil;

        videoHtmlOverlayDisplayed = NO;
        videoSkipButtonDisplayed = NO;

        [self.videoPlayer.view removeFromSuperview];

        self.videoPlayer = nil;

        self.mobFoxVideoPlayerViewController = nil;

        [tempView removeFromSuperview];

    }

}

- (void)videoTidyUpAfterInterstitialToVideoAnimationOut {

    [videoViewController dismissModalViewControllerAnimated:NO];
    UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];

    [self updateAllFrames:interfaceOrientation];

    [self.interstitialWebView reload];

    if (self.videoPlayer) {

        [self videoStopTimer];

        [self.videoPlayer.view removeFromSuperview];

    }

}

#pragma mark - Request Status Reporting

- (void)reportSuccess:(NSNumber*)advertTypeNumber
{
    advertRequestInProgress = NO;

    MobFoxAdType advertType = (MobFoxAdType)[advertTypeNumber intValue];

    self.advertLoaded = YES;
	if ([delegate respondsToSelector:@selector(mobfoxVideoInterstitialViewDidLoadMobFoxAd:advertTypeLoaded:)])
	{
		[delegate mobfoxVideoInterstitialViewDidLoadMobFoxAd:self advertTypeLoaded:advertType];
	}
}

- (void)reportError:(NSError *)error
{

    advertRequestInProgress = NO;

    self.advertLoaded = NO;
	if ([delegate respondsToSelector:@selector(mobfoxVideoInterstitialView:didFailToReceiveAdWithError:)])
	{
		[delegate mobfoxVideoInterstitialView:self didFailToReceiveAdWithError:error];
	}
}

#pragma mark - Frame Sizing

- (void)updateAllFrames:(UIInterfaceOrientation)interfaceOrientation {

    [self applyFrameSize:interfaceOrientation];

    if (self.videoPlayer.view) {
        self.videoPlayer.view.frame = self.view.bounds;
    }

    if (self.videoBottomToolbar.backgroundImage) {

        [self applyToolbarFrame:self.videoBottomToolbar bottomToolbar:YES orientation:interfaceOrientation];
    }

    if (self.videoTopToolbar.backgroundImage) {

        [self applyToolbarFrame:self.videoTopToolbar bottomToolbar:NO orientation:interfaceOrientation];

    }

    if (self.interstitialBottomToolbar.backgroundImage) {

        [self applyToolbarFrame:self.interstitialBottomToolbar bottomToolbar:YES orientation:interfaceOrientation];
    }

    if (self.interstitialTopToolbar.backgroundImage) {

        [self applyToolbarFrame:self.interstitialTopToolbar bottomToolbar:NO orientation:interfaceOrientation];

    }

    if (self.videoHTMLOverlayWebView) {
        self.videoHTMLOverlayWebView.frame = [self returnVideoHTMLOverlayFrame];
    }

    if (self.interstitialWebView) {
        self.interstitialWebView.frame = [self returnInterstitialWebFrame];
    }

    if (tempView) {
        tempView.frame = [self returnVideoHTMLOverlayFrame];
    }

}

- (void)applyFrameSize:(UIInterfaceOrientation)interfaceOrientation {

    BOOL is5 = [[UIScreen mainScreen] bounds].size.height == 568.0f;

    if (UIInterfaceOrientationIsPortrait(interfaceOrientation)) {

        if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPad) {
            self.view.frame = CGRectMake(0, 0, 768, 1024);
        } else {
            if (is5) {
                self.view.frame = CGRectMake(0, 0, 320, 568);
            } else {
                self.view.frame = CGRectMake(0, 0, 320, 480);
            }
        }

    } else {
        if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPad) {
            self.view.frame = CGRectMake(0, 0, 1024, 768);
        } else {
            if (is5) {
                self.view.frame = CGRectMake(0, 0, 568, 320);
            } else {
                self.view.frame = CGRectMake(0, 0, 480, 320);
            }
        }

    }

}

- (CGRect)returnInterstitialWebFrame {

    float topToolbarHeight = 0.0f;
    float bottomToolbarHeight = 0.0f;

    if (self.interstitialTopToolbar) {
        topToolbarHeight = self.interstitialTopToolbar.frame.size.height;
    }

    if (self.interstitialBottomToolbar) {
        bottomToolbarHeight = self.interstitialBottomToolbar.frame.size.height;
    }
    CGRect webFrame = CGRectMake(0, topToolbarHeight, self.view.bounds.size.width, self.view.bounds.size.height - topToolbarHeight - bottomToolbarHeight);

    return webFrame;

}

- (CGRect)returnVideoHTMLOverlayFrame {

    float topToolbarHeight = 0.0f;
    float bottomToolbarHeight = 0.0f;

    if (self.videoTopToolbar) {
        topToolbarHeight = self.videoTopToolbar.frame.size.height;
    }

    if (self.videoBottomToolbar) {
        bottomToolbarHeight = self.videoBottomToolbar.frame.size.height;
    }

    CGRect webFrame = CGRectMake(0, topToolbarHeight, self.view.bounds.size.width, self.view.bounds.size.height - bottomToolbarHeight - topToolbarHeight);

    return webFrame;
}

- (void)applyToolbarFrame:(MobFoxToolBar*)theToolBar bottomToolbar:(BOOL)bottomToolbar orientation:(UIInterfaceOrientation)interfaceOrientation {
    float height = 44.0f;
    float width;

    BOOL is5 = [[UIScreen mainScreen] bounds].size.height == 568.0f;

    if (theToolBar) {
        if (theToolBar.backgroundImage) {
            if (UIInterfaceOrientationIsLandscape(interfaceOrientation)) {

                if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPad) {
                    height = 122.0f;
                    width = 1024.0f;
                } else {
                    height = 57.0f;

                    if (is5) {
                        width = 568.0f;
                    } else {
                        width = 480.0f;
                    }
                }

            } else {

                if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPad) {
                    height = 91.0f;
                    width = 768.0f;
                } else {
                    height = 38.0f;
                    width = 320.0f;
                }

            }

        } else {

            if (UIInterfaceOrientationIsLandscape(interfaceOrientation)) {

                if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPad) {
                    width = 1024.0f;
                } else {
                    if (is5) {
                        width = 568.0f;
                    } else {
                        width = 480.0f;
                    }
                }

            } else {

                if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPad) {
                    width = 768.0f;
                } else {
                    width = 320.0f;
                }

            }

        }

        CGRect currentRect = theToolBar.frame;

        currentRect.size.height = height;
        currentRect.size.width = width;
        if (bottomToolbar) {
            currentRect.origin.y = self.view.frame.size.height - height;
        } else {
            currentRect.origin.y = 0;
        }
        theToolBar.frame = currentRect;

    }
}

#pragma mark - Timers

- (void)videoStalledStartTimer {

    stalledVideoStartTime = [self.videoPlayer currentPlaybackTime];

    if(![self.videoStalledTimer isValid]) {
        self.videoStalledTimer = [NSTimer scheduledTimerWithTimeInterval:5.0 target:self 
                                                                selector:@selector(checkForStalledVideo) userInfo:nil repeats:NO];

    }

}

- (void)videoStalledStopTimer {

    if([self.videoStalledTimer isValid]) {
        [self.videoStalledTimer invalidate];
        self.videoStalledTimer = nil;
    }

}

- (void)checkForStalledVideo {

    NSTimeInterval currentPlayBack = [self.videoPlayer currentPlaybackTime];

    if(currentPlayBack - stalledVideoStartTime < 3) {

        if(!videoSkipButtonDisplayed) {
                [self videoShowSkipButton];

        }

    }

}

- (void)videoStartTimer {

    if (!self.videoTimer) {
        self.videoTimer = [NSTimer scheduledTimerWithTimeInterval:0.10 target:self 
                                                         selector:@selector(updateVideoTimer) userInfo:nil repeats:YES];
    }

}

- (void)videoStopTimer {

    if([self.videoTimer isValid]) {
        [self.videoTimer invalidate];
        self.videoTimer = nil;
    }

}

- (void)interstitialStartTimer {

    self.timerStartTime = [NSDate date];

    self.interstitialTimer = [NSTimer scheduledTimerWithTimeInterval:0.10 target:self 
                                                            selector:@selector(updateInterstitialTimer) userInfo:nil repeats:YES];

}

- (void)interstitialStopTimer {

    if([self.interstitialTimer isValid]) {
        [self.interstitialTimer invalidate];
        self.interstitialTimer = nil;
    }

    self.timerStartTime = nil;

}

#pragma mark Timer Action Selectors

- (void)videoShowSkipButton {

    if (videoSkipButtonDisplayed) {
        return;
    }

    if (self.videoTopToolbar) {
        self.videoTopToolbar.items = self.videoTopToolbarButtons;
    } else {
        float skipButtonSize = buttonSize + 4.0f;
        CGRect buttonFrame = self.videoSkipButton.frame;
        buttonFrame.origin.x = self.view.frame.size.width - (skipButtonSize+10.0f);
        buttonFrame.origin.y = 10.0f;

        self.videoSkipButton.frame = buttonFrame;

        [self.videoPlayer.view addSubview:self.videoSkipButton];
    }

    videoSkipButtonDisplayed = YES;
}

- (void)showInterstitialSkipButton {

    if (interstitialSkipButtonDisplayed) {
        return;
    }

    if (self.interstitialTopToolbar) {
        self.interstitialTopToolbar.items = self.interstitialTopToolbarButtons;
    } else {
        float skipButtonSize = buttonSize + 4.0f;
        CGRect buttonFrame = self.interstitialSkipButton.frame;
        buttonFrame.origin.x = self.view.frame.size.width - (skipButtonSize+10.0f);
        buttonFrame.origin.y = 10.0f;

        self.interstitialSkipButton.frame = buttonFrame;

        [self.interstitialHoldingView addSubview:self.interstitialSkipButton]; 
    }

    interstitialSkipButtonDisplayed = YES;
}

- (void)videoShowHTMLOverlay {

    self.videoHTMLOverlayWebView = [[UIWebView alloc]initWithFrame:[self returnVideoHTMLOverlayFrame]];
    self.videoHTMLOverlayWebView.delegate = (id)self;
    self.videoHTMLOverlayWebView.dataDetectorTypes = UIDataDetectorTypeAll;

    self.videoHTMLOverlayWebView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    [self removeUIWebViewBounce:self.videoHTMLOverlayWebView];

    [self.videoHTMLOverlayWebView loadHTMLString:self.videoHTMLOverlayHTML baseURL:nil];
    self.videoHTMLOverlayWebView.backgroundColor = [UIColor clearColor];
    self.videoHTMLOverlayWebView.opaque = NO;
    UITapGestureRecognizer *touch = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleSingleTap:)]; 
    touch.delegate = self;
    [self.videoHTMLOverlayWebView addGestureRecognizer:touch];

    [self.videoPlayer.view addSubview:self.videoHTMLOverlayWebView];

    if(videoSkipButtonShow) {
        if(videoSkipButtonDisplayed) {
            [self.videoPlayer.view bringSubviewToFront:videoSkipButton]; 
        }
    }

}

- (void)updateVideoTimerLabel:(NSTimeInterval)progress {
    if(videoTimerShow) {

        float countDownProgress = videoDuration - progress;

        int minutes = floor(countDownProgress/60);
        int seconds = trunc(countDownProgress - minutes * 60);
        self.videoTimerLabel.text = [NSString stringWithFormat:@"%i:%.2d", minutes, seconds];
    }

}

- (void)updateVideoTimer {

    NSTimeInterval currentProgress = [self.videoPlayer currentPlaybackTime];
    [self updateVideoTimerLabel:currentProgress];

    int timeToCheckAgainst = (int)roundf(currentProgress);
    if (videoDuration != 0) {
        if (timeToCheckAgainst == videoDuration/2) {
            [self advertActionTrackingEvent:@"Midpoint"];
        }

        int quartile = videoDuration/4;
        if (timeToCheckAgainst == quartile) {
            [self advertActionTrackingEvent:@"firstquartile"];
        }
        if (timeToCheckAgainst == (quartile*3)) {
            [self advertActionTrackingEvent:@"thirdquartile"];
        }
    }

    [self advertActionTrackingEvent:[NSString stringWithFormat:@"sec:%d", timeToCheckAgainst]];

    if(!videoSkipButtonDisplayed) {
        if(videoSkipButtonShow) {
            if(videoSkipButtonDisplayDelay == timeToCheckAgainst) {
                [self videoShowSkipButton];
            }
        }
    }

    if(!videoHtmlOverlayDisplayed) {
        if (self.videoHTMLOverlayHTML) {
            if(videoHTMLOverlayDisplayDelay == timeToCheckAgainst) {
                [self videoShowHTMLOverlay];
                videoHtmlOverlayDisplayed = YES;
            }
        }
    }
}

- (void)updateInterstitialTimer {

    NSDate *currentDate = [NSDate date];
    NSTimeInterval progress = [currentDate timeIntervalSinceDate:self.timerStartTime];

    int timeToCheckAgainst = (int)roundf(progress);
    if (!interstitialAutoCloseDisabled) {
        if (timeToCheckAgainst == interstitialAutoCloseDelay) {

            [self interstitialStopTimer];

            [self interstitialSkipAction:nil];

            return;
        }
    }

    if(!interstitialSkipButtonDisplayed) {
        if(interstitialSkipButtonShow) {
            if(interstitialSkipButtonDisplayDelay == timeToCheckAgainst) {
                [self showInterstitialSkipButton];
            }
        }
    }

    if(interstitialTimerShow) {

        float countDownProgress = interstitialAutoCloseDelay - progress;

        int minutes = floor(countDownProgress/60);
        int seconds = trunc(countDownProgress - minutes * 60);
        self.interstitialTimerLabel.text = [NSString stringWithFormat:@"%i:%.2d", minutes, seconds];
    }
}

#pragma mark Video Control

- (void)videoPause {

    [self advertActionTrackingEvent:@"pause"];

    [self.videoPlayer pause];
    [self videoStopTimer];

}

- (void)videoUnPause {

    [self advertActionTrackingEvent:@"unpause"];

    [self.videoPlayer play];

    [self videoStartTimer];

}

#pragma mark - Interaction

- (void)tapThrough:(BOOL)tapThroughLeavesApp tapThroughURL:(NSURL*)tapThroughURL
{
    tapThroughLeavesApp = YES;

	if (tapThroughLeavesApp || [tapThroughURL isDeviceSupported])
	{

        if ([delegate respondsToSelector:@selector(mobfoxBannerViewActionWillLeaveApplication:)])
        {
            [delegate mobfoxVideoInterstitialViewActionWillLeaveApplication:self];
        }

        [[UIApplication sharedApplication]openURL:tapThroughURL];
		return;
	}
    if (!advertTypeCurrentlyPlaying == MobFoxAdTypeVideo) {
        viewController = [self firstAvailableUIViewController]; 
    }

	MobFoxAdBrowserViewController *browser = [[MobFoxAdBrowserViewController alloc] initWithUrl:tapThroughURL];
    browser.delegate = (id)self;
	browser.userAgent = self.userAgent;
    browser.webView.scalesPageToFit = YES;
	browser.view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    if (self.videoPlayer.playbackState == MPMoviePlaybackStatePlaying ) {
        videoWasPlaying = YES;
        [self videoPause];
    } else {
        videoWasPlaying = NO;
    }

    if (!advertTypeCurrentlyPlaying == MobFoxAdTypeVideo) {
        [viewController presentModalViewController:browser animated:YES];
    } else {
        [self.mobFoxVideoPlayerViewController.view addSubview:browser.webView];
    }
}

- (void)postTrackingEvent:(NSString*)urlString {

    NSURL *url = [NSURL URLWithString:urlString];
	NSMutableURLRequest *request;

    request = [NSMutableURLRequest requestWithURL:url];

    NSURLConnection *connection = [NSURLConnection connectionWithRequest:request delegate:nil];
    [connection start];

}

- (void)advertActionTrackingEvent:(NSString*)eventType {

    NSPredicate *predicate = [NSPredicate predicateWithFormat:@"ANY @allKeys = %@", eventType];
    NSArray *trackingEvents = [self.advertTrackingEvents filteredArrayUsingPredicate:predicate];

    NSMutableArray *trackingEventsToRemove = [NSMutableArray arrayWithCapacity:0];

	for (NSDictionary *trackingEvent in trackingEvents)
	{

        NSString *urlString = [trackingEvent objectForKey:eventType];

        if (urlString) {

            [self postTrackingEvent:urlString];

            [trackingEventsToRemove addObject:trackingEvent];

        }

	}
    if (![eventType isEqualToString:@"mute"] && ![eventType isEqualToString:@"unmute"] && ![eventType isEqualToString:@"pause"] && ![eventType isEqualToString:@"unpause"] && ![eventType isEqualToString:@"skip"] && ![eventType isEqualToString:@"replay"]) {

        if ([trackingEventsToRemove count]) {
            [self.advertTrackingEvents removeObjectsInArray:trackingEventsToRemove]; 
        }

    }

}

- (void)toggleToolbars {

    if (self.videoTopToolbar || self.videoBottomToolbar) {
        BOOL toolbarsHidden;

        if (self.videoTopToolbar) {
            toolbarsHidden = self.videoTopToolbar.alpha == 0.00 ? YES : NO;
        }

        if (self.videoBottomToolbar) {
            toolbarsHidden = self.videoBottomToolbar.alpha == 0.00 ? YES : NO;
        }

        float alphaToSet = toolbarsHidden ? 1.0 : 0.0;
        if (!toolbarsHidden) {
            [UIView beginAnimations:nil context:nil];
            [UIView setAnimationDuration:0.25];
            [UIView setAnimationCurve:UIViewAnimationCurveEaseInOut];
        }

        self.videoTopToolbar.alpha = alphaToSet;
        self.videoBottomToolbar.alpha = alphaToSet;

        if (!toolbarsHidden) {
            [UIView commitAnimations];
        }
    }
}

#pragma mark Interstitial Interaction

- (void)removeAutoClose {
    interstitialTimerShow = NO;
    [self.interstitialTimerLabel removeFromSuperview];

}

- (void)checkAndCancelAutoClose {

    if (!interstitialAutoCloseDisabled) {

        interstitialAutoCloseDisabled = YES;

        if(self.interstitialWebView) {

            if (interstitialTimerShow) {
                [self removeAutoClose];
            }

        }
    }
    if(!interstitialSkipButtonDisplayed) {
        [self showInterstitialSkipButton];
    }

}

#pragma mark Button Actions

- (void)browserBackButtonAction:(id)sender {

    [self.interstitialWebView goBack];

    [self checkAndCancelAutoClose];

}

- (void)browserForwardButtonAction:(id)sender {

    [self.interstitialWebView goForward];

    [self checkAndCancelAutoClose];

}

- (void)browserReloadButtonAction:(id)sender {

    [self interstitialLoadWebPage];

    [self checkAndCancelAutoClose];

}

- (void)browserExternalButtonAction:(id)sender {

    [self checkAndCancelAutoClose];

    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:self.interstitialURL]];

}

- (void)videoSkipAction:(id)sender {

    videoWasSkipped = YES;

    [self advertActionTrackingEvent:@"skip"];

    if (self.videoPlayer.playbackState != MPMoviePlaybackStateStopped ) {
        [self.videoPlayer stop];
    } else {
        [self videoStopAdvert];
    }
}

- (void)navIconAction:(id)sender {

    UIButton *theButton = (UIButton*)sender;
    NSDictionary *buttonObject = theButton.objectTag;

    BOOL clickleavesApp = [[buttonObject objectForKey:@"openType"] isEqualToString:@"external"];
    NSString *urlString = [buttonObject objectForKey:@"clickUrl"];

    NSString *prefix = [urlString substringToIndex:5];

	if ([prefix isEqualToString:@"mfox:"]) {

        NSString *actionString = [urlString substringFromIndex:5];

        if ([actionString isEqualToString:@"skip"]) {

            [self videoSkipAction:nil];
            return;
        }

        if ([actionString isEqualToString:@"replayvideo"]) {

            [self videoReplayButtonAction:nil];

            return;
        }

    } else {
        NSURL *clickUrl = [NSURL URLWithString:urlString];

        [self tapThrough:clickleavesApp tapThroughURL:clickUrl];

    }

}

- (void)videoPausePlayButtonAction:(id)sender {

    UIButton *theButton = (UIButton*)sender;

    BOOL videoIsPlaying = self.videoPlayer.playbackState != MPMoviePlaybackStatePaused;
    if (videoIsPlaying) {

        [self videoPause];

        [theButton setImage:self.videoPlayButtonImage forState:UIControlStateNormal];
        [theButton setImage:self.videoPlayButtonDisabledImage forState:UIControlStateHighlighted];

        [self videoShowSkipButton];

    } else {

        [self videoUnPause];

        [theButton setImage:self.videoPauseButtonImage forState:UIControlStateNormal];
        [theButton setImage:self.videoPauseButtonDisabledImage forState:UIControlStateHighlighted];
    }
}

- (void)videoReplayButtonAction:(id)sender {

    [self advertActionTrackingEvent:@"replay"];

    [self.videoPlayer setCurrentPlaybackTime:0.0];
    if (self.videoPlayer.playbackState != MPMoviePlaybackStatePlaying ) {

        [self updateVideoTimerLabel:0.00];

    }
}

- (void)interstitialSkipAction:(id)sender {

    [self interstitialStopAdvert];

}

#pragma mark -
#pragma mark Actionsheet Delegate

- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex {

    if (buttonIndex == 0) {

        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:self.interstitialURL]];
    }

}

#pragma mark -
#pragma mark MPMoviePlayerController Delegate

- (void)playerLoadStateDidChange:(NSNotification*)notification{

	MPMovieLoadState state = [(MPMoviePlayerController *)notification.object loadState];
	if( state & MPMovieLoadStateUnknown ) {
	}

	if( state & MPMovieLoadStatePlayable ) {

        [self videoStalledStopTimer];

	}
	if( state & MPMovieLoadStatePlaythroughOK ) {

	}
	if( state & MPMovieLoadStateStalled ) {

        [self videoStalledStartTimer];

    }

}

- (void)playerPlayBackStateDidChange:(NSNotification*)notification{

	MPMoviePlaybackState state = [(MPMoviePlayerController *)notification.object playbackState];
	if( state == MPMoviePlaybackStateStopped ) {
	}

	if( state == MPMoviePlaybackStatePlaying ) {
        [self videoStalledStopTimer];
	}
	if( state == MPMoviePlaybackStatePaused ) {
	}

	if( state == MPMoviePlaybackStateInterrupted ) {

        [self videoStalledStartTimer];

    }
	if( state == MPMoviePlaybackStateSeekingForward ) {
	} 
	if( state == MPMoviePlaybackStateSeekingBackward ) {
	}

}

- (void)playerPlayBackDidFinish:(NSNotification*)notification {
    NSDictionary *userInfo = [notification userInfo];
	NSError *error = [userInfo objectForKey:@"error"];
    NSInteger reasonForFinish = [[userInfo objectForKey:MPMoviePlayerPlaybackDidFinishReasonUserInfoKey] intValue];

    if (error) {
        switch (reasonForFinish) {
            case MPMovieFinishReasonPlaybackError:
                break;
        }

        videoVideoFailedToLoad = YES;

    } else {

        switch (reasonForFinish) {
            case MPMovieFinishReasonPlaybackEnded:
            case MPMovieFinishReasonUserExited:
                [self advertActionTrackingEvent:@"complete"];
                [self videoStopAdvert];
                break;
        }

    }

}

#pragma mark - UIWebView Delegates

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {

    if (webView == self.interstitialWebView) {
        self.browserBackButton.enabled = webView.canGoBack;
        self.browserForwardButton.enabled = webView.canGoForward;
    }

}

- (BOOL)webView:(UIWebView*)webView shouldStartLoadWithRequest:(NSURLRequest*)request navigationType:(UIWebViewNavigationType)navigationType {
    if (navigationType == UIWebViewNavigationTypeLinkClicked) {

        NSURL *theUrl = [request URL];

        NSString *requestString = [theUrl absoluteString];

        NSString *prefix = [requestString substringToIndex:5];

        if ([prefix isEqualToString:@"mfox:"]) {

            NSString *actionString = [requestString substringFromIndex:5];
            if ([actionString isEqualToString:@"playvideo"] && self.videoPlayer) {
                [self checkAndCancelAutoClose];

                if (advertTypeCurrentlyPlaying == MobFoxAdTypeInterstitialToVideo) {
                    [interstitialViewController dismissModalViewControllerAnimated:NO];
                }

               [self.mobFoxVideoPlayerViewController.view addSubview:self.videoPlayer.view];
               videoViewController = [self firstAvailableUIViewController];
               videoViewController.wantsFullScreenLayout = YES;

               [videoViewController presentModalViewController:self.mobFoxVideoPlayerViewController animated:NO];
               [self advertAnimateIn:self.advertAnimation advertTypeLoaded:MobFoxAdTypeVideo viewToAnimate:self.mobFoxVideoPlayerViewController.view];

                return NO;
            }
            if ([actionString isEqualToString:@"skip"] && self.videoPlayer) {

                [self videoSkipAction:nil];

                return NO;
            }
            if ([actionString isEqualToString:@"replayvideo"]) {

                if (self.videoPlayer) {
                    [self videoReplayButtonAction:nil];
                }

                if(self.interstitialWebView) {
                    [self browserReloadButtonAction:nil];
                }

                return NO;
            }
            actionString = [requestString substringToIndex:14];
            if([actionString isEqualToString:@"mfox:external:"]) {

                [self checkAndCancelAutoClose];

                actionString = [requestString substringFromIndex:14];

                [[UIApplication sharedApplication] openURL:[NSURL URLWithString:actionString]];
            }

            return NO;
        }

    }
    if (webView == self.interstitialWebView) {

        if(navigationType != UIWebViewNavigationTypeOther && navigationType != UIWebViewNavigationTypeReload && navigationType != UIWebViewNavigationTypeBackForward) {
            [self checkAndCancelAutoClose];
        }
        self.browserBackButton.enabled = webView.canGoBack;
        self.browserForwardButton.enabled = webView.canGoForward;

        return YES;

    }
    if (webView == self.videoHTMLOverlayWebView) {

        if (navigationType == UIWebViewNavigationTypeLinkClicked) {

            viewController = [self firstAvailableUIViewController];

            NSURL *theUrl = [request URL];

            NSString *requestString = [theUrl absoluteString];

            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:requestString]];

            return NO;

        }

        return YES;
    }

    return YES;
}

#pragma mark - Modal Web View Display & Dismissal

- (void)presentFromRootViewController:(UIViewController *)rootViewController
{

    if(!_browser)
        return;
    if (self.videoPlayer.playbackState == MPMoviePlaybackStatePlaying ) {
        videoWasPlaying = YES;
        [self videoPause];
    } else {
        videoWasPlaying = NO;
    }

    [rootViewController presentModalViewController:_browser animated:YES];

}

- (void)mobfoxAdBrowserControllerDidDismiss:(MobFoxAdBrowserViewController *)mobfoxAdBrowserController
{
	[mobfoxAdBrowserController dismissModalViewControllerAnimated:YES];

    if (self.videoPlayer.playbackState == MPMoviePlaybackStatePaused && videoWasPlaying) {
        [self videoUnPause];
    }

    _browser = nil;

    mobfoxAdBrowserController.webView = nil;
    mobfoxAdBrowserController = nil;
    UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];;
    [self updateAllFrames:interfaceOrientation];
}

#pragma mark - UIGestureRecognizer & UIWebView & Tap Detecting Methods

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
    if ([otherGestureRecognizer isKindOfClass:[UILongPressGestureRecognizer class]]) {
        return NO;
    }
    return YES;
}

- (void)handleSingleTap:(UITapGestureRecognizer *)recognizer {
    if (recognizer.state == UIGestureRecognizerStateEnded)     {

        if (self.videoPlayer) {
            [self toggleToolbars];
        }

        [self checkAndCancelAutoClose];

    }
}

#pragma mark
#pragma mark Status Bar Handling

- (void)hideStatusBar
{

    if(self.mobFoxVideoPlayerViewController && !self.interstitialHoldingView) {
        statusBarWasVisible = YES;
        return;
    }

    if(self.mobFoxInterstitialPlayerViewController) {
        statusBarWasVisible = YES;
        return;
    }
    UIApplication *app = [UIApplication sharedApplication];
	if (!app.statusBarHidden)
	{

        [app setStatusBarHidden:YES withAnimation:UIStatusBarAnimationNone];
		[app setStatusBarStyle:UIStatusBarStyleBlackOpaque animated:NO];

		statusBarWasVisible = YES;

        CGRect frame = self.view.superview.frame;
        if([UIApplication sharedApplication].statusBarHidden ) {

            UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];

            if (UIInterfaceOrientationIsPortrait(interfaceOrientation)) {

                if (interfaceOrientation == UIInterfaceOrientationPortrait ) {
                    frame.origin.y -= statusBarHeight;
                } else {
                    frame.origin.y = 0;
                }
                frame.size.height += statusBarHeight;
            } else {

                if (interfaceOrientation == UIInterfaceOrientationLandscapeLeft ) {
                    frame.origin.x -= statusBarHeight;
                } else {
                    frame.origin.x = 0;
                }
                frame.size.width += statusBarHeight;
            }

        }
        self.view.superview.frame = frame;

	}

}

- (void)showStatusBarIfNecessary
{
	if (statusBarWasVisible)
	{
		UIApplication *app = [UIApplication sharedApplication];

        [app setStatusBarHidden:NO withAnimation:UIStatusBarAnimationNone];
		[app setStatusBarStyle:UIStatusBarStyleBlackOpaque animated:NO];

        CGRect frame = self.view.superview.frame;
        if(![UIApplication sharedApplication].statusBarHidden ) {

            UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];
            if (UIInterfaceOrientationIsPortrait(interfaceOrientation)) {
                if (interfaceOrientation == UIInterfaceOrientationPortrait ) {
                    frame.origin.y += statusBarHeight;
                } else {
                    frame.origin.y = 0;
                }

                frame.size.height -= statusBarHeight;
            } else {
                if (interfaceOrientation == UIInterfaceOrientationLandscapeLeft ) {
                    frame.origin.x += statusBarHeight;
                } else {
                    frame.origin.x = 0;
                }

                frame.size.width -= statusBarHeight;

            }
        }
        self.view.superview.frame = frame;

	}
}

#pragma mark
#pragma mark Notifications

- (void)advertAddNotificationObservers:(MobFoxAdGroupType)adGroup {

    if (adGroup == MobFoxAdGroupVideo) {

        [[NSNotificationCenter defaultCenter] addObserver:self 
                                                 selector:@selector(playerLoadStateDidChange:) 
                                                     name:MPMoviePlayerLoadStateDidChangeNotification 
                                                   object:self.videoPlayer];

        [[NSNotificationCenter defaultCenter] addObserver:self 
                                                 selector:@selector(playerPlayBackStateDidChange:) 
                                                     name:MPMoviePlayerLoadStateDidChangeNotification 
                                                   object:self.videoPlayer];

        [[NSNotificationCenter defaultCenter] addObserver:self 
                                                 selector:@selector(playerPlayBackDidFinish:) 
                                                     name:MPMoviePlayerPlaybackDidFinishNotification
                                                   object:self.videoPlayer];
    }

    if (adGroup == MobFoxAdGroupInterstitial) {
    }

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(deviceOrientationDidChange:) 
                                                         name:UIDeviceOrientationDidChangeNotification object:nil];

}

- (void)advertRemoveNotificationObservers:(MobFoxAdGroupType)adGroup {

    if (adGroup == MobFoxAdGroupVideo) {
        [[NSNotificationCenter defaultCenter] removeObserver:self 
                                                        name:MPMoviePlayerLoadStateDidChangeNotification 
                                                      object:nil];

        [[NSNotificationCenter defaultCenter] removeObserver:self 
                                                        name:MPMoviePlayerPlaybackStateDidChangeNotification 
                                                      object:nil];

        [[NSNotificationCenter defaultCenter] removeObserver:self 
                                                        name:MPMoviePlayerPlaybackDidFinishNotification 
                                                      object:nil];

    }
    if (adGroup == MobFoxAdGroupInterstitial) {
    }

    [[NSNotificationCenter defaultCenter] removeObserver:self 
                                                        name:UIDeviceOrientationDidChangeNotification 
                                                        object:nil];
}

- (void) appDidBecomeActive:(NSNotification *)notification
{
    if (self.videoPlayer) {

        [self advertAddNotificationObservers:MobFoxAdGroupVideo];

        if (videoWasPlayingBeforeResign) {
            [self videoUnPause];

            videoWasPlayingBeforeResign = NO;
        }
    }

    if(self.interstitialWebView) {
        [self advertAddNotificationObservers:MobFoxAdGroupInterstitial];

    }

}

- (void) appWillResignActive:(NSNotification *)notification
{
    if (self.videoPlayer) {

        [self advertRemoveNotificationObservers:MobFoxAdGroupVideo];

        if (self.videoPlayer.playbackState == MPMoviePlaybackStatePlaying ) {
            videoWasPlayingBeforeResign = YES;
            [self videoPause];
        } else {
            videoWasPlayingBeforeResign = NO;
        }

    }

    if(self.interstitialWebView) {
        [self advertRemoveNotificationObservers:MobFoxAdGroupInterstitial];

    }

}

- (void)deviceOrientationDidChange:(NSNotification *)notification {
    UIInterfaceOrientation interfaceOrientation = [[UIApplication sharedApplication] statusBarOrientation];;
    [self updateAllFrames:interfaceOrientation];
}

@end
