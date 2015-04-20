//
//  MobFoxNativeFormatCreativesManager.h
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 20.04.2015.
//
//

#import <Foundation/Foundation.h>
#import "MobFoxNativeFormatCreative.h"

@interface MobFoxNativeFormatCreativesManager : NSObject

+ (id) sharedManager;

- (MobFoxNativeFormatCreative *) getCreativeWithWidth:(NSInteger)width andHeight:(NSInteger)height;

@end
