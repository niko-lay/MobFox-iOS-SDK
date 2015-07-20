//
//  JSONRetrieverImpl.m
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 7/19/15.
//
//

#import <Foundation/Foundation.h>
#import "JSONRetrieverImpl.h"

@implementation JSONRetrieverImpl {}

-(void) retrieveJSON: (NSString*) url jsonReturned:(void (^)(NSError* err, NSDictionary*)) cb;
{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),
                   ^{
                       NSURL *req   = [NSURL URLWithString:url];
                       NSData *data = [NSData dataWithContentsOfURL:req];
                       

                       dispatch_sync(dispatch_get_main_queue(), ^{
                           
                           NSError *localError = nil;
                           NSDictionary *parsedObject = [NSJSONSerialization JSONObjectWithData:data options:0 error:&localError];
                           
                           if (localError != nil) {
                               cb(localError,nil);
                           }
                           
                           cb(nil,parsedObject);
                           
                       });
                   });
}

@end