//
//  MobFoxNativeAdController.m
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 21.05.2014.
//
//

#import "MobFoxNativeAdController.h"
#import "NSString+MobFox.h"
#import "NSURL+MobFox.h"
#import "UIDevice+IdentifierAddition.h"
#import <AdSupport/AdSupport.h>
#import "NativeAd.h"
#import <UIKit/UIKit.h>


NSString * const MobFoxNativeAdErrorDomain = @"MobFoxNativeAd";

@interface MobFoxNativeAdController () {
    
}


@property (nonatomic, strong) NSString *userAgent;
@property (nonatomic, strong) NSMutableDictionary *browserUserAgentDict;
@property (nonatomic, assign) CGFloat currentLatitude;
@property (nonatomic, assign) CGFloat currentLongitude;

@end



@implementation MobFoxNativeAdController


- (void) setup
{
    UIWebView* webView = [[UIWebView alloc] initWithFrame:CGRectZero];
    self.userAgent = [webView stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];
    [self setUpBrowserUserAgentStrings];
}

- (id)init
{
    self = [super init];
    [self setup];
    return self;
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

- (void)requestAd
{
    
    if (!delegate)
	{
		return;
	}
	if (![delegate respondsToSelector:@selector(publisherIdForMobFoxNativeAdController:)])
	{
		return;
	}
	NSString *publisherId = [delegate publisherIdForMobFoxNativeAdController:self];
	if (![publisherId length])
	{

        NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Invalid publsher ID supplied" forKey:NSLocalizedDescriptionKey];
        NSError *error = [NSError errorWithDomain:MobFoxNativeAdErrorDomain code:0 userInfo:userInfo];
        [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
        
		return;
	}
	[self performSelectorInBackground:@selector(asyncRequestAdWithPublisherId:) withObject:publisherId];
}

- (void)asyncRequestAdWithPublisherId:(NSString *)publisherId
{
	@autoreleasepool
	{
        NSString *osVersion = [UIDevice currentDevice].systemVersion;
        
        NSString *requestString;
        NSString *adTypesString = [adTypes componentsJoinedByString:@","];
        
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_6_0
        NSString *iosadvid;
        if ([ASIdentifierManager instancesRespondToSelector:@selector(advertisingIdentifier )]) {
            iosadvid = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];

            requestString=[NSString stringWithFormat:@"r_type=native&r_resp=json&n_img=icon,main&n_txt=headline,description,cta,advertiser,rating&n_type=%@&u=%@&u_wv=%@&u_br=%@&o_iosadvid=%@&v=%@&s=%@&iphone_osversion=%@",
                           [adTypesString stringByUrlEncoding],
						   [self.userAgent stringByUrlEncoding],
						   [self.userAgent stringByUrlEncoding],
						   [[self browserAgentString] stringByUrlEncoding],
						   [iosadvid stringByUrlEncoding],
						   [SDK_VERSION stringByUrlEncoding],
						   [publisherId stringByUrlEncoding],
						   [osVersion stringByUrlEncoding]];
            
        } else {
            requestString=[NSString stringWithFormat:@"r_type=native&r_resp=json&n_img=icon,main&n_txt=headline,description,cta,advertiser,rating&n_type=%@&u=%@&u_wv=%@&u_br=%@&&v=%@&s=%@&iphone_osversion=%@",
                           [adTypesString stringByUrlEncoding],
						   [self.userAgent stringByUrlEncoding],
						   [self.userAgent stringByUrlEncoding],
						   [[self browserAgentString] stringByUrlEncoding],
						   [SDK_VERSION stringByUrlEncoding],
						   [publisherId stringByUrlEncoding],
						   [osVersion stringByUrlEncoding]];
			
            
        }
#else
        
        requestString=[NSString stringWithFormat:@"r_type=native&r_resp=json&n_img=icon,main&n_txt=headline,description,cta,advertiser,rating&n_type=%@&u=%@&u_wv=%@&u_br=%@&&v=%@&s=%@&iphone_osversion=%@",
                       [adTypesString stringByUrlEncoding],
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
        
        
        if([userGender isEqualToString:@"female"]) {
            requestStringWithLocation = [NSString stringWithFormat:@"%@&demo.gender=f",
                                 requestStringWithLocation];
        } else if([userGender isEqualToString:@"male"]) {
            requestStringWithLocation = [NSString stringWithFormat:@"%@&demo.gender=m",
                                 requestStringWithLocation];
        }
        if(userAge) {
            NSString *age = [NSString stringWithFormat:@"%d",(int)userAge];
            requestStringWithLocation = [NSString stringWithFormat:@"%@&demo.age=%@",
                                 requestStringWithLocation,
                                 [age stringByUrlEncoding]];
        }
        if(keywords) {
            NSString *words = [keywords componentsJoinedByString:@","];
            requestStringWithLocation = [NSString stringWithFormat:@"%@&demo.keywords=%@",
                                 requestStringWithLocation,
                                 words];
            
        }
        
        NSURL *serverURL = [self serverURL];
        
        if (!serverURL) {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error - no or invalid requestURL. Please set requestURL" forKey:NSLocalizedDescriptionKey];
            
            NSError *error = [NSError errorWithDomain:MobFoxNativeAdErrorDomain code:0 userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }
        
        NSURL *url;
        url = [NSURL URLWithString:[NSString stringWithFormat:@"%@?%@", serverURL, requestStringWithLocation]];
        
        
        NSMutableURLRequest *request;
        NSError *error;
        NSURLResponse *response;
        NSData *dataReply;
        
        request = [NSMutableURLRequest requestWithURL:url];
        [request setHTTPMethod: @"GET"];
//        [request setValue:@"text/xml" forHTTPHeaderField:@"Accept"];
        [request setValue:self.userAgent forHTTPHeaderField:@"User-Agent"];
        
        dataReply = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
        
        NSError *localError = nil;
        NSDictionary *json = [NSJSONSerialization JSONObjectWithData:dataReply options:0 error:&localError];
        
        if (!json || error)
        {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error parsing JSON response from server" forKey:NSLocalizedDescriptionKey];
            
            NSError *error = [NSError errorWithDomain:MobFoxNativeAdErrorDomain code:0 userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }
        
        [self performSelectorOnMainThread:@selector(setupAdFromJson:) withObject:json waitUntilDone:YES];
        
	}
    
}

- (void)setupAdFromJson:(NSDictionary *)json
{
    NativeAd *ad = [[NativeAd alloc]init];
    ad.clickUrl = json[@"click_url"];
    
    NSDictionary* imageAssets = json[@"imageassets"];
    NSEnumerator* imageAssetEnumerator = [imageAssets keyEnumerator];
    NSString* key;
    while (key = [imageAssetEnumerator nextObject]) {
        ImageAsset* asset = [[ImageAsset alloc]init];
        NSDictionary* assetObject = imageAssets[key];
        asset.url = assetObject[@"url"];
        asset.width =  assetObject[@"width"];
        asset.height = assetObject[@"height"];
        [ad.imageAssets setObject:asset forKey:key];
    }
    
    NSDictionary* textAssets = json[@"textassets"];
    NSEnumerator* textAssetEnumerator = [textAssets keyEnumerator];
    while (key = [textAssetEnumerator nextObject]) {
        NSString* url = textAssets[key];
        [ad.textAssets setObject:url forKey:key];
    }
    
    NSArray* trackersArray = json[@"trackers"];
    for (NSDictionary* trackerObject in trackersArray){
        Tracker* tracker = [[Tracker alloc]init];
        tracker.type = trackerObject[@"type"];
        tracker.url = trackerObject[@"url"];
        [ad.trackers addObject:tracker];
    }

    [self performSelectorOnMainThread:@selector(reportSuccess:) withObject:ad waitUntilDone:YES];
}

-(UIView *)getNativeAdViewForResponse:(NativeAd *)response xibName:(NSString *)name {
    
    NSArray *nibObjects = [[NSBundle mainBundle] loadNibNamed:name owner:nil options:nil];
    UIView* mainView = nibObjects[0];
    for (UIView *child in mainView.subviews) {
        NSString* assetName = [child valueForKey:@"MobFoxTextAsset"];
        if(assetName && [child isKindOfClass:[UILabel class]]) {
            NSString* text = [response.textAssets objectForKey:assetName];
            ((UILabel*)child).text = text;
        }
     
        //rating?
    }
    
    
    return mainView;

}

- (void)reportError:(NSError *)error
{
	if ([delegate respondsToSelector:@selector(nativeAdFailedToLoadWithError:)])
    {
        [delegate nativeAdFailedToLoadWithError:error];
    }
}

- (void)reportSuccess:(NativeAd *)ad
{
	if ([delegate respondsToSelector:@selector(mobfoxBannerViewDidLoadMobFoxAd:)])
	{
		[delegate nativeAdDidLoad:ad];
	}
}


- (void)setLocationWithLatitude:(CGFloat)latitude longitude:(CGFloat)longitude {
    self.currentLatitude = latitude;
    self.currentLongitude = longitude;
}

- (NSURL *)serverURL
{
	return [NSURL URLWithString:self.requestURL];
}



@synthesize delegate;
@synthesize requestURL;
@synthesize locationAwareAdverts;
@synthesize userAge, userGender, keywords;
@synthesize adTypes;

@end
