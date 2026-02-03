import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sharedtodo.app',
  appName: 'Shared Todo',
  webDir: 'out',
  server: {
    // For development, use live reload from Next.js dev server
    // Comment out for production builds
    // url: 'http://localhost:3000',
    // cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#10b981', // Emerald-500
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#059669', // Emerald-600
    },
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
  },
  android: {
    backgroundColor: '#10b981',
    allowMixedContent: false,
  },
};

export default config;
