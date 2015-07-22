//
//  MobFoxCreativeManager.m
//  MobFoxSDKSource
//
//  Created by Itamar Nabriski on 7/13/15.
//
//

#import <Foundation/Foundation.h>
#include "MobFoxCreativeManager.h"
#include "MobFoxJSONRetrieverImpl.h"

@implementation MobFoxCreativeManager

static MobFoxJSONRetriever* retriever = nil;
static MobFoxCreativeManager* sharedManager = nil;

+ (MobFoxJSONRetriever*) retriever { return retriever; }
+ (void) setRetriever:(MobFoxJSONRetriever*)value { retriever = value; }

+(id)sharedManagerWithInventoryHash:(NSString*)invh {
    
    if(!retriever){
        retriever = [[MobFoxJSONRetrieverImpl alloc] init];
    }
    static dispatch_once_t once;
    dispatch_once(&once, ^{
        sharedManager = [[self alloc] initWithInventoryHash:invh];
    });
    
    return sharedManager;
}

-(id)initWithInventoryHash:(NSString *)invh
{
    
    self = [super init];
    self.creatives = [[NSMutableArray alloc] init];
    [self addBundledCreativeWithName:@"fallback_320x50" type:@"stripe" prob:0];
    [self addBundledCreativeWithName:@"fallback_320x480" type:@"block" prob:0];
    if (self) {
        self.invh =invh;
    }
   
    [self downloadCreatives];
    return self;
}

-(MobFoxNativeFormatCreative *) getCreative:(NSInteger)width height:(NSInteger)height
{
   
    bool webgl = false;
    if(SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"8.0")){
        webgl  = true;
    }
    
    double ratio = height / (double)width;
    
    for(MobFoxNativeFormatCreative* c in  self.creatives){
        if(c.webgl!=webgl) continue;
        
        if(ratio < 0.5 && [c.type isEqualToString:@"block"]) continue;
        
        if(ratio >= 0.5 && [c.type isEqualToString:@"stripe"]) continue;
        
        return c;
    }
    
    return nil;
}

-(void) downloadCreatives{
    
    
    NSString* base = BASE_URL;
    NSString* url = [NSString stringWithFormat:@"%@?p=%@", base, self.invh];
    
    
    [MobFoxCreativeManager.retriever retrieveJSON:url jsonReturned:^void (NSError* err, NSDictionary* json){
        
        NSArray* jsonCreatives = (NSArray*)[json objectForKey:@"creatives"];
        for(NSDictionary* c_dict in  jsonCreatives){
            MobFoxNativeFormatCreative* c = [MobFoxNativeFormatCreative alloc];
            c.templateString = [c_dict objectForKey:@"template"];
            c.name           = [c_dict objectForKey:@"name"];
            c.type           = [c_dict objectForKey:@"type"];
            c.prob           = [[c_dict objectForKey:@"prob"] doubleValue];
            c.webgl           = [[c_dict objectForKey:@"webgl"] boolValue];
            //NSLog(@"adding c >> %@",c.type);
            [self.creatives addObject:c];
           
        }
    }];
    
}


- (void) addBundledCreativeWithName:(NSString*)name type:(NSString*)type prob:(NSInteger) prob {
    
    NSString *path = [[NSBundle mainBundle] pathForResource: name ofType: @"mustache"];
    if (!path) {
        NSLog(@"Cannot find resources for creative named: %@",name);
        return;
    }
    
    NSError* error;
    NSString *templateString = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:&error];
    
    if(error) {
        NSLog(@"Cannot load bundled resource, %@",error.description);
        return;
    }
    
    MobFoxNativeFormatCreative* creative = [[MobFoxNativeFormatCreative alloc] init];
    creative.name = name;
    creative.type = type;
    creative.prob = prob;
    creative.webgl = false;
    creative.templateString = templateString;
    
    [self.creatives addObject:creative];
}

@end
