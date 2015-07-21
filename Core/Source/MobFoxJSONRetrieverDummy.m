//
//  JSONRetrieverDummy.m
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 7/13/15.
//
//

#import <Foundation/Foundation.h>
#import "MobFoxJSONRetrieverDummy.h"

@implementation MobFoxJSONRetrieverDummy {}

-(void) retrieveJSON: (NSString*) url jsonReturned:(void (^)(NSError*,NSDictionary*)) cb;
{
    cb(nil,self.data);
}

@end
