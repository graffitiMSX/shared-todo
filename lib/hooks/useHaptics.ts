'use client';

import { useCallback } from 'react';
import { useCapacitor } from '@/lib/providers/capacitor-provider';
import {
  impactLight,
  impactMedium,
  impactHeavy,
  notificationSuccess,
  notificationWarning,
  notificationError,
  selectionChanged,
} from '@/lib/capacitor/haptics';

/**
 * Hook for triggering haptic feedback
 * Only triggers on native platforms
 */
export function useHaptics() {
  const { isNative } = useCapacitor();

  // Light impact - toggles, selections
  const light = useCallback(async () => {
    if (!isNative) return;
    await impactLight();
  }, [isNative]);

  // Medium impact - button presses
  const medium = useCallback(async () => {
    if (!isNative) return;
    await impactMedium();
  }, [isNative]);

  // Heavy impact - major actions
  const heavy = useCallback(async () => {
    if (!isNative) return;
    await impactHeavy();
  }, [isNative]);

  // Success - task completed
  const success = useCallback(async () => {
    if (!isNative) return;
    await notificationSuccess();
  }, [isNative]);

  // Warning - caution needed
  const warning = useCallback(async () => {
    if (!isNative) return;
    await notificationWarning();
  }, [isNative]);

  // Error - destructive action
  const error = useCallback(async () => {
    if (!isNative) return;
    await notificationError();
  }, [isNative]);

  // Selection changed - picker changes
  const selection = useCallback(async () => {
    if (!isNative) return;
    await selectionChanged();
  }, [isNative]);

  return {
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selection,
    isSupported: isNative,
  };
}
