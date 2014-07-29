//
//  ChartboostCustomEventFullscreen.h
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 28.07.2014.
//
//

#import "CustomEventFullscreen.h"
#import "Chartboost.h"

@interface ChartboostCustomEventFullscreen : CustomEventFullscreen <ChartboostDelegate> {
    Chartboost* sdk;
}

@end
