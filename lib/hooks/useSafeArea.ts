'use client';

import { useState, useEffect } from 'react';
import { useCapacitor } from '@/lib/providers/capacitor-provider';

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Hook to get safe area insets for notch/home indicator
 * Uses CSS env() variables on native platforms
 */
export function useSafeArea(): SafeAreaInsets {
  const { isNative, platform } = useCapacitor();
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get safe area insets from CSS env() variables
    const computeInsets = () => {
      const style = getComputedStyle(document.documentElement);

      // Try to get safe area insets
      const top = parseInt(style.getPropertyValue('--sat') || '0', 10) ||
        (isNative && platform === 'ios' ? 47 : 0); // Default iOS notch height
      const bottom = parseInt(style.getPropertyValue('--sab') || '0', 10) ||
        (isNative && platform === 'ios' ? 34 : 0); // Default iOS home indicator
      const left = parseInt(style.getPropertyValue('--sal') || '0', 10) || 0;
      const right = parseInt(style.getPropertyValue('--sar') || '0', 10) || 0;

      setInsets({ top, bottom, left, right });
    };

    // Initial compute
    computeInsets();

    // Listen for orientation changes
    window.addEventListener('resize', computeInsets);
    window.addEventListener('orientationchange', computeInsets);

    return () => {
      window.removeEventListener('resize', computeInsets);
      window.removeEventListener('orientationchange', computeInsets);
    };
  }, [isNative, platform]);

  return insets;
}

/**
 * CSS classes for safe area padding
 */
export const safeAreaClasses = {
  // Padding for all sides
  all: 'pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right',
  // Padding for top (status bar/notch)
  top: 'pt-safe-top',
  // Padding for bottom (home indicator)
  bottom: 'pb-safe-bottom',
  // Horizontal padding
  horizontal: 'pl-safe-left pr-safe-right',
  // Vertical padding
  vertical: 'pt-safe-top pb-safe-bottom',
};
