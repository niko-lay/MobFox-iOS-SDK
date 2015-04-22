//
//  MobFoxNativeFormatView.h
//  MobFoxSDKSource
//
//  Created by Michał Kapuściński on 20.04.2015.
//
//

#import <UIKit/UIKit.h>

@class MobFoxNativeFormatView;

@protocol MobFoxNativeFormatViewDelegate <NSObject>

- (NSString *)publisherIdForMobFoxNativeFormatView:(MobFoxNativeFormatView *)nativeFormatView;

@optional

- (void)mobfoxNativeFormatDidLoad:(MobFoxNativeFormatView *)nativeFormatView;

- (void)mobfoxNativeFormatDidFailToLoadWithError:(NSError *)error;

- (void)mobfoxNativeFormatWillPresent;

- (void)mobfoxNativeFormatActionWillFinish;

- (void)mobfoxNativeFormatActionDidFinish;


@end


@interface MobFoxNativeFormatView : UIView

@property (nonatomic, assign) IBOutlet __unsafe_unretained id <MobFoxNativeFormatViewDelegate> delegate;
@property (nonatomic, assign) NSInteger adspaceWidth;
@property (nonatomic, assign) NSInteger adspaceHeight;

- (void)requestAd;

@end
