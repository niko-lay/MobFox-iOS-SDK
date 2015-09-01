//
//  InlineVideoAd.m
//  Test
//
//  Created by Itamar Nabriski on 6/4/15.
//  Copyright (c) 2015 Itamar Nabriski. All rights reserved.
//

#import "MobFoxInlineVideoAd.h"
#import <AdSupport/ASIdentifierManager.h>
#include <ifaddrs.h>
#include <arpa/inet.h>


@implementation MobFoxInlineVideoAd
{
    WebViewJavascriptBridge* bridge;
}
/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (void)_init {
    NSURL *url = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"index" ofType:@"html"]];
    
    [self loadRequest:[NSURLRequest requestWithURL:url]];
    
    
    self.allowsInlineMediaPlayback = true;
    self.mediaPlaybackRequiresUserAction = false;
    self.hidden = YES;
    
    self.autoplay = true;
    self.skip = true;

}

-(id) init{
    self = [super init];
    [self _init];
    return self;
}

-(id) initWithFrame:(CGRect)aRect
{
    self = [super initWithFrame:aRect];
    [self _init];
    return self;
}



- (void) loadVideoAd {
    
     self.hidden = YES;
    
    if(bridge == nil){
        bridge = [WebViewJavascriptBridge bridgeForWebView:self handler:^(id data, WVJBResponseCallback responseCallback) {
            NSLog(@"Received message from javascript: %@", data);
            NSDictionary *dict = (NSDictionary*)data;
            
            if([dict objectForKey:@"close"]){
                [self removeFromSuperview];
                if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdClosed)]) {
                    [self.adDelegate InlineVideoAdClosed];
                }
                
            }
            
            if([dict objectForKey:@"finished"]){
                //[self removeFromSuperview];
                if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdFinished)]) {
                    [self.adDelegate InlineVideoAdFinished];
                }
                
            }
            
            
            if([dict objectForKey:@"clickURL"]){
              
                NSString* url = (NSString*)[dict objectForKey:@"clickURL"];
                [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
                  
                if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdClicked)]) {
                    [self.adDelegate InlineVideoAdClicked];
                }
                    
            }
            
            
            //responseCallback(@"Right back atcha");
        }];
    }
    
    NSString *idfaString = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
    NSString *ipString = [self getIPAddress];
    NSString *pubId = [self.adDelegate publisherIdForInlineVideoAd:self];
    NSString *type = @"video";
    
   
    [bridge send:[NSDictionary dictionaryWithObjectsAndKeys:
                       type,@"type",
                       self.autoplay ? @"true" : @"false",@"autoplay",
                       self.skip ? @"true" : @"false" ,@"skip",
                       pubId, @"s",
                       idfaString,@"o_iosadvid",
                       ipString,@"i",
                       self.longitude,@"longitude",
                       self.latitude,@"latitude",
                       self.demo_gender,@"demo_gender",
                       self.demo_age,@"demo_age",
                       self.s_subid,@"s_subid",
                       self.sub_name,@"sub_name",
                       self.sub_domain,@"sub_domain",
                       self.sub_storeurl,@"sub_storeurl",
                       self.v_dur_min,@"v_dur_min",
                       self.v_dur_max,@"v_dur_max",
                       self.r_floor,@"r_floor",
                       nil]
     
     responseCallback:^(id responseData) {
         
         NSLog(@"ad callback: %@", responseData);
         
         if([responseData  isEqual: @"ad loaded"]){//success
             self.hidden = NO;
             if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdDidLoadMobFoxAd:)]) {
                 [self.adDelegate InlineVideoAdDidLoadMobFoxAd:self];
             }
             
         }
         else{//failure
             NSError* err = [NSError errorWithDomain:responseData code:0 userInfo:nil];
             
             if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdDidFailToReceiveAdWithError:)]) {
                    [self.adDelegate InlineVideoAdDidFailToReceiveAdWithError:err];
             }
         }
        
    }];
    
}


- (void) loadBannerAd {
    
    self.hidden = YES;
    
    if(bridge == nil){
        bridge = [WebViewJavascriptBridge bridgeForWebView:self
                  webViewDelegate:self
                  handler:^(id data, WVJBResponseCallback responseCallback) {
            NSLog(@"Received message from javascript: %@", data);
            NSDictionary *dict = (NSDictionary*)data;
            
            if([dict objectForKey:@"close"]){
                [self removeFromSuperview];
                if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdClosed)]) {
                    [self.adDelegate InlineVideoAdClosed];
                }
                
            }
            
            if([dict objectForKey:@"finished"]){
                //[self removeFromSuperview];
                if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdFinished)]) {
                    [self.adDelegate InlineVideoAdFinished];
                }
                
            }
            
            
            if([dict objectForKey:@"clickURL"]){
                
                NSString* url = (NSString*)[dict objectForKey:@"clickURL"];
                [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
                
                if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdClicked)]) {
                    [self.adDelegate InlineVideoAdClicked];
                }
                
            }
            
            
            //responseCallback(@"Right back atcha");
        }];
    }
    
    NSString *idfaString = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
    NSString *ipString = [self getIPAddress];
    NSString *pubId = [self.adDelegate publisherIdForInlineVideoAd:self];
    
    /*
     
     
     
   
     demo_keywords	No	Comma Separated	A comma-separated list of keywords. Example: sports, cars, finance, football
     adspace_strict	No	0 | 1	If this parameter is set to 1 and an adspace_height and adspace_width is provided, the ad server will only serve ads of these exact dimensions and will not serve any smaller-sized ads.
     no_markup	No	0 | 1	Should be passed as 1 if no markup ads should be returned. Setting this parameter to 1 will make sure that only image & text ads are being returned.
     u_wv	No	String	Used by the MobFox SDK only. Generates a hidden web-view before making an ad-request to find the user-agent of the device's browser.
     u_br	No	String	Used by the MobFox SDK only. Tries to send over the user-agent of the device's native browser.
     s_subid	Recommended	Numeric	If you are aggregating traffic for multiple Publishers on a single MobFox Inventory Hash, it is highly recommended you pass a unique ID per Publisher in the API so MobFox can optimise your traffic and achieve better eCPMs.
     sub_name	No	String	You can provide a custom name for the publication, to override the publication name set in your MobFox account. This value will be passed to DSPs as part of the OpenRTB bid request.
     sub_domain	No	String (valid domain name, like game.studio.com)	You can provide a custom domain for the publication, to enable DSPs to identify your app to advertisers. This value will be passed to DSPs as part of the OpenRTB bid request.
     sub_storeurl	No	String (valid URL)	You can provide an app store url for the publication, or - in absence - a web site url for the publication. This parameter can only be used for downloadable apps, not web sites. This value will be passed to DSPs as part of the OpenRTB bid request.
     sub_bundle_id	No	String	You can provide your app's bundle id like for example: "com.domain.title" or "3321293"
     allow_mr	Optional	0 | 1	Allow 300x250 Medium Rectangle Ad Units to be returned. This defaults to true for mobile websites, and must be specifically set to 0 when 300x250 ad units should not be shown on mobile websites.
     
     */
    
    [bridge send:[NSDictionary dictionaryWithObjectsAndKeys:
                  @"banner",@"type",
                  self.autoplay ? @"true" : @"false",@"autoplay",
                  self.skip ? @"true" : @"false" ,@"skip",
                  pubId, @"s",
                  idfaString,@"o_iosadvid",
                  ipString,@"i",
                  self.longitude,@"longitude",
                  self.latitude,@"latitude",
                  self.demo_gender,@"demo_gender",
                  self.demo_age,@"demo_age",
                  self.s_subid,@"s_subid",
                  self.sub_name,@"sub_name",
                  self.sub_domain,@"sub_domain",
                  self.sub_storeurl,@"sub_storeurl",
                  self.v_dur_min,@"v_dur_min",
                  self.v_dur_max,@"v_dur_max",
                  self.r_floor,@"r_floor",
                  320,@"adspace_width",
                  50,@"adspace_height",
                  1,@"adspace_strict",
                  nil]
     
    responseCallback:^(id responseData) {
    
        NSLog(@"ad callback: %@", responseData);
    
        if([responseData  isEqual: @"ad loaded"]){//success
            
            self.hidden = NO;
            
            if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdDidLoadMobFoxAd:)]) {
                [self.adDelegate InlineVideoAdDidLoadMobFoxAd:self];
            }
        
        }
        else{//failure
            NSError* err = [NSError errorWithDomain:responseData code:0 userInfo:nil];
        
            if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdDidFailToReceiveAdWithError:)]){
                [self.adDelegate InlineVideoAdDidFailToReceiveAdWithError:err];
            }
    }
    
}];
    
}

- (NSString *)getIPAddress {
    
    NSString *address = @"8.8.8.8";
    struct ifaddrs *interfaces = NULL;
    struct ifaddrs *temp_addr = NULL;
    int success = 0;
    // retrieve the current interfaces - returns 0 on success
    success = getifaddrs(&interfaces);
    
    
    if (success == 0) {
        // Loop through linked list of interfaces
        temp_addr = interfaces;
        while(temp_addr != NULL) {
            if(temp_addr->ifa_addr->sa_family == AF_INET) {
                // Check if interface is en0 which is the wifi connection on the iPhone
                if([[NSString stringWithUTF8String:temp_addr->ifa_name] isEqualToString:@"en0"]) {
                    // Get NSString from C String
                    address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr)];
                    
                }
                
            }
            
            temp_addr = temp_addr->ifa_next;
            
        }
    }
    // Free memory
    freeifaddrs(interfaces);
    return address;
    
}

- (BOOL)webView:(UIWebView *)webView
shouldStartLoadWithRequest:(NSURLRequest *)request
 navigationType:(UIWebViewNavigationType)navigationType{
    
    if(navigationType == UIWebViewNavigationTypeLinkClicked){
        
        [[UIApplication sharedApplication] openURL:request.URL];
        
        if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdClicked)]) {
            [self.adDelegate InlineVideoAdClicked];
        }
        return NO;
    }
    return YES;
}

- (void)webViewDidStartLoad:(UIWebView *)webView{}
- (void)webViewDidFinishLoad:(UIWebView *)webView{}
- (void)webViewdidFailLoadWithError:(NSError *)error{}

@end
