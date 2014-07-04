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
#import "CustomEvent.h"
#import "CustomEventNative.h"
#import <UIKit/UIKit.h>
#import "MobFoxNativeTrackingView.h"


NSString * const MobFoxNativeAdErrorDomain = @"MobFoxNativeAd";
int const MAX_STARS = 5;

@interface MobFoxNativeAdController ()<CustomEventNativeDelegate> {
    
}

@property (nonatomic, strong) NativeAd* nativeAd;
@property (nonatomic, strong) CustomEventNative* customEventNative;
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
        
        int r = arc4random_uniform(50000);
        NSString *random = [NSString stringWithFormat:@"%d", r];
        
        NSString *requestType;
        if (UI_USER_INTERFACE_IDIOM()==UIUserInterfaceIdiomPhone)
        {
            requestType = @"iphone_app";
        }
        else
        {
            requestType = @"ipad_app";
        }

        
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_6_0
        NSString *iosadvid;
        if ([ASIdentifierManager instancesRespondToSelector:@selector(advertisingIdentifier )]) {
            iosadvid = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];

            requestString=[NSString stringWithFormat:@"r_type=native&rt=%@&r_resp=json&n_img=icon,main&n_txt=headline,description,cta,advertiser,rating&u=%@&u_wv=%@&u_br=%@&o_iosadvid=%@&v=%@&s=%@&iphone_osversion=%@&r_random=%@",
                           [requestType stringByUrlEncoding],
						   [self.userAgent stringByUrlEncoding],
						   [self.userAgent stringByUrlEncoding],
						   [[self browserAgentString] stringByUrlEncoding],
						   [iosadvid stringByUrlEncoding],
						   [SDK_VERSION stringByUrlEncoding],
						   [publisherId stringByUrlEncoding],
						   [osVersion stringByUrlEncoding],
                           [random stringByUrlEncoding]];
            
        } else {
            requestString=[NSString stringWithFormat:@"r_type=native&rt=%@&r_resp=json&n_img=icon,main&n_txt=headline,description,cta,advertiser,rating&u=%@&u_wv=%@&u_br=%@&&v=%@&s=%@&iphone_osversion=%@&r_random=%@",
                           [requestType stringByUrlEncoding],
						   [self.userAgent stringByUrlEncoding],
						   [self.userAgent stringByUrlEncoding],
						   [[self browserAgentString] stringByUrlEncoding],
						   [SDK_VERSION stringByUrlEncoding],
						   [publisherId stringByUrlEncoding],
						   [osVersion stringByUrlEncoding],
                           [random stringByUrlEncoding]];
			
            
        }
#else
        
        requestString=[NSString stringWithFormat:@"r_type=native&rt=%@&r_resp=json&n_img=icon,main&n_txt=headline,description,cta,advertiser,rating&u=%@&u_wv=%@&u_br=%@&&v=%@&s=%@&iphone_osversion=%@&r_random=%@",
                       [requestType stringByUrlEncoding],
                       [self.userAgent stringByUrlEncoding],
                       [self.userAgent stringByUrlEncoding],
                       [[self browserAgentString] stringByUrlEncoding],
                       [SDK_VERSION stringByUrlEncoding],
                       [publisherId stringByUrlEncoding],
                       [osVersion stringByUrlEncoding],
                       [random stringByUrlEncoding]];
        
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
        
        if(adTypes) {
            NSString *adTypesString = [adTypes componentsJoinedByString:@","];
            requestStringWithLocation = [NSString stringWithFormat:@"%@&n_type=%@",
                                         requestStringWithLocation,
                                         adTypesString];

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
        
        NSDictionary *headers;
        
        dataReply = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
        
        if ([response respondsToSelector:@selector(allHeaderFields)]) {
            headers = [(NSHTTPURLResponse *)response allHeaderFields];
        }
        
        if ([dataReply length] == 0) {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"No inventory for ad request" forKey:NSLocalizedDescriptionKey];
            NSError *error = [NSError errorWithDomain:MobFoxNativeAdErrorDomain code:0 userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }

        if(!dataReply || error){
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"No correct response from the server" forKey:NSLocalizedDescriptionKey];
            
            NSError *error = [NSError errorWithDomain:MobFoxNativeAdErrorDomain code:0 userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }
        
        NSError *localError = nil;
        NSDictionary *json = [NSJSONSerialization JSONObjectWithData:dataReply options:0 error:&localError];

        if (localError || !json)
        {
            NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error parsing response from server" forKey:NSLocalizedDescriptionKey];
            
            NSError *error = [NSError errorWithDomain:MobFoxNativeAdErrorDomain code:0 userInfo:userInfo];
            [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            return;
        }
        
        [self setupAdFromJson:json headers:headers];
	}
    
}

- (void)setupAdFromJson:(NSDictionary *)json headers:(NSDictionary*)headers
{
    NativeAd *ad = [[NativeAd alloc]init];
    
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
                    CustomEvent *customEvent = [[CustomEvent alloc] init];
                    customEvent.className = [json objectForKey:@"class"];
                    customEvent.optionalParameter = [json objectForKey:@"parameter"];
                    customEvent.pixelUrl = [json objectForKey:@"pixel"];
                    [ad.customEvents addObject:customEvent];
                }
                @catch (NSException *exception) {
                    NSLog(@"Error creating custom event");
                }
                
            }
        }
    }
    
    ad.clickUrl = json[@"click_url"];
    
    NSDictionary* imageAssets = json[@"imageassets"];
    NSEnumerator* imageAssetEnumerator = [imageAssets keyEnumerator];
    NSString* key;
    while (key = [imageAssetEnumerator nextObject]) {
        NSDictionary* assetObject = imageAssets[key];
        NSString* imageUrl = assetObject[@"url"];
        NSString* width =  assetObject[@"width"];
        NSString* height = assetObject[@"height"];
        ImageAsset* asset = [[ImageAsset alloc]initWithUrl:imageUrl width:width height:height];
        [ad addImageAsset:asset withType:key];
    }
    
    NSDictionary* textAssets = json[@"textassets"];
    NSEnumerator* textAssetEnumerator = [textAssets keyEnumerator];
    while (key = [textAssetEnumerator nextObject]) {
        NSString* text = textAssets[key];
        [ad addTextAsset:text withType:key];
    }
    
    NSArray* trackersArray = json[@"trackers"];
    for (NSDictionary* trackerObject in trackersArray){
        Tracker* tracker = [[Tracker alloc]init];
        tracker.type = trackerObject[@"type"];
        tracker.url = trackerObject[@"url"];
        [ad.trackers addObject:tracker];
    }
    
    _nativeAd = ad;
    _customEventNative = nil;
    if([[ad customEvents]count] > 0) {
        [self loadCustomEventNativeAd];
        if(!_customEventNative) {
            if([_nativeAd isNativeAdValid]) {
                [self performSelectorOnMainThread:@selector(reportSuccess:) withObject:_nativeAd waitUntilDone:YES];
            } else {
                NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error parsing response from server" forKey:NSLocalizedDescriptionKey];
                NSError *error = [NSError errorWithDomain:MobFoxNativeAdErrorDomain code:0 userInfo:userInfo];
                [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
            }
        }
    } else {
        if([_nativeAd isNativeAdValid]) {
              [self performSelectorOnMainThread:@selector(reportSuccess:) withObject:_nativeAd waitUntilDone:YES];
        } else {
              NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error parsing response from server" forKey:NSLocalizedDescriptionKey];
              NSError *error = [NSError errorWithDomain:MobFoxNativeAdErrorDomain code:0 userInfo:userInfo];
              [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
        }
    }
    
}

-(void)loadCustomEventNativeAd {
    _customEventNative = nil;
    while ([_nativeAd.customEvents count] > 0)
    {
        @try
        {
            CustomEvent *event = [_nativeAd.customEvents objectAtIndex:0];
            [_nativeAd.customEvents removeObjectAtIndex:0];
            
            NSString* className = [NSString stringWithFormat:@"%@CustomEventNative",event.className];
            Class customClass = NSClassFromString(className);
            if(customClass) {
                _customEventNative = [[customClass alloc] init];
                _customEventNative.delegate = self;
                [_customEventNative loadNativeAdWithOptionalParameters:event.optionalParameter trackingPixel:event.pixelUrl];
                break;
            } else {
                NSLog(@"custom event native ad for %@ not implemented!",event.className);
            }
        }
        @catch (NSException *exception) {
            _customEventNative = nil;
            NSLog( @"Exception while creating custom event!" );
            NSLog( @"Name: %@", exception.name);
            NSLog( @"Reason: %@", exception.reason );
        }
        
    }

}


-(UIView *)getNativeAdViewForResponse:(NativeAd *)response xibName:(NSString *)name {
    
    if(!response) {
        return nil;
    }
    
    NSArray *nibObjects = [[NSBundle mainBundle] loadNibNamed:name owner:nil options:nil];
    UIView* mainView = nibObjects[0];
    if(!mainView) {
        return nil;
    }
    
    MobFoxNativeTrackingView* trackingView = [[MobFoxNativeTrackingView alloc] initWithFrame:mainView.frame andUserAgent:self.userAgent]; //Invisible view, used for tracking impressions
    trackingView.nativeAd = response;
    trackingView.delegate = delegate; //pass native ad, call on click?
    [mainView addSubview:trackingView];
    [response prepareImpressionWithView:mainView];
    
    for (UIView *child in mainView.subviews) {
        
        NSString* textAssetName = [child valueForKey:@"MobFoxTextAsset"];
        NSString* imageAssetName = [child valueForKey:@"MobFoxImageAsset"];
        
        if(textAssetName && [child isKindOfClass:[UILabel class]]) {
            NSString* text = [response.textAssets objectForKey:textAssetName];
            if([textAssetName isEqualToString:@"rating"] && text) {
                int fullStars = [text intValue];
                int emptyStars = MAX_STARS - fullStars;
                NSMutableString* starsLabel = [[NSMutableString alloc] init];
                for (int i=0; i<fullStars; i++) {
                    [starsLabel appendString:@"★"];
                }
                for (int i=0; i<emptyStars; i++) {
                    [starsLabel appendString:@"☆"];
                }
                ((UILabel*)child).text = starsLabel;
            } else {
                ((UILabel*)child).text = text;
            }
        } else if(imageAssetName && [child isKindOfClass:[UIImageView class]]){
            ImageAsset* asset = [response.imageAssets objectForKey:imageAssetName];
            if(asset.image) {
                ((UIImageView*)child).image = asset.image;
            }
        }
   
    }

    
    return mainView;

}

#pragma mark custom event native ad delegate:
-(void)customEventNativeFailed {
    [self loadCustomEventNativeAd];
    if(_customEventNative) {
        return;
    } else if([_nativeAd isNativeAdValid]) {
        [self performSelectorOnMainThread:@selector(reportSuccess:) withObject:_nativeAd waitUntilDone:YES];
    } else {
        NSDictionary *userInfo = [NSDictionary dictionaryWithObject:@"Error parsing response from server" forKey:NSLocalizedDescriptionKey];
        NSError *error = [NSError errorWithDomain:MobFoxNativeAdErrorDomain code:0 userInfo:userInfo];
        [self performSelectorOnMainThread:@selector(reportError:) withObject:error waitUntilDone:YES];
    }
}

-(void)customEventNativeLoaded:(NativeAd *)nativeAd {
    [self performSelectorOnMainThread:@selector(reportSuccess:) withObject:_customEventNative waitUntilDone:YES];
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
	if ([delegate respondsToSelector:@selector(nativeAdDidLoad:)])
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
