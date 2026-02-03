import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';

/**
 * Check if running on a native platform (iOS/Android)
 */
export const isNativePlatform = () => Capacitor.isNativePlatform();

/**
 * Get the current platform
 */
export const getPlatform = () => Capacitor.getPlatform();

/**
 * Check if running on iOS
 */
export const isIOS = () => Capacitor.getPlatform() === 'ios';

/**
 * Check if running on Android
 */
export const isAndroid = () => Capacitor.getPlatform() === 'android';

/**
 * Check if running on web
 */
export const isWeb = () => Capacitor.getPlatform() === 'web';

/**
 * Initialize native UI components
 * Call this early in the app lifecycle
 */
export const initializeNativeUI = async () => {
  if (!isNativePlatform()) return;

  try {
    // Configure status bar
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#059669' }); // Emerald-600

    // Configure keyboard behavior (handled by native config)

    // Hide splash screen after app is ready
    await SplashScreen.hide();
  } catch (error) {
    console.error('Error initializing native UI:', error);
  }
};

/**
 * Show the splash screen
 */
export const showSplash = async () => {
  if (!isNativePlatform()) return;

  try {
    await SplashScreen.show({
      autoHide: false,
    });
  } catch (error) {
    console.error('Error showing splash:', error);
  }
};

/**
 * Hide the splash screen
 */
export const hideSplash = async () => {
  if (!isNativePlatform()) return;

  try {
    await SplashScreen.hide();
  } catch (error) {
    console.error('Error hiding splash:', error);
  }
};

/**
 * Set status bar style (light/dark text)
 */
export const setStatusBarStyle = async (style: 'light' | 'dark') => {
  if (!isNativePlatform()) return;

  try {
    await StatusBar.setStyle({
      style: style === 'light' ? Style.Light : Style.Dark,
    });
  } catch (error) {
    console.error('Error setting status bar style:', error);
  }
};

/**
 * Set status bar background color
 */
export const setStatusBarColor = async (color: string) => {
  if (!isNativePlatform()) return;

  try {
    await StatusBar.setBackgroundColor({ color });
  } catch (error) {
    console.error('Error setting status bar color:', error);
  }
};

/**
 * Hide keyboard programmatically
 */
export const hideKeyboard = async () => {
  if (!isNativePlatform()) return;

  try {
    await Keyboard.hide();
  } catch (error) {
    console.error('Error hiding keyboard:', error);
  }
};

/**
 * Listen for keyboard show/hide events
 */
export const addKeyboardListeners = (
  onShow?: (info: { keyboardHeight: number }) => void,
  onHide?: () => void
) => {
  if (!isNativePlatform()) return () => {};

  const showListener = Keyboard.addListener('keyboardWillShow', (info) => {
    onShow?.(info);
  });

  const hideListener = Keyboard.addListener('keyboardWillHide', () => {
    onHide?.();
  });

  // Return cleanup function
  return () => {
    showListener.then((l) => l.remove());
    hideListener.then((l) => l.remove());
  };
};
