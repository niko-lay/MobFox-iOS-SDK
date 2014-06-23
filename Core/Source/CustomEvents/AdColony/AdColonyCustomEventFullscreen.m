//
//  AdColonyCustomEventFullscreen.m
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 23.06.2014.
//
//

#import "AdColonyCustomEventFullscreen.h"

@implementation AdColonyCustomEventFullscreen

- (void)loadFullscreenWithOptionalParameters:(NSString *)optionalParameters trackingPixel:(NSString *)trackingPixel
{
    self.trackingPixel = trackingPixel;
    NSArray *tmp=[optionalParameters componentsSeparatedByString:@";"];
    Class SDKClass = NSClassFromString(@"AdColony");
    if(!SDKClass || [tmp count] < 2 || [tmp count] > 3) {
        [self.delegate customEventFullscreenDidFailToLoadAd];
        return;
    }
    NSString* appID;
    NSString* zoneIDs;
    if([tmp count] == 2) {
        appID=[tmp objectAtIndex:0];
        zoneIDs=[tmp objectAtIndex:1];
    } else {
        appID=[tmp objectAtIndex:1];
        zoneIDs=[tmp objectAtIndex:2];
    }
    NSArray *zoneIDsArray = [zoneIDs componentsSeparatedByString:@","];
    
    [SDKClass configureWithAppID:appID
                         zoneIDs:zoneIDsArray
                        delegate:self
                         logging:NO];
    
}

- (void) onAdColonyAdAvailabilityChange:(BOOL)available inZone:(NSString*) zoneID {
    if(available) {
        loadedZoneId = zoneID;
        [self.delegate customEventFullscreenDidLoadAd:self];
    } else {
        [self.delegate customEventFullscreenDidFailToLoadAd];
    }
}

- (void)showFullscreenFromRootViewController:(UIViewController *)rootViewController
{
    Class SDKClass = NSClassFromString(@"AdColony");
    if(SDKClass && loadedZoneId) {
        [SDKClass playVideoAdForZone:loadedZoneId withDelegate:self];
    }
}

- (void) onAdColonyAdStartedInZone:( NSString * )zoneID {
    [self didDisplayAd];
    [self.delegate customEventFullscreenWillAppear];
}


- (void) onAdColonyAdAttemptFinished:(BOOL)shown inZone:( NSString * )zoneID {
    if(!shown) {
        [self.delegate customEventFullscreenDidFailToLoadAd];
    } else {
        [self.delegate customEventFullscreenWillClose];
    }
}




- (void)dealloc
{
    loadedZoneId = nil;
    
}


@end
