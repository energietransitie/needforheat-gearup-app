#import <UserNotifications/UNUserNotificationCenter.h>
#import <Foundation/Foundation.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

#import <Expo/Expo.h>

@protocol  RCTAppDelegate <NSObject, RCTBridgeDelegate, UNUserNotificationCenterDelegate>
@end

@interface AppDelegate : EXAppDelegateWrapper <RCTAppDelegate>

@end

