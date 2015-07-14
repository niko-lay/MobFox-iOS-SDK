//
//  MobFoxCreativeManager.m
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 7/13/15.
//
//

#import <Foundation/Foundation.h>
#include "MobFoxCreativeManager.h"

@implementation MobFoxCreativeManager

-(id)initWithInventoryHash:(NSString *)invh
{
    self = [super init];
    if (self) {
        self.invh =invh;
    }
    return self;
}

-(MobFoxNativeFormatCreative *) getCreativeWithWidth:(NSInteger)width andHeight:(NSInteger)height
{
    return nil;
}

@end
