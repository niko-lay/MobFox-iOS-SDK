//
//  UIView+MobFox.m
//  MobFoxDemo
//
//  Created by Michał Kapuściński on 23.05.2014.
//

#import "UIView+MobFox.h"
#import <objc/runtime.h>

static char const * const TextAssetKey = "MobFoxTextAssetKey";

@implementation UIView (MobFox)

@dynamic MobFoxTextAsset;

- (id)MobFoxTextAsset {
    return objc_getAssociatedObject(self, TextAssetKey);
}

- (void)setMobFoxTextAsset:(NSString*)asset {
    objc_setAssociatedObject(self, TextAssetKey, asset, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

@end
