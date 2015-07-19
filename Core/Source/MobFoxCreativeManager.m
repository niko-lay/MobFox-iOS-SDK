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

+ (JSONRetriever *)retriever {
    static JSONRetriever *retriever = nil;
    if (retriever == nil) {
        // create retriever
    }
    return retriever;
}

-(id)initWithInventoryHash:(NSString *)invh
{
    self = [super init];
    if (self) {
        self.invh =invh;
    }
    return self;
}

-(MobFoxNativeFormatCreative *) getCreative:(NSString*)type width:(NSInteger)width height:(NSInteger)height
{
    bool webgl = false;
    if(SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"8.0")){
        webgl  = true;
    }
    
}

@end
