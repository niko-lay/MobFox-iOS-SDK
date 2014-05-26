//
//  MobFoxNativeTrackingView.m
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 26.05.2014.
//
//

#import "MobFoxNativeTrackingView.h"

@interface MobFoxNativeTrackingView()
@property (nonatomic, assign) BOOL wasShown;
@end


@implementation MobFoxNativeTrackingView


- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor clearColor];
    }
    return self;
}

- (void)drawRect:(CGRect)rect
{
    if(!wasShown) {
        wasShown = YES;
        [self performSelectorOnMainThread:@selector(reportImpression) withObject:nil waitUntilDone:YES];
        for(NSString *impressionUrl in impressionTrackers) {
            [self makeTrackingRequest:impressionUrl];
        }
    }
}

- (void)reportImpression
{
	if ([delegate respondsToSelector:@selector(nativeAdWasShown)])
	{
		[delegate nativeAdWasShown];
	}
}

- (void)makeTrackingRequest:(NSString*) impressionUrl {
    NSURL* url = [NSURL URLWithString:impressionUrl];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];
    [request setHTTPMethod: @"GET"];
    [NSURLConnection sendAsynchronousRequest:request queue:[[NSOperationQueue alloc] init] completionHandler:nil];
}


@synthesize wasShown;
@synthesize impressionTrackers;
@synthesize delegate;

@end
