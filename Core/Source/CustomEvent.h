//
//  CustomEvent.h
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 10.03.2014.
//
//

#import <Foundation/Foundation.h>

@interface CustomEvent : NSObject
@property (nonatomic, assign) NSString* className;
@property (nonatomic, assign) NSString* optionalParameter;
@property (nonatomic, assign) NSString* pixelUrl;
@end
