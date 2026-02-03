'use client';

import { Capacitor } from '@capacitor/core';

// Dynamically import to avoid SSR issues
let HapticsPlugin: typeof import('@capacitor/haptics').Haptics | null = null;
let ImpactStyle: typeof import('@capacitor/haptics').ImpactStyle | null = null;
let NotificationType: typeof import('@capacitor/haptics').NotificationType | null = null;

// Initialize haptics module
async function initHaptics() {
  if (typeof window === 'undefined') return false;
  if (!Capacitor.isNativePlatform()) return false;

  try {
    const module = await import('@capacitor/haptics');
    HapticsPlugin = module.Haptics;
    ImpactStyle = module.ImpactStyle;
    NotificationType = module.NotificationType;
    return true;
  } catch {
    return false;
  }
}

// Initialize on load
const hapticsReady = initHaptics();

/**
 * Check if haptics are supported
 */
export function isHapticsSupported(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Light impact - for selections, toggles
 */
export async function impactLight(): Promise<void> {
  await hapticsReady;
  if (!HapticsPlugin || !ImpactStyle) return;

  try {
    await HapticsPlugin.impact({ style: ImpactStyle.Light });
  } catch (error) {
    console.log('Haptic impact failed:', error);
  }
}

/**
 * Medium impact - for confirmations, button presses
 */
export async function impactMedium(): Promise<void> {
  await hapticsReady;
  if (!HapticsPlugin || !ImpactStyle) return;

  try {
    await HapticsPlugin.impact({ style: ImpactStyle.Medium });
  } catch (error) {
    console.log('Haptic impact failed:', error);
  }
}

/**
 * Heavy impact - for major actions, deletions
 */
export async function impactHeavy(): Promise<void> {
  await hapticsReady;
  if (!HapticsPlugin || !ImpactStyle) return;

  try {
    await HapticsPlugin.impact({ style: ImpactStyle.Heavy });
  } catch (error) {
    console.log('Haptic impact failed:', error);
  }
}

/**
 * Success notification - for completed actions
 */
export async function notificationSuccess(): Promise<void> {
  await hapticsReady;
  if (!HapticsPlugin || !NotificationType) return;

  try {
    await HapticsPlugin.notification({ type: NotificationType.Success });
  } catch (error) {
    console.log('Haptic notification failed:', error);
  }
}

/**
 * Warning notification - for warnings
 */
export async function notificationWarning(): Promise<void> {
  await hapticsReady;
  if (!HapticsPlugin || !NotificationType) return;

  try {
    await HapticsPlugin.notification({ type: NotificationType.Warning });
  } catch (error) {
    console.log('Haptic notification failed:', error);
  }
}

/**
 * Error notification - for errors, destructive actions
 */
export async function notificationError(): Promise<void> {
  await hapticsReady;
  if (!HapticsPlugin || !NotificationType) return;

  try {
    await HapticsPlugin.notification({ type: NotificationType.Error });
  } catch (error) {
    console.log('Haptic notification failed:', error);
  }
}

/**
 * Selection changed - for picker/selection changes
 */
export async function selectionChanged(): Promise<void> {
  await hapticsReady;
  if (!HapticsPlugin) return;

  try {
    await HapticsPlugin.selectionChanged();
  } catch (error) {
    console.log('Haptic selection failed:', error);
  }
}

/**
 * Start selection - call at start of selection gesture
 */
export async function selectionStart(): Promise<void> {
  await hapticsReady;
  if (!HapticsPlugin) return;

  try {
    await HapticsPlugin.selectionStart();
  } catch (error) {
    console.log('Haptic selection start failed:', error);
  }
}

/**
 * End selection - call at end of selection gesture
 */
export async function selectionEnd(): Promise<void> {
  await hapticsReady;
  if (!HapticsPlugin) return;

  try {
    await HapticsPlugin.selectionEnd();
  } catch (error) {
    console.log('Haptic selection end failed:', error);
  }
}
