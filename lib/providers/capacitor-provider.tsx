'use client';

import { useEffect, createContext, useContext, useState, type ReactNode } from 'react';
import {
  isNativePlatform,
  getPlatform,
  initializeNativeUI,
} from '@/lib/capacitor/native';

interface CapacitorContextType {
  isNative: boolean;
  platform: string;
  isReady: boolean;
}

const CapacitorContext = createContext<CapacitorContextType>({
  isNative: false,
  platform: 'web',
  isReady: false,
});

export const useCapacitor = () => useContext(CapacitorContext);

interface CapacitorProviderProps {
  children: ReactNode;
}

export function CapacitorProvider({ children }: CapacitorProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [platform, setPlatform] = useState('web');
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Get platform info
      setIsNative(isNativePlatform());
      setPlatform(getPlatform());

      // Initialize native UI if on mobile
      await initializeNativeUI();

      setIsReady(true);
    };

    init();
  }, []);

  return (
    <CapacitorContext.Provider value={{ isNative, platform, isReady }}>
      {children}
    </CapacitorContext.Provider>
  );
}
