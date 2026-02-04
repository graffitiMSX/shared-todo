'use client';

import { useEffect, createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import {
  isNativePlatform,
  getPlatform,
  initializeNativeUI,
} from '@/lib/capacitor/native';
import {
  isNotificationsSupported,
  checkNotificationPermissions,
  requestNotificationPermissions,
  setupNotificationListeners,
  registerNotificationActions,
} from '@/lib/capacitor/notifications';

interface CapacitorContextType {
  isNative: boolean;
  platform: string;
  isReady: boolean;
  notificationsSupported: boolean;
  notificationsPermitted: boolean;
  requestNotificationPermission: () => Promise<boolean>;
}

const CapacitorContext = createContext<CapacitorContextType>({
  isNative: false,
  platform: 'web',
  isReady: false,
  notificationsSupported: false,
  notificationsPermitted: false,
  requestNotificationPermission: async () => false,
});

export const useCapacitor = () => useContext(CapacitorContext);

interface CapacitorProviderProps {
  children: ReactNode;
}

export function CapacitorProvider({ children }: CapacitorProviderProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [platform, setPlatform] = useState('web');
  const [isNative, setIsNative] = useState(false);
  const [notificationsSupported, setNotificationsSupported] = useState(false);
  const [notificationsPermitted, setNotificationsPermitted] = useState(false);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    const granted = await requestNotificationPermissions();
    setNotificationsPermitted(granted);
    return granted;
  }, []);

  // Initialize Capacitor
  useEffect(() => {
    const init = async () => {
      // Get platform info
      const native = isNativePlatform();
      setIsNative(native);
      setPlatform(getPlatform());

      // Initialize native UI if on mobile
      await initializeNativeUI();

      // Configure keyboard behavior on native
      if (native) {
        try {
          await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
          await Keyboard.setScroll({ isDisabled: false });
        } catch (e) {
          // Keyboard plugin may not be available on all platforms
          console.log('Keyboard configuration skipped:', e);
        }
      }

      // Initialize notifications if supported
      const notifSupported = isNotificationsSupported();
      setNotificationsSupported(notifSupported);

      if (notifSupported) {
        // Register notification action types
        await registerNotificationActions();

        // Check current permissions
        const permitted = await checkNotificationPermissions();
        setNotificationsPermitted(permitted);
      }

      setIsReady(true);
    };

    init();
  }, []);

  // Set up notification listeners
  useEffect(() => {
    if (!notificationsSupported) return;

    const cleanup = setupNotificationListeners((todoId) => {
      // Navigate to todos page with highlight parameter when notification is tapped
      router.push(`/todos?highlight=${todoId}`);
    });

    return cleanup;
  }, [notificationsSupported, router]);

  return (
    <CapacitorContext.Provider
      value={{
        isNative,
        platform,
        isReady,
        notificationsSupported,
        notificationsPermitted,
        requestNotificationPermission,
      }}
    >
      {children}
    </CapacitorContext.Provider>
  );
}
