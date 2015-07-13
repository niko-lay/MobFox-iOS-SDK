//
//  UnitTests.m
//  UnitTests
//
//  Created by Itamar Nabriski on 7/12/15.
//
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>
#import "JSONRetrieverDummy.h"

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

- (void)testExample {
    
    JSONRetrieverDummy* ret = [[JSONRetrieverDummy alloc] init];
    ret.data = [[NSDictionary alloc] initWithObjectsAndKeys : @"loko", @"koko", nil];
    
    [ret retrieveJSON:@"dummy" jsonReturned:^void (NSDictionary* dict) {
        NSString* value = (NSString*)[dict valueForKey:@"koko"];
        NSLog(@"value: %@",value);
        XCTAssert([value isEqualToString:@"loko"]);
    }];
    
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
