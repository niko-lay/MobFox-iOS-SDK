#import "BizzclickHTMLBannerView.h"
#import "NSString+Bizzclick.h"
#import "MFDTXMLDocument.h"
#import "MFDTXMLElement.h"
#import "UIView+FindViewController.h"
#import "NSURL+MobFox.h"
#import "MobFoxAdBrowserViewController.h"
#import "MFRedirectChecker.h"
#import "UIDevice+MFIdentifierAddition.h"
#import "AdMobCustomEventBanner.h"
#import "iAdCustomEventBanner.h"


#import <AdSupport/AdSupport.h>
#import "MobFoxMRAIDBannerAdapter.h"
#import "MPBaseBannerAdapterMF.h"
#import "MPAdViewMF.h"
#import "MPAdConfigurationMF.h"
#import "MFCustomEvent.h"
#import "NSDictionary+Bizzclick.h"



NSString * const ErrorDomain = @"BizzClickSDKError";

@interface BizzclickHTMLBannerView () <UIWebViewDelegate, MPBannerAdapterDelegateMF, MFCustomEventBannerDelegate, UIGestureRecognizerDelegate, CLLocationManagerDelegate> {
    int ddLogLevel;
    NSString *skipOverlay;
    NSMutableArray *customEvents;
    BOOL wasUserAction;
    BOOL normalBannerWasShownAfterCustomEventFail;
    CLLocation *currentLocation;
    NSNumber *adspaceID;
//    CTTelephonyNetworkInfo *telephonyInfo;
}

@property (nonatomic, strong) NSString *userAgent;
@property (nonatomic, strong) NSString *skipOverlay;
@property (nonatomic, strong) NSString *adType;
@property (nonatomic, strong) MobFoxMRAIDBannerAdapter *adapter;
@property (nonatomic, assign) CGFloat userProvidedLatitude;
@property (nonatomic, assign) CGFloat userProvidedLongitude;
@property (nonatomic, assign) CGFloat fetchLatitude;
@property (nonatomic, assign) CGFloat fetchLongitude;
@property (nonatomic, strong) NSString* htmlString;

@property (nonatomic, retain) UIView *bannerView;
@property (nonatomic, strong) MFCustomEventBanner *customEventBanner;

@property (nonatomic, strong) NSMutableDictionary *browserUserAgentDict;

@end



@implementation BizzclickHTMLBannerView
{
	MFRedirectChecker *redirectChecker;
}


- (void)setup
{
    UIWebView* webView = [[UIWebView alloc] initWithFrame:CGRectZero];
    self.userAgent = [webView stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];

    [self setUpBrowserUserAgentStrings];
    self.autoresizingMask = UIViewAutoresizingNone;
	self.backgroundColor = [UIColor clearColor];
	refreshAnimation = UIViewAnimationTransitionFlipFromLeft;

    customEvents = [[NSMutableArray alloc] init];

   	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appDidBecomeActive:) name:UIApplicationDidBecomeActiveNotification object:nil];
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appWillResignActive:) name:UIApplicationWillResignActiveNotification object:nil];
}

- (id)initWithFrame:(CGRect)frame
{
    if ((self = [super initWithFrame:frame]))
    {
        [self setup];
    }
    return self;
}

- (void)awakeFromNib
{
    [self setup];
}

- (void)dealloc
{
    if(self.adapter) {
        [self.adapter unregisterDelegate];
    }

    self.adapter = nil;
    self.customEventBanner = nil;
    self.bannerView = nil;
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    delegate = nil;
    if(_refreshTimer){
        [_refreshTimer invalidate], _refreshTimer = nil;
    }

    [locationManager stopUpdatingLocation];
}

#pragma mark - CLLocationManagerDelegate
-(void)CurrentLocationIdentifier
{
    if (nil == locationManager)
        locationManager = [[CLLocationManager alloc] init];

    locationManager.delegate = self;
    locationManager.distanceFilter = 1000;
    locationManager.desiredAccuracy = kCLLocationAccuracyKilometer;
    [locationManager requestLocation];
    //[locationManager startUpdatingLocation];
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
    NSLog(@"%@", error);
}

- (void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation
{
    NSLog(@"didUpdateToLocation from %@ to %@", oldLocation, newLocation );

    CLLocation *curLocation = newLocation;
    if (curLocation != nil) {
        self.fetchLatitude = curLocation.coordinate.latitude;
        self.fetchLongitude = curLocation.coordinate.longitude;
    }
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
    NSLog(@"didUpdateLocations %@", locations);

    CLLocation *curLocation = [locations objectAtIndex:0];
    if ( curLocation != nil) {
        self.fetchLatitude = curLocation.coordinate.latitude;
        self.fetchLongitude = curLocation.coordinate.longitude;
    }
}


#pragma mark Utilities

- (UIImage*)darkeningImageOfSize:(CGSize)size
{
	UIGraphicsBeginImageContext(size);
	CGContextRef ctx = UIGraphicsGetCurrentContext();
	CGContextSetGrayFillColor(ctx, 0, 1);
	CGContextFillRect(ctx, CGRectMake(0, 0, size.width, size.height));
	UIImage *cropped = UIGraphicsGetImageFromCurrentImageContext();
	UIGraphicsEndImageContext();
	return cropped;
}

- (NSURL *)serverURL
{
    return [NSURL URLWithString:@"http://ad.bizzclick.com:9080/ad.php"];
}

#pragma mark Properties

- (void)setBounds:(CGRect)bounds
{
	[super setBounds:bounds];
	for (UIView *oneView in self.subviews)
	{
		oneView.center = CGPointMake(roundf(self.bounds.size.width / 2.0), roundf(self.bounds.size.height / 2.0));
	}
}

- (void)setTransform:(CGAffineTransform)transform
{
	[super setTransform:transform];
	for (UIView *oneView in self.subviews)
	{
		oneView.center = CGPointMake(roundf(self.bounds.size.width / 2.0), roundf(self.bounds.size.height / 2.0));
	}
}

- (void)setDelegate:(id <BizzclickHTMLBannerViewDelegate>)newDelegate
{
	if (newDelegate != delegate)
	{
		delegate = newDelegate;
	}
}

- (void)setRefreshTimerActive:(BOOL)active
{
    if(_refreshTimer){
        [_refreshTimer invalidate], _refreshTimer = nil;
    }
    
    if (refreshTimerOff) {
        return;
    }
    
	if (active && !bannerViewActionInProgress && (_refreshInterval || _customReloadTime))
	{
        if(_customReloadTime) {
            _refreshTimer = [NSTimer scheduledTimerWithTimeInterval:_customReloadTime target:self selector:@selector(requestAdByTimer:) userInfo:adspaceID repeats:YES];
        } else {
            _refreshTimer = [NSTimer scheduledTimerWithTimeInterval:_refreshInterval target:self selector:@selector(requestAdByTimer:) userInfo:adspaceID repeats:YES];
        }
        
	}
}

#pragma - mark Utilities

- (void)hideStatusBar
{
	UIApplication *app = [UIApplication sharedApplication];
	if (!app.statusBarHidden)
	{
		if ([app respondsToSelector:@selector(setStatusBarHidden:withAnimation:)])
		{
			[app setStatusBarHidden:YES withAnimation:UIStatusBarAnimationFade];
		}
		else
		{
			[app setStatusBarHidden:YES];
		}

		_statusBarWasVisible = YES;
	}
}

- (void)showStatusBarIfNecessary
{
	if (_statusBarWasVisible)
	{
		UIApplication *app = [UIApplication sharedApplication];

		if ([app respondsToSelector:@selector(setStatusBarHidden:withAnimation:)])
		{
			[app setStatusBarHidden:NO withAnimation:UIStatusBarAnimationFade];
		}
		else
		{
			[app setStatusBarHidden:NO];
		}
	}
}

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

#pragma mark IP address routine

#include <ifaddrs.h>
#include <arpa/inet.h>
#include <net/if.h>

#define IOS_CELLULAR    @"pdp_ip0"
#define IOS_WIFI        @"en0"
#define IOS_VPN         @"utun0"
#define IP_ADDR_IPv4    @"ipv4"
#define IP_ADDR_IPv6    @"ipv6"

- (NSString *)getIPAddress:(BOOL)preferIPv4
{
    NSArray *searchArray = preferIPv4 ?
    @[ IOS_VPN @"/" IP_ADDR_IPv4, IOS_VPN @"/" IP_ADDR_IPv6, IOS_WIFI @"/" IP_ADDR_IPv4, IOS_WIFI @"/" IP_ADDR_IPv6, IOS_CELLULAR @"/" IP_ADDR_IPv4, IOS_CELLULAR @"/" IP_ADDR_IPv6 ] :
    @[ IOS_VPN @"/" IP_ADDR_IPv6, IOS_VPN @"/" IP_ADDR_IPv4, IOS_WIFI @"/" IP_ADDR_IPv6, IOS_WIFI @"/" IP_ADDR_IPv4, IOS_CELLULAR @"/" IP_ADDR_IPv6, IOS_CELLULAR @"/" IP_ADDR_IPv4 ] ;

    NSDictionary *addresses = [self getIPAddresses];
    NSLog(@"addresses: %@", addresses);

    __block NSString *address;
    [searchArray enumerateObjectsUsingBlock:^(NSString *key, NSUInteger idx, BOOL *stop)
     {
         address = addresses[key];
         if(address) *stop = YES;
     } ];
    return address ? address : @"0.0.0.0";
}

- (NSDictionary *)getIPAddresses
{
    NSMutableDictionary *addresses = [NSMutableDictionary dictionaryWithCapacity:8];

    // retrieve the current interfaces - returns 0 on success
    struct ifaddrs *interfaces;
    if(!getifaddrs(&interfaces)) {
        // Loop through linked list of interfaces
        struct ifaddrs *interface;
        for(interface=interfaces; interface; interface=interface->ifa_next) {
            if(!(interface->ifa_flags & IFF_UP) || (interface->ifa_flags & IFF_LOOPBACK) ) {
                continue; // deeply nested code harder to read
            }
            const struct sockaddr_in *addr = (const struct sockaddr_in*)interface->ifa_addr;
            char addrBuf[ MAX(INET_ADDRSTRLEN, INET6_ADDRSTRLEN) ];
            if(addr && (addr->sin_family==AF_INET || addr->sin_family==AF_INET6)) {
                NSString *name = [NSString stringWithUTF8String:interface->ifa_name];
                NSString *type;
                if(addr->sin_family == AF_INET) {
                    if(inet_ntop(AF_INET, &addr->sin_addr, addrBuf, INET_ADDRSTRLEN)) {
                        type = IP_ADDR_IPv4;
                    }
                } else {
                    const struct sockaddr_in6 *addr6 = (const struct sockaddr_in6*)interface->ifa_addr;
                    if(inet_ntop(AF_INET6, &addr6->sin6_addr, addrBuf, INET6_ADDRSTRLEN)) {
                        type = IP_ADDR_IPv6;
                    }
                }
                if(type) {
                    NSString *key = [NSString stringWithFormat:@"%@/%@", name, type];
                    addresses[key] = [NSString stringWithUTF8String:addrBuf];
                }
            }
        }
        // Free memory
        freeifaddrs(interfaces);
    }
    return [addresses count] ? addresses : nil;
}


#pragma mark MRAID (MOPUB required)

- (UIViewController *)viewControllerForPresentingModalView
{
	return [self firstAvailableUIViewController];
}

#pragma mark Ad Handling
- (void)reportSuccess
{
	bannerLoaded = YES;
	if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewDidLoadAd:)])
	{
		[delegate bizzclickHTMLBannerViewDidLoadAd:self];
	}
}

- (void)reportRefresh
{
	if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewDidLoadRefreshedAd:)])
	{
		[delegate bizzclickHTMLBannerViewDidLoadRefreshedAd:self];
	}
}

- (void)reportError:(NSError *)error
{
	bannerLoaded = NO;
	if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerView:didFailToReceiveAdWithError:)])
	{
		[delegate bizzclickHTMLBannerView:self didFailToReceiveAdWithError:error];
	}
}

- (void)setupAdFromXmlWithDictionary:(NSDictionary*)dict{

        MFDTXMLDocument *xml = [dict objectForKey:@"xml"];
        NSDictionary *headers = [dict objectForKey:@"headers"];
       // NSNumber *adspaceId = [dict objectForKey:@"adspaceId"];

        if ([xml.documentRoot.name isEqualToString:@"error"])
        {
            NSString *errorMsg = xml.documentRoot.text;

            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:errorMsg forKey:NSLocalizedDescriptionKey];

            NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorUnknown userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }
        NSArray *previousSubviews = [NSArray arrayWithArray:self.subviews];

        MFDTXMLElement *htmlElement = [xml.documentRoot getNamedChild:@"htmlString"];
        self.skipOverlay = [htmlElement.attributes objectForKey:@"skipoverlaybutton"];

        NSString *clickType = [xml.documentRoot getNamedChild:@"clicktype"].text;
        if ([clickType isEqualToString:@"inapp"])
        {
            _tapThroughLeavesApp = NO;
        }
        else
        {
            _tapThroughLeavesApp = YES;
        }
        NSString *clickUrlString = [xml.documentRoot getNamedChild:@"clickurl"].text;
        if ([clickUrlString length])
        {
            clickUrlString = [clickUrlString stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];

            _tapThroughURL = [NSURL URLWithString:clickUrlString];
        }
        _shouldScaleWebView = [[xml.documentRoot getNamedChild:@"scale"].text isEqualToString:@"yes"];
        _shouldSkipLinkPreflight = [[xml.documentRoot getNamedChild:@"skippreflight"].text isEqualToString:@"yes"];
        self.bannerView = nil;
        adType = [xml.documentRoot.attributes objectForKey:@"type"];
        _refreshInterval = [[xml.documentRoot getNamedChild:@"refresh"].text intValue];
        // !!! 
        [self setRefreshTimerActive:YES];

        if ([adType isEqualToString:@"imageAd"])
        {

        }
        else if ([adType isEqualToString:@"textAd"])
        {
            NSString *html = [xml.documentRoot getNamedChild:@"htmlString"].text;

            CGSize bannerSize;
            if(adspaceHeight > 0 && adspaceWidth > 0)
            {
                bannerSize = CGSizeMake(adspaceWidth, adspaceHeight);
            }
            else if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPad)
            {
                bannerSize = CGSizeMake(728, 90);
            }
            else
            {
                bannerSize = CGSizeMake(320, 50);
            }

            UIWebView *webView=[[UIWebView alloc]initWithFrame:CGRectMake(0, 0, bannerSize.width, bannerSize.height)];
            _htmlString = html;

            if([skipOverlay isEqualToString:@"1"]) {

                wasUserAction = NO;

                webView.delegate = (id)self;
                webView.userInteractionEnabled = YES;

                UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleTapGesture:)];

                [webView addGestureRecognizer:tap];

                tap.delegate = self;


            } else {

                webView.delegate = nil;
                webView.userInteractionEnabled = NO;

            }
            webView.backgroundColor = [UIColor clearColor];
            webView.opaque = NO;
            webView.scrollView.scrollsToTop = false;

            self.bannerView = webView;
        }
        else if ([adType isEqualToString:@"mraidAd"])
        {

        }
        else if ([adType isEqualToString:@"noAd"])
        {
            //do nothing, there still can be custom events.
        }
        else if ([adType isEqualToString:@"error"])
        {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Unknown error" forKey:NSLocalizedDescriptionKey];

            NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorUnknown userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }
        else
        {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:[NSString stringWithFormat:@"Unknown ad type '%@'", adType] forKey:NSLocalizedDescriptionKey];

            NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorUnknown userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }

        [customEvents removeAllObjects];
        self.customEventBanner = nil;
/*
        if(headers)
        {
            for(NSString* key in headers) {
                if ([key hasPrefix:@"X-CustomEvent"]) {
                    @try {
                        NSString* jsonString = [headers objectForKey:key];
                        NSError *error;
                        NSDictionary *json =
                        [NSJSONSerialization JSONObjectWithData: [jsonString dataUsingEncoding:NSUTF8StringEncoding]
                                                        options: NSJSONReadingMutableContainers
                                                          error: &error];
                        if(error) {
                            continue;
                        }
                        MFCustomEvent *customEvent = [[MFCustomEvent alloc] init];
                        customEvent.className = [json objectForKey:@"class"];
                        customEvent.optionalParameter = [json objectForKey:@"parameter"];
                        customEvent.pixelUrl = [json objectForKey:@"pixel"];
                        [customEvents addObject:customEvent];
                    }
                    @catch (NSException *exception) {
                        NSLog(@"Error creating custom event");
                    }
                    
                }
            }
        }
        */
        normalBannerWasShownAfterCustomEventFail = NO;
        if (self.bannerView && [customEvents count] == 0)
        {
            [self showBannerView:self.bannerView withPreviousSubviews:previousSubviews];
        } else
        {
            [self loadCustomEventBanner];
            if(!normalBannerWasShownAfterCustomEventFail) {
                if (!_customEventBanner)
                {
                    [customEvents removeAllObjects];
                    if(self.bannerView)
                    {
                        [self showBannerView:self.bannerView withPreviousSubviews:previousSubviews];
                    }
                    else {
                        
                        NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"No inventory for ad request" forKey:NSLocalizedDescriptionKey];
                        
                        _refreshInterval = 15;
                        [self setRefreshTimerActive:YES];
                        
                        NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorInventoryUnavailable userInfo:userInfo];
                        [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
                        
                    }
                } else {
                    _refreshInterval = 30; //enable banner refresh for  custom events.
                    [self setRefreshTimerActive:YES];
                }
            }
        }
}

- (void)setupAdFromXml:(NSArray*)array
{
    NSLog(@"%@", array);
    MFDTXMLDocument *xml = [array objectAtIndex:0];
    NSDictionary *headers;
    if([array count] > 1) {
        headers = [array objectAtIndex:1];
    }
    
	if ([xml.documentRoot.name isEqualToString:@"error"])
	{
		NSString *errorMsg = xml.documentRoot.text;

		NSDictionary *userInfo = [NSDictionary dictionaryWithObject:errorMsg forKey:NSLocalizedDescriptionKey];

		NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorUnknown userInfo:userInfo];
		[self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
		return;
	}
    NSArray *previousSubviews = [NSArray arrayWithArray:self.subviews];

    MFDTXMLElement *htmlElement = [xml.documentRoot getNamedChild:@"htmlString"];
    self.skipOverlay = [htmlElement.attributes objectForKey:@"skipoverlaybutton"];

	NSString *clickType = [xml.documentRoot getNamedChild:@"clicktype"].text;
	if ([clickType isEqualToString:@"inapp"])
	{
		_tapThroughLeavesApp = NO;
	}
	else
	{
		_tapThroughLeavesApp = YES;
	}
	NSString *clickUrlString = [xml.documentRoot getNamedChild:@"clickurl"].text;
	if ([clickUrlString length])
	{
        clickUrlString = [clickUrlString stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];

		_tapThroughURL = [NSURL URLWithString:clickUrlString];
	}
	_shouldScaleWebView = [[xml.documentRoot getNamedChild:@"scale"].text isEqualToString:@"yes"];
	_shouldSkipLinkPreflight = [[xml.documentRoot getNamedChild:@"skippreflight"].text isEqualToString:@"yes"];
	self.bannerView = nil;
	adType = [xml.documentRoot.attributes objectForKey:@"type"];
	_refreshInterval = [[xml.documentRoot getNamedChild:@"refresh"].text intValue];
	[self setRefreshTimerActive:YES];
	if ([adType isEqualToString:@"imageAd"])
	{
		if (!__bannerImage)
		{
			NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error loading banner image" forKey:NSLocalizedDescriptionKey];
			NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorUnknown userInfo:userInfo];
			[self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
			return;
		}

		CGFloat bannerWidth = [[xml.documentRoot getNamedChild:@"bannerwidth"].text floatValue];
		CGFloat bannerHeight = [[xml.documentRoot getNamedChild:@"bannerheight"].text floatValue];

		UIButton *button=[UIButton buttonWithType:UIButtonTypeCustom];
		[button setFrame:CGRectMake(0, 0, bannerWidth, bannerHeight)];
		[button addTarget:self action:@selector(tapThrough:) forControlEvents:UIControlEventTouchUpInside];

		[button setImage:__bannerImage forState:UIControlStateNormal];
		button.center = CGPointMake(roundf(self.bounds.size.width / 2.0), roundf(self.bounds.size.height / 2.0));
		self.bannerView = button;
	}
	else if ([adType isEqualToString:@"textAd"])
	{
		NSString *html = [xml.documentRoot getNamedChild:@"htmlString"].text;

        CGSize bannerSize;
        if(adspaceHeight > 0 && adspaceWidth > 0)
        {
            bannerSize = CGSizeMake(adspaceWidth, adspaceHeight);
        }
		else if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPad)
		{
			bannerSize = CGSizeMake(728, 90);
		}
        else
        {
            bannerSize = CGSizeMake(320, 50);
        }

		UIWebView *webView=[[UIWebView alloc]initWithFrame:CGRectMake(0, 0, bannerSize.width, bannerSize.height)];
        
        //load HTML string later (to avoid calling impression pixels when using custom events)
        if(!headers) { //means that it's an interstitial ad
            _htmlString = [NSString stringWithFormat: @"<style>* { -webkit-tap-highlight-color: rgba(0,0,0,0);} body {height:100%%; width:100%%;} img {max-width:100%%; max-height:100%%; width:auto; height:auto; position: absolute; margin: auto; top: 0; left: 0; right: 0; bottom: 0;}</style>%@",html];
        } else {
            _htmlString = html;
        }
        

		if([skipOverlay isEqualToString:@"1"]) {

            wasUserAction = NO;
            
            webView.delegate = (id)self;
            webView.userInteractionEnabled = YES;
            
            UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleTapGesture:)];
            
            [webView addGestureRecognizer:tap];
            
            tap.delegate = self;
            
            
        } else {

            webView.delegate = nil;
            webView.userInteractionEnabled = NO;
            
//          add overlay later, only if no custom event is shown
        }
		webView.backgroundColor = [UIColor clearColor];
		webView.opaque = NO;
        webView.scrollView.scrollsToTop = false;

		self.bannerView = webView;
	}
    else if ([adType isEqualToString:@"mraidAd"])
	{
        _refreshInterval = 0;
        [self setRefreshTimerActive:NO];

        NSString *html = [xml.documentRoot getNamedChild:@"htmlString"].text;
        NSData  *_data = [html dataUsingEncoding:NSUTF8StringEncoding];

        if(!self.adapter) {
            self.adapter = [[MobFoxMRAIDBannerAdapter alloc] initWithDelegate:self];
        }
        
        CGSize size;
        if(adspaceHeight > 0 && adspaceWidth > 0)
        {
            size = CGSizeMake(adspaceWidth, adspaceHeight);
        }
        else if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPad)
		{
			size = CGSizeMake(728, 90);
		}
        else
        {
            size = CGSizeMake(320, 50);
        }
        
        
        MPAdConfigurationMF *mPAdConfiguration = [[MPAdConfigurationMF alloc] init];

        mPAdConfiguration.adResponseData = _data;
        mPAdConfiguration.preferredSize = size;
        mPAdConfiguration.adType = MPAdTypeBanner;

        [self.adapter getAdWithConfiguration:mPAdConfiguration containerSize:size];

        self.bannerView = self.adapter.adView;

    }   else if ([adType isEqualToString:@"noAd"])
	{
        //do nothing, there still can be custom events.
	}
	else if ([adType isEqualToString:@"error"])
	{
		NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Unknown error" forKey:NSLocalizedDescriptionKey];

		NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorUnknown userInfo:userInfo];
		[self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
		return;
	}
	else
	{
		NSDictionary *userInfo = [NSDictionary dictionaryWithObject:[NSString stringWithFormat:@"Unknown ad type '%@'", adType] forKey:NSLocalizedDescriptionKey];

		NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorUnknown userInfo:userInfo];
		[self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
		return;
	}

    [customEvents removeAllObjects];
    self.customEventBanner = nil;

    if(headers)
    {
        for(NSString* key in headers) {
            if ([key hasPrefix:@"X-CustomEvent"]) {
                @try {
                    NSString* jsonString = [headers objectForKey:key];
                    NSError *error;
                    NSDictionary *json =
                    [NSJSONSerialization JSONObjectWithData: [jsonString dataUsingEncoding:NSUTF8StringEncoding]
                                                options: NSJSONReadingMutableContainers
                                                  error: &error];
                    if(error) {
                        continue;
                    }
                    MFCustomEvent *customEvent = [[MFCustomEvent alloc] init];
                    customEvent.className = [json objectForKey:@"class"];
                    customEvent.optionalParameter = [json objectForKey:@"parameter"];
                    customEvent.pixelUrl = [json objectForKey:@"pixel"];
                    [customEvents addObject:customEvent];
                }
                @catch (NSException *exception) {
                    NSLog(@"Error creating custom event");
                }
                
            }
        }
        
    }
    
    normalBannerWasShownAfterCustomEventFail = NO;
	if (self.bannerView && [customEvents count] == 0)
	{
        [self showBannerView:self.bannerView withPreviousSubviews:previousSubviews];
	} else
    {
        [self loadCustomEventBanner];
        if(!normalBannerWasShownAfterCustomEventFail) {
            if (!_customEventBanner)
            {
                [customEvents removeAllObjects];
                if(self.bannerView)
                {
                    [self showBannerView:self.bannerView withPreviousSubviews:previousSubviews];
                }
                else {
                    
                    NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"No inventory for ad request" forKey:NSLocalizedDescriptionKey];
                
                    _refreshInterval = 15;
                    [self setRefreshTimerActive:YES];
                
                    NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorInventoryUnavailable userInfo:userInfo];
                    [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];

                }
            } else {
                _refreshInterval = 30; //enable banner refresh for  custom events.
                [self setRefreshTimerActive:YES];
            }
        }
    }
}

- (void)showBannerView:(UIView*)nextBannerView withPreviousSubviews:(NSArray*)previousSubviews
{
    if([adType isEqualToString:@"textAd"] && !_customEventBanner) {
        
        [(UIWebView*)nextBannerView loadHTMLString:_htmlString baseURL:nil];
        
        if(![skipOverlay isEqualToString:@"1"]) { //create overlay only if necessary, to not interfere with custom events
            UIImage *grayingImage = [self darkeningImageOfSize:self.bannerView.frame.size];
        
            UIButton *button=[UIButton buttonWithType:UIButtonTypeCustom];
            [button setFrame:self.bannerView.bounds];
            [button addTarget:self action:@selector(tapThrough:) forControlEvents:UIControlEventTouchUpInside];
            [button setImage:grayingImage forState:UIControlStateHighlighted];
            button.alpha = 0.47;
        
            button.center = CGPointMake(roundf(self.bounds.size.width / 2.0), roundf(self.bounds.size.height / 2.0));
            button.autoresizingMask = UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleBottomMargin;
        
            [self addSubview:button];
        }
    }
    
    nextBannerView.autoresizingMask = UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleBottomMargin;
    
    if (CGRectEqualToRect(self.bounds, CGRectZero))
    {
        self.bounds = nextBannerView.bounds;
    }
    
    if ([previousSubviews count])
    {
        [UIView beginAnimations:@"flip" context:nil];
        [UIView setAnimationDuration:1.5];
        if ([adType isEqualToString:@"mraidAd"])
        {
            [UIView setAnimationTransition:UIViewAnimationTransitionNone forView:self cache:NO];
        } else {
            [UIView setAnimationTransition:refreshAnimation forView:self cache:NO];
        }
    }
    
    nextBannerView.center = self.center;
    [self insertSubview:nextBannerView atIndex:0];
    [previousSubviews makeObjectsPerformSelector:@selector(removeFromSuperview)];
    
    if ([previousSubviews count]) {
        [UIView commitAnimations];
        
        [self performSelectorOnMainThread:@selector(reportRefresh) withObject:nil waitUntilDone:YES];
    } else {
        [self performSelectorOnMainThread:@selector(reportSuccess) withObject:nil waitUntilDone:YES];
    }
}

- (void)loadCustomEventBanner
{
    CGSize size;
    if(adspaceHeight > 0 && adspaceWidth > 0)
    {
        size = CGSizeMake(adspaceWidth, adspaceHeight);
    }
    else if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPad)
    {
        size = CGSizeMake(728, 90);
    }
    else
    {
        size = CGSizeMake(320, 50);
    }

    _customEventBanner = nil;
    while ([customEvents count] > 0)
    {
        @try
        {
            MFCustomEvent *event = [customEvents objectAtIndex:0];
            [customEvents removeObjectAtIndex:0];
            
            NSString* className = [NSString stringWithFormat:@"%@CustomEventBanner",event.className];
            Class customClass = NSClassFromString(className);
            if(customClass) {
                _customEventBanner = [[customClass alloc] init];
                _customEventBanner.delegate = self;
                [_customEventBanner loadBannerWithSize:size optionalParameters:event.optionalParameter trackingPixel:event.pixelUrl];
                break;
            } else {
                NSLog(@"custom event for %@ not implemented!",event.className);
            }
        }
        @catch (NSException *exception) {
            _customEventBanner = nil;
            NSLog( @"Exception while creating custom event!" );
            NSLog( @"Name: %@", exception.name);
            NSLog( @"Reason: %@", exception.reason );
        }
        
    }
}

- (void)asyncRequestAdWithParams:(NSDictionary *)dict
{
    NSUUID *appkey = [dict valueForKey:@"appkey"];
    NSNumber * adspaceId = [dict valueForKey:@"adspaceId"];

    @autoreleasepool
    {

        int r = arc4random_uniform(50000);
        NSString *random = [NSString stringWithFormat:@"%d", r];

        NSString *adStrict;
        if (adspaceStrict)
        {
            adStrict = @"1";
        }
        else
        {
            adStrict = @"0";
        }

        NSString *model = [UIDevice currentDevice].model;
        NSString *osVersion = [UIDevice currentDevice].systemVersion;

        NSString *devicetype;
        if ([model containsString:@"iPhone"]){
            devicetype = @"4";
        }else if([model containsString:@"iPad"]){
            devicetype = @"5";
        } else{
            devicetype = @"6";
        }


        NSUUID *iosadvid = [[ASIdentifierManager sharedManager] advertisingIdentifier];
        NSString *iosadDontTrack =  ([ASIdentifierManager sharedManager].advertisingTrackingEnabled)?@"1":@"0";

        NSString *language = [[NSLocale preferredLanguages] objectAtIndex:0];
        NSMutableDictionary *reqDict = [NSMutableDictionary dictionaryWithObjectsAndKeys:@"banner", @"type" ,
                                        @"Apple", @"make",
                                       [iosadvid UUIDString], @"ifa",
                                       [[iosadvid UUIDString] sha1], @"dpidsha1",
                                        iosadDontTrack, @"dnt",
                                        model, @"model",
                                        devicetype, @"devicetype",
                                        self.userAgent, @"ua",
                                        [appkey UUIDString], @"appkey",
                                        [adspaceId stringValue], @"adspaceid",
                                        osVersion, @"osv",
                                        language, @"lang",
                                        random, @"rand",
                                        SDK_VERSION, @"sdkversion",
                                        [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleIdentifier" ], @"bundleidentifier",

                                        nil];

        if(self.userProvidedLatitude && self.userProvidedLongitude)
        {
            NSString *latitudeString = [NSString stringWithFormat:@"%+.6f", self.userProvidedLatitude];
            NSString *longitudeString = [NSString stringWithFormat:@"%+.6f", self.userProvidedLongitude];

            [reqDict setValue:latitudeString forKey:@"latitude"];
            [reqDict setValue:longitudeString forKey:@"longitude"];


            if (self.fetchLatitude && self.fetchLongitude)
            {
                NSString *fetchLatitudeString = [NSString stringWithFormat:@"%+.6f", self.fetchLatitude];
                NSString *fetchLongitudeString = [NSString stringWithFormat:@"%+.6f", self.fetchLongitude];

                [reqDict setValue:fetchLatitudeString forKey:@"fetch_latitude"];
                [reqDict setValue:fetchLongitudeString forKey:@"fetch_longitude"];
            }
        }

        NSString *fullRequestString;
        /*
        fullRequestString = requestStringWithLocation;


        if([userGender isEqualToString:@"female"]) {
            fullRequestString = [NSString stringWithFormat:@"%@&demo_gender=f",
                                 fullRequestString];
        } else if([userGender isEqualToString:@"male"]) {
            fullRequestString = [NSString stringWithFormat:@"%@&demo_gender=m",
                                 fullRequestString];
        }
        if(userAge) {
            NSString *age = [NSString stringWithFormat:@"%d",(int)userAge];
            fullRequestString = [NSString stringWithFormat:@"%@&demo_age=%@",
                                 fullRequestString,
                                 [age stringByUrlEncoding]];
        }
        if(keywords) {
            NSString *words = [keywords componentsJoinedByString:@","];
            fullRequestString = [NSString stringWithFormat:@"%@&demo_keywords=%@",
                                 fullRequestString,
                                 words];

        }*/

        NSDictionary *devIps = [self getIPAddresses];
        __block NSString* devIPsString = @"";
        [devIps enumerateKeysAndObjectsUsingBlock:^(NSString* key, NSString* obj, BOOL * _Nonnull stop) {
            devIPsString = [NSString stringWithFormat:@"%@|%@", obj , devIPsString ];
        }];

        [reqDict setValue:fullRequestString forKey:@"devips"];

        NSURL *serverURL = [self serverURL];

        if (!serverURL) {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error - no or invalid requestURL. Please set requestURL" forKey:NSLocalizedDescriptionKey];

            NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorUnknown userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }

        fullRequestString = [reqDict asURLStringWithEncoding:TRUE];

        NSURL *url;
        url = [NSURL URLWithString:[NSString stringWithFormat:@"%@?%@", serverURL, fullRequestString]];
        NSLog(@"full url = %@", url);

        NSMutableURLRequest *request;
        NSError *error;
        NSURLResponse *response;
        NSData *dataReply;

        request = [NSMutableURLRequest requestWithURL:url];
        [request setHTTPMethod: @"GET"];
        [request setValue:@"text/xml" forHTTPHeaderField:@"Accept"];
        [request setValue:self.userAgent forHTTPHeaderField:@"User-Agent"];

        NSDictionary *headers = [NSDictionary dictionary];
        dataReply = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
        if ([response respondsToSelector:@selector(allHeaderFields)]) {
            headers = [(NSHTTPURLResponse *)response allHeaderFields];
        }


        MFDTXMLDocument *xml = [MFDTXMLDocument documentWithData:dataReply];

        if (!xml)
        {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error parsing xml response from server" forKey:NSLocalizedDescriptionKey];

            NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorUnknown userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }

        NSString *bannerUrlString = [xml.documentRoot getNamedChild:@"imageurl"].text;
        __bannerImage = nil;
        if ([bannerUrlString length])
        {
            NSURL *bannerUrl = [NSURL URLWithString:bannerUrlString];
            __bannerImage = [[UIImage alloc]initWithData:[NSData dataWithContentsOfURL:bannerUrl]];
        }

        // @[xml, headers]
        NSDictionary * dict = [NSDictionary dictionaryWithObjectsAndKeys:xml, @"xml", headers, @"headers", adspaceId, @"adspaceId",  nil];

        
        [self performSelectorOnMainThread:@selector(setupAdFromXmlWithDictionary:) withObject:dict waitUntilDone:YES];
        
    }
}

- (void)asyncRequestAdWithPublisherId:(NSString *)publisherId
{
	@autoreleasepool
	{
        NSString *mRaidCapable = @"0";
        
        NSString *adWidth = [NSString stringWithFormat:@"%d",(int)adspaceWidth];
        NSString *adHeight = [NSString stringWithFormat:@"%d",(int)adspaceHeight];
        
        int r = arc4random_uniform(50000);
        NSString *random = [NSString stringWithFormat:@"%d", r];
        
        NSString *adStrict;
        if (adspaceStrict)
        {
            adStrict = @"1";
        }
        else
        {
            adStrict = @"0";
        }
        
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
            
            requestString=[NSString stringWithFormat:@"c_mraid=%@&c_customevents=1&r_type=banner&o_iosadvidlimit=%@&rt=%@&u=%@&u_wv=%@&u_br=%@&o_iosadvid=%@&v=%@&s=%@&iphone_osversion=%@&spot_id=%@&r_random=%@",
						   [mRaidCapable stringByUrlEncoding],
						   [o_iosadvidlimit stringByUrlEncoding],
						   [requestType stringByUrlEncoding],
						   [self.userAgent stringByUrlEncoding],
						   [self.userAgent stringByUrlEncoding],
						   [[self browserAgentString] stringByUrlEncoding],
						   [iosadvid stringByUrlEncoding],
						   [SDK_VERSION stringByUrlEncoding],
						   [publisherId stringByUrlEncoding],
						   [osVersion stringByUrlEncoding],
						   [advertisingSection?advertisingSection:@"" stringByUrlEncoding],
                           [random stringByUrlEncoding]];
            
        } else {
			requestString=[NSString stringWithFormat:@"c_mraid=%@&c_customevents=1&r_type=banner&rt=%@&u=%@&u_wv=%@&u_br=%@&v=%@&s=%@&iphone_osversion=%@&spot_id=%@&r_random=%@",
                           [mRaidCapable stringByUrlEncoding],
                           [requestType stringByUrlEncoding],
                           [self.userAgent stringByUrlEncoding],
                           [self.userAgent stringByUrlEncoding],
                           [[self browserAgentString] stringByUrlEncoding],
                           [SDK_VERSION stringByUrlEncoding],
                           [publisherId stringByUrlEncoding],
                           [osVersion stringByUrlEncoding],
                           [advertisingSection?advertisingSection:@"" stringByUrlEncoding],
                           [random stringByUrlEncoding]];

        }
#else

        requestString=[NSString stringWithFormat:@"c_mraid=%@&c_customevents=1&r_type=banner&rt=%@&u=%@&u_wv=%@&u_br=%@&v=%@&s=%@&iphone_osversion=%@&spot_id=%@&r_random=%@",
                       [mRaidCapable stringByUrlEncoding],
                       [requestType stringByUrlEncoding],
                       [self.userAgent stringByUrlEncoding],
                       [self.userAgent stringByUrlEncoding],
                       [[self browserAgentString] stringByUrlEncoding],
                       [SDK_VERSION stringByUrlEncoding],
                       [publisherId stringByUrlEncoding],
                       [osVersion stringByUrlEncoding],
                       [advertisingSection?advertisingSection:@"" stringByUrlEncoding],
                       [random stringByUrlEncoding]];

#endif
        NSString *requestStringWithLocation;
        if(locationAwareAdverts && self.userProvidedLatitude && self.userProvidedLongitude)
        {
            NSString *latitudeString = [NSString stringWithFormat:@"%+.6f", self.userProvidedLatitude];
            NSString *longitudeString = [NSString stringWithFormat:@"%+.6f", self.userProvidedLongitude];
            
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
        if(adspaceHeight > 0 && adspaceWidth > 0)
        {
            fullRequestString = [NSString stringWithFormat:@"%@&adspace_width=%@&adspace_height=%@&adspace_strict=%@",
                                requestStringWithLocation,
                                [adWidth stringByUrlEncoding],
                                [adHeight stringByUrlEncoding],
                                [adStrict stringByUrlEncoding]
                                ];
        }
        else
        {
            fullRequestString = requestStringWithLocation;
        }
        
        if([userGender isEqualToString:@"female"]) {
            fullRequestString = [NSString stringWithFormat:@"%@&demo_gender=f",
                                 fullRequestString];
        } else if([userGender isEqualToString:@"male"]) {
            fullRequestString = [NSString stringWithFormat:@"%@&demo_gender=m",
                                 fullRequestString];
        }
        if(userAge) {
            NSString *age = [NSString stringWithFormat:@"%d",(int)userAge];
            fullRequestString = [NSString stringWithFormat:@"%@&demo_age=%@",
                                 fullRequestString,
                                 [age stringByUrlEncoding]];
        }
        if(keywords) {
            NSString *words = [keywords componentsJoinedByString:@","];
            fullRequestString = [NSString stringWithFormat:@"%@&demo_keywords=%@",
                                 fullRequestString,
                                 words];
            
        }
        
        NSURL *serverURL = [self serverURL];

        if (!serverURL) {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error - no or invalid requestURL. Please set requestURL" forKey:NSLocalizedDescriptionKey];

            NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorUnknown userInfo:userInfo];
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
        
        NSDictionary *headers = [NSDictionary dictionary];
        dataReply = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
        if ([response respondsToSelector:@selector(allHeaderFields)]) {
            headers = [(NSHTTPURLResponse *)response allHeaderFields];
        }
        
        MFDTXMLDocument *xml = [MFDTXMLDocument documentWithData:dataReply];

        if (!xml)
        {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error parsing xml response from server" forKey:NSLocalizedDescriptionKey];

            NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorUnknown userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }
        
        NSString *bannerUrlString = [xml.documentRoot getNamedChild:@"imageurl"].text;
        __bannerImage = nil;
        if ([bannerUrlString length])
        {
            NSURL *bannerUrl = [NSURL URLWithString:bannerUrlString];
            __bannerImage = [[UIImage alloc]initWithData:[NSData dataWithContentsOfURL:bannerUrl]];
        }
        
        [self performSelectorOnMainThread:@selector(setupAdFromXml:) withObject:@[xml, headers] waitUntilDone:YES];

	}

}

- (bool)setLocationWithLatitude:(CGFloat)latitude longitude:(CGFloat)longitude {

    // if user provide location - we trying to determine real one
    id val = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationWhenInUseUsageDescription"];

    if (val &&  [val isKindOfClass:[NSString class]] && ((NSString*)val).length > 0 ){
        NSLog(@"Key exists");
        if ([CLLocationManager locationServicesEnabled] && ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusAuthorizedAlways || [CLLocationManager authorizationStatus] == kCLAuthorizationStatusAuthorizedWhenInUse))
        {
            NSLog(@"Enable");
            [self CurrentLocationIdentifier];
        }else
        {
            NSLog(@"NOT Enable");
        }

    }else{
        NSLog(@"Key NOT exists");
    }

    if ((latitude >= -90.0 && latitude <= 90.0)
        && (longitude >= -180.0 && longitude <= 180.0))
    {
        self.userProvidedLatitude = latitude;
        self.userProvidedLongitude = longitude;

        return TRUE;

    }else{
        NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Wrong latitude or longitude value has been provided" forKey:NSLocalizedDescriptionKey];
        NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorWrongInput userInfo:userInfo];
        [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
        return FALSE;
    }
}

- (void)showErrorLabelWithText:(NSString *)text
{
	UILabel *label = [[UILabel alloc] initWithFrame:self.bounds];
	label.numberOfLines = 0;
	label.backgroundColor = [UIColor whiteColor];
	label.font = [UIFont boldSystemFontOfSize:12];
	label.textAlignment = UITextAlignmentCenter;
	label.textColor = [UIColor redColor];
	label.text = text;
	[self addSubview:label];
}



- (void)requestAdByTimer:(NSTimer *)timer{
    [self requestAd: adspaceID];
}



- (BOOL)requestAd:(NSNumber*) adspaceId{

    if (!delegate)
    {
        [self showErrorLabelWithText:@"Delegate not setup"];
        return FALSE;
    }
    if (![delegate respondsToSelector:@selector(appKeyForBizzclickHTMLBanner:)])
    {
        [self showErrorLabelWithText:@"Delegate does not implement appKeyForBizzclickHTMLBanner"];

        return FALSE;
    }

    if ([adspaceId intValue]  <= 0)
    {
        [self showErrorLabelWithText:@"Wrong 'adspaceId' provided"];
        return FALSE;
    }

    adspaceID = adspaceId;

    NSUUID *appkey = [delegate appKeyForBizzclickHTMLBanner:self];
    NSDictionary* dict = [NSDictionary dictionaryWithObjectsAndKeys:appkey ,@"appkey", adspaceId, @"adspaceId", nil];

    [self performSelectorInBackground:@selector(asyncRequestAdWithParams:) withObject:dict];

    return TRUE;
}
/*
- (void)requestAd
{
    
    if (!delegate)
	{
		[self showErrorLabelWithText:@"MobFoxHTMLBannerViewDelegate not set"];
		return;
	}
	if (![delegate respondsToSelector:@selector(publisherIdForMobFoxHTMLBannerView:)])
	{
		[self showErrorLabelWithText:@"MobFoxHTMLBannerViewDelegate does not implement publisherIdForMobFoxHTMLBannerView:"];

		return;
	}
	NSString *publisherId = [delegate publisherIdForMobFoxHTMLBannerView:self];
	if (![publisherId length])
	{
		[self showErrorLabelWithText:@"MobFoxHTMLBannerViewDelegate returned invalid publisher ID."];

        NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Invalid publisher ID or Publisher ID not set" forKey:NSLocalizedDescriptionKey];

        NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorUnknown userInfo:userInfo];
        [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
		return;
	}
    if(adspaceWidth < 1 || adspaceHeight < 1) {
        NSLog(@"For improved ad serving, it is highly recommended to set the adspace size.");
    }
    
    [self performSelectorInBackground:@selector(asyncRequestAdWithPublisherId:) withObject:publisherId];
	
}
*/

#pragma mark Interaction

- (void)checker:(MFRedirectChecker *)checker detectedRedirectionTo:(NSURL *)redirectURL
{
	if ([redirectURL isDeviceSupported])
	{
		[[UIApplication sharedApplication] openURL:redirectURL];
		return;
	}
	UIViewController *viewController = [self firstAvailableUIViewController];
	MobFoxAdBrowserViewController *browser = [[MobFoxAdBrowserViewController alloc] initWithUrl:redirectURL];
	browser.delegate = (id)self;
	browser.userAgent = self.userAgent;
	browser.webView.scalesPageToFit = _shouldScaleWebView;
	[self hideStatusBar];
    if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewActionWillPresent:)])
    {
        [delegate bizzclickHTMLBannerViewActionWillPresent:self];
    }
    [viewController presentViewController:browser animated:YES completion:nil];
	bannerViewActionInProgress = YES;
}

- (void)checker:(MFRedirectChecker *)checker didFinishWithData:(NSData *)data
{
	UIViewController *viewController = [self firstAvailableUIViewController];
	MobFoxAdBrowserViewController *browser = [[MobFoxAdBrowserViewController alloc] initWithUrl:nil];
	browser.delegate = (id)self;
	browser.userAgent = self.userAgent;
	browser.webView.scalesPageToFit = _shouldScaleWebView;
	NSString *scheme = [_tapThroughURL scheme];
	NSString *host = [_tapThroughURL host];
	NSString *path = [[_tapThroughURL path] stringByDeletingLastPathComponent];
	NSURL *baseURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@://%@%@/", scheme, host, path]];
	[browser.webView loadData:data MIMEType:checker.mimeType textEncodingName:checker.textEncodingName baseURL:baseURL];
	[self hideStatusBar];
    if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewActionWillPresent:)])
    {
        [delegate bizzclickHTMLBannerViewActionWillPresent:self];
    }
    [viewController presentViewController:browser animated:YES completion:nil ];
	bannerViewActionInProgress = YES;
}

- (void)checker:(MFRedirectChecker *)checker didFailWithError:(NSError *)error
{
	bannerViewActionInProgress = NO;
}

- (void)tapThrough:(id)sender
{
	if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewActionShouldBegin:willLeaveApplication:)])
	{
		BOOL allowAd = [delegate bizzclickHTMLBannerViewActionShouldBegin:self willLeaveApplication:_tapThroughLeavesApp];

		if (!allowAd)
		{
			return;
		}
	}
	if (_tapThroughLeavesApp || [_tapThroughURL isDeviceSupported])
	{

        if ([delegate respondsToSelector:@selector(mobfoxHTMLBannerViewActionWillLeaveApplication:)])
        {
            [delegate bizzclickHTMLBannerViewActionWillLeaveApplication:self];
        }

        [[UIApplication sharedApplication]openURL:_tapThroughURL];
		return;
	}
	UIViewController *viewController = [self firstAvailableUIViewController];
	if (!viewController)
	{
		return;
	}
	[self setRefreshTimerActive:NO];
	if (!_shouldSkipLinkPreflight)
	{
		redirectChecker = [[MFRedirectChecker alloc] initWithURL:_tapThroughURL userAgent:self.userAgent delegate:(id)self];
		return;
	}
	MobFoxAdBrowserViewController *browser = [[MobFoxAdBrowserViewController alloc] initWithUrl:_tapThroughURL];
	browser.delegate = (id)self;
	browser.userAgent = self.userAgent;
	browser.webView.scalesPageToFit = _shouldScaleWebView;
	[self hideStatusBar];
    if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewActionWillPresent:)])
    {
        [delegate bizzclickHTMLBannerViewActionWillPresent:self];
    }
    [viewController presentViewController:browser animated:YES completion:nil];
	bannerViewActionInProgress = YES;
}

- (void)handleTapGesture:(UITapGestureRecognizer *)gestureRecognizer
{
    // this is called after gestureRecognizer:shouldRecognizeSimultaneouslyWithGestureRecognizer: so we can safely remove the delegate here
    if (gestureRecognizer.delegate) {
        gestureRecognizer.delegate = nil;
    }
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
    wasUserAction = YES; //countermeasure for malicious, "auto-clicking" banners
    return YES;
}

- (void)mobfoxAdBrowserControllerDidDismiss:(MobFoxAdBrowserViewController *)mobfoxAdBrowserController
{
    if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewActionWillFinish:)])
	{
		[delegate bizzclickHTMLBannerViewActionWillFinish:self];
	}
    [self showStatusBarIfNecessary];
    [mobfoxAdBrowserController dismissViewControllerAnimated:YES completion:nil];
	bannerViewActionInProgress = NO;
	[self setRefreshTimerActive:YES];
	if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewActionDidFinish:)])
	{
		[delegate bizzclickHTMLBannerViewActionDidFinish:self];
	}
}

#pragma mark WebView Delegate (Text Ads)

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{

    NSURL *url = [request URL];
    NSString *urlString = [url absoluteString];
    if (navigationType == UIWebViewNavigationTypeLinkClicked)
	{
        if (![urlString isEqualToString:@"about:blank"] && ![urlString isEqualToString:@""] && wasUserAction) {
            if(_tapThroughURL) {
                NSMutableURLRequest *request2 = [[NSMutableURLRequest alloc] initWithURL:_tapThroughURL];
                [request2 setHTTPMethod: @"GET"];
                [NSURLConnection sendAsynchronousRequest:request2 queue:[[NSOperationQueue alloc] init] completionHandler:nil];
            }
            _tapThroughURL = url;
            [self tapThrough:nil];
            return NO;
        } else {
            return YES;
        }

	}
    else if(navigationType == UIWebViewNavigationTypeOther)
    {
        NSString* documentURL = [[request mainDocumentURL] absoluteString];
        
        if( [urlString isEqualToString:documentURL]) {             //if they are the same this is a javascript href click
            if (![urlString isEqualToString:@"about:blank"] && ![urlString isEqualToString:@""] && wasUserAction) {
                if(_tapThroughURL) {
                    NSMutableURLRequest *request2 = [[NSMutableURLRequest alloc] initWithURL:_tapThroughURL];
                    [request2 setHTTPMethod: @"GET"];
                    [NSURLConnection sendAsynchronousRequest:request2 queue:[[NSOperationQueue alloc] init] completionHandler:nil];
                }
                _tapThroughURL = url;
                [self tapThrough:nil];
                return NO;
            }
        }
    }
    
    return YES;
}

#pragma mark -
#pragma mark MPBannerAdapterDelegate
- (MPAdViewMF *)banner{
    return (MPAdViewMF *)self;
}

- (id<MPAdViewDelegateMF>)bannerDelegate{
    return nil;
}

- (CLLocation *)location{
    return nil;
}

- (void)adapter:(MPBaseBannerAdapterMF *)adapter didFinishLoadingAd:(UIView *)ad
{
}

- (void)adapter:(MPBaseBannerAdapterMF *)adapter didFailToLoadAdWithError:(NSError *)error
{
}

- (void)userActionWillBeginForAdapter:(MPBaseBannerAdapterMF *)adapter
{
    if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewActionWillPresent:)])
    {
        [delegate bizzclickHTMLBannerViewActionWillPresent:self];
    }
}

- (void)userActionDidFinishForAdapter:(MPBaseBannerAdapterMF *)adapter
{
    if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewActionDidFinish:)])
	{
		[delegate bizzclickHTMLBannerViewActionDidFinish:self];
	}
}

- (void)userWillLeaveApplicationFromAdapter:(MPBaseBannerAdapterMF *)adapter
{
    if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewActionWillLeaveApplication:)])
    {
        [delegate bizzclickHTMLBannerViewActionWillLeaveApplication:self];
    }
}

- (MPNativeAdOrientation)allowedNativeAdsOrientation
{
	return NO;
}

- (void)pauseAutorefresh
{
}

- (void)resumeAutorefreshIfEnabled
{
}

#pragma mark CustomEventBannerDelegate

- (void)customEventBannerDidLoadAd:(UIView *)ad {
    NSArray *previousSubviews = [NSArray arrayWithArray:self.subviews];
    [self showBannerView:ad withPreviousSubviews:previousSubviews];
}

- (void)customEventBannerDidFailToLoadAd
{
    [self loadCustomEventBanner];
    NSArray *previousSubviews = [NSArray arrayWithArray:self.subviews];
    if (_customEventBanner)
    {
        return;
    }
    else if (self.bannerView)
    {
        normalBannerWasShownAfterCustomEventFail = YES;
        [self showBannerView:self.bannerView withPreviousSubviews:previousSubviews];
    }
    else
    {
        NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"No inventory for ad request" forKey:NSLocalizedDescriptionKey];
        
        _refreshInterval = 15;
        [self setRefreshTimerActive:YES];
        
        NSError *error = [NSError errorWithDomain:ErrorDomain code:BizzClickErrorInventoryUnavailable userInfo:userInfo];
        [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
    }
}

- (void)customEventBannerWillExpand
{
    if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewActionWillPresent:)])
	{
		[delegate bizzclickHTMLBannerViewActionWillPresent:self];
	}
}

- (void)customEventBannerWillClose
{
    if ([delegate respondsToSelector:@selector(bizzclickHTMLBannerViewActionWillFinish:)])
	{
		[delegate bizzclickHTMLBannerViewActionWillFinish:self];
	}
}

#pragma mark Notifications
- (void) appDidBecomeActive:(NSNotification *)notification
{
	[self setRefreshTimerActive:YES];
}

- (void) appWillResignActive:(NSNotification *)notification
{
	[self setRefreshTimerActive:NO];
}

-(void)setAdspaceHeight:(NSInteger)height {
    if(height > 0) {
        adspaceHeight = height;
    } else {
        NSLog(@"Adspace height must be greater than 0! Ignoring value: %li", (long)height);
    }
}

-(void)setAdspaceWidth:(NSInteger)width {
    if(width > 0) {
        adspaceWidth = width;
    } else {
        NSLog(@"Adspace width must be greater than 0! Ignoring value: %li", (long)width);
    }
}

@synthesize delegate;
@synthesize advertisingSection;
@synthesize bannerLoaded;
@synthesize bannerViewActionInProgress;
@synthesize refreshAnimation;
@synthesize refreshTimerOff;
@synthesize requestURL;
@synthesize userAgent;
@synthesize skipOverlay;
@synthesize adType;
@synthesize adapter;
@synthesize adspaceHeight;
@synthesize adspaceWidth;
@synthesize adspaceStrict;
@synthesize locationAwareAdverts;
@synthesize userGender,userAge,keywords;
@synthesize locationManager;




@end

