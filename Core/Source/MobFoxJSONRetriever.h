//
//  JSONRetriever.h
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 7/13/15.
//
//

#ifndef MobFoxSDKSource_JSONRetriever_h
#define MobFoxSDKSource_JSONRetriever_h

@interface MobFoxJSONRetriever : NSObject

-(void) retrieveJSON: (NSString*) url jsonReturned:(void (^)(NSError*, NSDictionary*)) cb;

@end

#endif
