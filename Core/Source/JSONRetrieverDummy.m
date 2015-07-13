//
//  JSONRetrieverDummy.m
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 7/13/15.
//
//

#import <Foundation/Foundation.h>
#import "JSONRetrieverDummy.h"

@implementation JSONRetrieverDummy {}

-(void) retrieveJSON: (NSString*) url jsonReturned:(void (^)(NSDictionary*)) cb;
{
    cb(self.data);
}

@end
