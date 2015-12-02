//
//  NSDictionary+Bizzclick.h
//  MobFoxSDKSource
//
//  Created by Nikolay on 27/11/15.
//
//

#import <Foundation/Foundation.h>


@interface NSDictionary (Bizzclick)
-(NSString*) asURLString;
-(NSString*) asURLStringWithEncoding:(BOOL)makeEncoding;

@end

