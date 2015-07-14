//
//  MobFoxCreativeManager.h
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 7/13/15.
//
//

#ifndef MobFoxSDKSource_MobFoxCreativeManager_h
#define MobFoxSDKSource_MobFoxCreativeManager_h

#include "MobFoxNativeFormatCreative.h"

@interface MobFoxCreativeManager : NSObject

@property NSString* invh;

-(id)initWithInventoryHash:(NSString *)invh;

-(void) downloadCreatives;

-(MobFoxNativeFormatCreative *) getCreativeWithWidth:(NSInteger)width andHeight:(NSInteger)height;

@end

#endif
