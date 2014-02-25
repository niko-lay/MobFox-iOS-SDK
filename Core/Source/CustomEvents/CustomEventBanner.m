//
//  CustomEventBanner.m
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 20.02.2014.
//
//

#import "CustomEventBanner.h"

@implementation CustomEventBanner

@synthesize delegate;
@synthesize trackingPixel;

- (void)loadBannerWithSize:(CGSize)size optionalParameters:(NSString *)optionalParameters trackingPixel:(NSString *)trackingPixel
{
    //Subclasses must override this method.
}

- (void)didDisplayAd
{
    if(trackingPixel) {
        NSURL *url = [NSURL URLWithString:trackingPixel];
        NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];
        [request setHTTPMethod: @"GET"];
        [NSURLConnection sendAsynchronousRequest:request queue:[[NSOperationQueue alloc] init] completionHandler:nil];
    }
}

@end
