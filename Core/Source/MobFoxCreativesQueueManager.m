//
//  MobFoxCreativeTypesManager.m
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 28.04.2015.
//
//

#import "MobFoxCreativesQueueManager.h"

NSString * const QUEUE_URL = @"http://static.starbolt.io/waterfalls2.json";

@interface MobFoxCreativesQueueManager()
    @property (nonatomic, strong) NSArray* queueForBanner;
    @property (nonatomic, strong) NSArray* queueForFullscreen;
@end



@implementation MobFoxCreativesQueueManager

static MobFoxCreativesQueueManager* sharedManager = nil;

+(id)sharedManager {
    static dispatch_once_t once;
    dispatch_once(&once, ^{
        sharedManager = [[self alloc] init];
    });
    
    return sharedManager;
}

-(instancetype)init {
    self = [super init];
    if (self) {
        [self initQueuesWithFallbackData];
        srand48(arc4random());
        [self performSelectorInBackground:@selector(downloadQueuesFromServer) withObject:nil];
    }
    
    return self;
}

-(void) initQueuesWithFallbackData {
    MobFoxCreative* bannerCreative = [[MobFoxCreative alloc] initWithType:MobFoxCreativeBanner andProb:0.5];
    MobFoxCreative* videoCreative = [[MobFoxCreative alloc] initWithType:MobFoxCreativeVideo andProb:0.8];
    MobFoxCreative* nativeFormatCreative = [[MobFoxCreative alloc] initWithType:MobFoxCreativeNativeFormat andProb:1];
    
    self.queueForBanner = [NSArray arrayWithObjects:bannerCreative, nativeFormatCreative, nil];
    self.queueForFullscreen = [NSArray arrayWithObjects:bannerCreative, videoCreative, nativeFormatCreative, nil];
}

-(void) downloadQueuesFromServer {
    NSMutableURLRequest *request;
    NSError *error;
    NSURLResponse *response;
    NSData *dataReply;
    
    request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:QUEUE_URL]];
    [request setHTTPMethod: @"GET"];
    
    dataReply = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
    
    if(!dataReply || error || [dataReply length] == 0) {
        NSLog(@"Failed to load creatives queue from server!");
        return;
    }
    
    NSError *localError = nil;
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:dataReply options:0 error:&localError];
    if(localError) {
        NSLog(@"Error parsing cratives queue JSON: %@", localError.description);
        return;
    }
    if(!json) {
        NSLog(@"Error parsing creatives queue JSON!");
        return;
    }
    
    NSDictionary *waterfalls = json[@"waterfalls"];
    NSArray *banner = waterfalls[@"banner"];
    if(banner) {
        [self loadQueue:self.queueForBanner fromJson:banner];
    } else {
        NSLog(@"Error parsing creatives queue JSON for banners!");
    }
    
    NSArray *interstitial = waterfalls[@"interstitial"];
    if(banner) {
        [self loadQueue:self.queueForFullscreen fromJson:interstitial];
    } else {
        NSLog(@"Error parsing creatives queue JSON for interstitials!");
    }
    
}

-(void) loadQueue:(NSArray*)array fromJson:(NSArray*)json {
    
    NSMutableArray* creativesArray = [NSMutableArray array];
    
    for (NSMutableDictionary *dictionary in json)
    {
        NSString *typeString = dictionary[@"name"];
        MobFoxCreativeType type;
        
        if ([typeString isEqualToString:@"banner"]) {
            type = MobFoxCreativeBanner;
        } else if ([typeString isEqualToString:@"video"]) {
            type = MobFoxCreativeVideo;
        } else if ([typeString isEqualToString:@"nativeFormat"]) {
            type = MobFoxCreativeNativeFormat;
        } else {
            NSLog(@"Unknown creative type: %@", typeString);
            continue;
        }
        double prob = [dictionary[@"prob"] doubleValue];
        MobFoxCreative* creative = [[MobFoxCreative alloc]initWithType:type andProb:prob];
        
        [creativesArray addObject:creative];
    }
    
    if ([creativesArray count] > 0) {
        array = [NSArray arrayWithArray:creativesArray]; //overwrite fallback array with real data if successfully received
    }
}

-(NSMutableArray *)getCreativesQueueForBanner {
    return [self.queueForBanner mutableCopy];
}

-(NSMutableArray *)getCreativesQueueForFullscreen {
    return [self.queueForFullscreen mutableCopy];
}

-(MobFoxCreative*)getCreativeFromQueue:(NSMutableArray*)queue {
    MobFoxCreative* chosenCreative = nil;
    double random = drand48();
      
    for (int i=0; i <= [queue count]; i++) {
        MobFoxCreative* creative = queue[0];
        if(creative.prob >= random) {
            chosenCreative = creative;
            [queue removeObjectAtIndex:0];
            break;
        } else {
            MobFoxCreative* item = [[MobFoxCreative alloc]initWithType:creative.type andProb:1];
            [queue removeObjectAtIndex:0];
            [queue addObject:item];
        }
        
        i++;
    }
    
    
    if (!chosenCreative) { //choose fallback creative
        chosenCreative = [queue lastObject];
    }
    return chosenCreative;
}


@end


@implementation MobFoxCreative

-(id) initWithType:(MobFoxCreativeType)type andProb:(float)prob {
    self = [super init];
    self.type = type;
    self.prob = prob;
    return self;
}

@end