#import <React/RCTBridgeDelegate.h>
#import <Expo/Expo.h>

@interface AppDelegate : EXAppDelegateWrapper <RCTBridgeDelegate>


@property (nonatomic, strong) UIWindow *window;

@end
