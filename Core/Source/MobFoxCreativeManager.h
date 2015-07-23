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
#include "MobFoxJSONRetriever.h"

#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)

#define BASE_URL @"http://sdk.starbolt.io/creatives.json";

@interface MobFoxCreativeManager : NSObject

@property (nonatomic, strong) NSString* invh;
@property (nonatomic, strong) NSMutableArray* creatives;

+(MobFoxJSONRetriever *) retriever;
+(void) setRetriever:(MobFoxJSONRetriever*)ret;

+(id) sharedManagerWithInventoryHash:(NSString*)invh;

-(id)initWithInventoryHash:(NSString *)invh;

-(void) downloadCreatives;

-(MobFoxNativeFormatCreative *) getCreative:(NSInteger)width height:(NSInteger)height;

@end

#endif
