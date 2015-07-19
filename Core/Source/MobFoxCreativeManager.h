//
//  MobFoxCreativeManager.h
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 7/13/15.
//
//

#ifndef MobFoxSDKSource_MobFoxCreativeManager_h
#define MobFoxSDKSource_MobFoxCreativeManager_h

#import <UIKit/UIKit.h>
#include "MobFoxNativeFormatCreative.h"
#include "JSONRetriever.h"

#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)

@interface MobFoxCreativeManager : NSObject

@property NSString* invh;

+(JSONRetriever *) retriever;

-(id)initWithInventoryHash:(NSString *)invh;

-(void) downloadCreatives;

-(MobFoxNativeFormatCreative *) getCreative:(NSString*)type width:(NSInteger)width height:(NSInteger)height;

@end

#endif
