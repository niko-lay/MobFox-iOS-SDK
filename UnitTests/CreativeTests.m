//
//  UnitTests.m
//  UnitTests
//
//  Created by Itamar Nabriski on 7/12/15.
//
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import "MobFoxJSONRetrieverDummy.h"
#import "MobFoxCreativeManager.h"

@interface CreativeTests : XCTestCase

@end

@implementation CreativeTests

- (void)setUp {
    [super setUp];
    // Put setup code here. This method is called before the invocation of each test method in the class.
}

- (void)tearDown {
    // Put teardown code here. This method is called after the invocation of each test method in the class.
    [super tearDown];
}

- (void)testRetriever {
    
    MobFoxJSONRetrieverDummy* ret = [[MobFoxJSONRetrieverDummy alloc] init];
    ret.data = [[NSDictionary alloc] initWithObjectsAndKeys : @"loko", @"koko", nil];
    
    [ret retrieveJSON:@"dummy" jsonReturned:^void (NSError* err, NSDictionary* dict) {
        XCTAssertNil(err);
        NSString* value = (NSString*)[dict valueForKey:@"koko"];
        NSLog(@"value: %@",value);
        XCTAssert([value isEqualToString:@"loko"]);
    }];
    
}


- (void)testCreativeManager{
    
    NSString* json = @"{"
    "\"creatives\": ["
    "{"
    "\"name\": \"particles\","
    "\"webgl\": true,"
    "\"type\": \"block\","
    "\"template\": \"<html></html>\","
    "\"prob\": 1"
    "},"
    "{"
    "\"name\": \"rotate\","
    "\"webgl\": true,"
    "\"type\": \"stripe\","
    "\"template\": \"<html></html>\","
    "\"prob\": 1"
    "},"
    "{"
    "\"name\": \"fallback_block\","
    "\"webgl\": false,"
    "\"type\": \"block\","
    "\"template\": \"<html></html>\","
    "\"prob\": 1"
    "},"
    "{"
    "\"name\": \"fallback_stripe\","
    "\"webgl\": false,"
    "\"type\": \"stripe\","
    "\"template\": \"<html></html>\","
    "\"prob\": 1"
    "}"
    "]"
    "}";
    
    MobFoxJSONRetrieverDummy* ret = [[MobFoxJSONRetrieverDummy alloc] init];
    
    NSData *data = [json dataUsingEncoding:NSUTF8StringEncoding];
    ret.data = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    
    [MobFoxCreativeManager setRetriever:ret];
    MobFoxCreativeManager* man = [MobFoxCreativeManager sharedManagerWithInventoryHash:@"12345"];

    MobFoxNativeFormatCreative* c = [man getCreative:300 height:250];
    XCTAssert([c.type isEqualToString:@"block"]);
    XCTAssert([c.name isEqualToString:@"particles"]);
    
    c = [man getCreative:320 height:50];
    XCTAssert([c.type isEqualToString:@"stripe"]);
}
/*
- (void)testPerformanceExample {
    // This is an example of a performance test case.
    [self measureBlock:^{
        // Put the code you want to measure the time of here.
    }];
}
 */

@end
