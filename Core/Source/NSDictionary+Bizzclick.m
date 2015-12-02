//
//  NSDictionary+Bizzclick.m
//  MobFoxSDKSource
//
//  Created by Nikolay on 27/11/15.
//
//

#import "NSDictionary+Bizzclick.h"
#import "NSString+Bizzclick.h"

@implementation NSDictionary (Bizzclick)
-(NSString*) asURLString{
    return [self asURLStringWithEncoding:FALSE];
}

-(NSString*) asURLStringWithEncoding:(BOOL)makeEncoding{
    __block NSMutableString *ret = [NSMutableString new];
    if (makeEncoding){
        [self enumerateKeysAndObjectsUsingBlock:^(NSString* key, NSString* value, BOOL* stop) {

            [ret appendString:[NSString stringWithFormat:@"%@=%@&", key, [value stringByUrlEncoding] ]];
        }];
    }else{
        [self enumerateKeysAndObjectsUsingBlock:^(NSString* key, NSString* value, BOOL* stop) {

            [ret appendString:[NSString stringWithFormat:@"%@=%@&", key, value]];
        }];
    }

    return [ret substringToIndex:ret.length-(ret.length>0)];
}


@end