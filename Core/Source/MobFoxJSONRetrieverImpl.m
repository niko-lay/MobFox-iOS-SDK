//
//  JSONRetrieverImpl.m
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 7/19/15.
//
//

#import <Foundation/Foundation.h>
#import "MobFoxJSONRetrieverImpl.h"

@implementation MobFoxJSONRetrieverImpl {}

-(void) retrieveJSON: (NSString*) url jsonReturned:(void (^)(NSError* err, NSDictionary*)) cb;
{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),
                   ^{
                       NSURL *req   = [NSURL URLWithString:url];
                       NSData *data = [NSData dataWithContentsOfURL:req];
                       
                       dispatch_sync(dispatch_get_main_queue(), ^{
                           
                           if(!data){
                               NSError* err = [[NSError alloc] initWithDomain:@"MobFox-Retrieve-JSON" code:20001 userInfo:nil];
                               return cb(err,nil);
                           }
                           
                           NSError *localError = nil;
                           NSDictionary *parsedObject = [NSJSONSerialization JSONObjectWithData:data options:0 error:&localError];
                           
                           if (localError != nil) {
                               return cb(localError,nil);
                           }
                           
                           cb(nil,parsedObject);
                           
                       });
                   });
}

@end