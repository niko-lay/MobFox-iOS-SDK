//
//  JSONRetriever.h
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 7/13/15.
//
//

#ifndef MobFoxSDKSource_JSONRetriever_h
#define MobFoxSDKSource_JSONRetriever_h

@protocol JSONRetrieverDelegate
    -(void) onJSONReturned: (NSDictionary*) JSONResponse;
@end

@interface JSONRetriever : NSObject


-(void) retrieveJSON: (NSString*) url jsonReturned:(void (^)(NSDictionary*)) cb;

@end

#endif
