//
//  InlineVideoAd.m
//  Test
//
//  Created by Itamar Nabriski on 6/4/15.
//  Copyright (c) 2015 Itamar Nabriski. All rights reserved.
//

#import "InlineVideoAd.h"
#import <AdSupport/ASIdentifierManager.h>
#include <ifaddrs.h>
#include <arpa/inet.h>


@implementation InlineVideoAd

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

-(id) initWithFrame:(CGRect)aRect
{
    self = [super initWithFrame:aRect];
    
    NSURL *url = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"index" ofType:@"html"]];
    
    [self loadRequest:[NSURLRequest requestWithURL:url]];
    
    
    self.allowsInlineMediaPlayback = true;
    self.mediaPlaybackRequiresUserAction = false;
    self.hidden = YES;

    self.autoplay = true;
    self.skip = true;
    
    return self;
}

- (void) loadAd {
    
     self.hidden = YES;
    
    if(self.bridge == nil){
        self.bridge = [WebViewJavascriptBridge bridgeForWebView:self handler:^(id data, WVJBResponseCallback responseCallback) {
            NSLog(@"Received message from javascript: %@", data);
            NSDictionary *dict = (NSDictionary*)data;
            id close = [dict objectForKey:@"close"];
            if(close){
                //close player ...
                [self removeFromSuperview];
                if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdClosed)]) {
                    [self.adDelegate InlineVideoAdClosed];
                }
                
                
            }
            else{
                id clickURL = [dict objectForKey:@"clickURL"];
                if(clickURL){
                    NSString* url = (NSString*)clickURL;
                    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
                    
                  
                    if ([self.adDelegate respondsToSelector:@selector
                         (InlineVideoAdClicked)]) {
                        [self.adDelegate InlineVideoAdClicked];
                    }
                    
                }
            }
            
            //responseCallback(@"Right back atcha");
        }];
    }
    
    NSString *idfaString = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
    
    NSString *ipString = [self getIPAddress];
    
   
    NSString *pubId = [self.adDelegate publisherIdForInlineVideoAd:self];
    
    /*
     javascript: {
     i = "8.8.8.8";
     "o_iosadvid" = "2B64AD48-8E94-4115-8F5F-BCF855F4F8D8";
     "r_resp" = vast20;
     "r_type" = video;
     rt = api;
     s = 80187188f458cfde788d961b6882fd53;
     u = "Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12F69";
     }
     */
    [self.bridge send:[NSDictionary dictionaryWithObjectsAndKeys:
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
         
         if([responseData  isEqual: @"ad loaded"]){//success
             self.hidden = NO;
             if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdDidLoadMobFoxAd:InlineVideoAd:)]) {
                 [self.adDelegate InlineVideoAdDidLoadMobFoxAd:self];
             }
             
         }
         else{//failure
             NSError* err = [NSError errorWithDomain:responseData code:0 userInfo:nil];
             
             if ([self.adDelegate respondsToSelector:@selector(InlineVideoAdDidFailToReceiveAdWithError:NSError:)]) {
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

@end
