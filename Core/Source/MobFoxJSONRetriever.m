//
//  JSONRetriever.m
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 7/13/15.
//
//

#import <Foundation/Foundation.h>
#import "MobFoxJSONRetriever.h"

@implementation MobFoxJSONRetriever {}

-(void) retrieveJSON: (NSString*) url jsonReturned:(void (^)(NSError*,NSDictionary*)) cb;
{
    @throw [NSException exceptionWithName:NSInternalInconsistencyException
                                   reason:[NSString stringWithFormat:@"You must override %@ in a subclass", NSStringFromSelector(_cmd)]
                                 userInfo:nil];
}

@end
