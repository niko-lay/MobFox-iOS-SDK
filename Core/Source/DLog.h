//
//  DLog.h
//  DemoApp
//
//  Created by Nikolay on 15/04/16.
//  Copyright © 2016 BizzClick. All rights reserved.
//

#ifndef DLog_h
#define DLog_h

#ifdef DEBUG
#   define DLog(fmt, ...) NSLog((@"%s [Line %d] " fmt), __PRETTY_FUNCTION__, __LINE__, ##__VA_ARGS__)
#else
#   define DLog(...)
#endif

#endif /* DLog_h */
