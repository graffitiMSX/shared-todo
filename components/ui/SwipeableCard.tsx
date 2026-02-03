'use client';

import { useState, useRef, useCallback, type ReactNode } from 'react';
import { useHaptics } from '@/lib/hooks/useHaptics';

interface SwipeAction {
  icon: string;
  label: string;
  color: string;
  textColor?: string;
  onTrigger: () => void;
}

interface SwipeableCardProps {
  children: ReactNode;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  className?: string;
  threshold?: number; // Distance to trigger action (default: 80)
  disabled?: boolean;
}

export function SwipeableCard({
  children,
  leftAction,
  rightAction,
  className = '',
  threshold = 80,
  disabled = false,
}: SwipeableCardProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const haptics = useHaptics();
  const hasTriggeredHaptic = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    hasTriggeredHaptic.current = false;
    setIsDragging(true);
  }, [disabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX.current;
    const diffY = currentY - startY.current;

    // Determine swipe direction on first significant movement
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
        isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    // Only handle horizontal swipes
    if (!isHorizontalSwipe.current) return;

    // Prevent vertical scrolling during horizontal swipe
    e.preventDefault();

    // Calculate offset with resistance at edges
    let newOffset = diffX;

    // Apply resistance and limits
    const maxOffset = threshold + 20;
    if (newOffset > 0 && !leftAction) {
      newOffset = Math.min(newOffset * 0.2, 20);
    } else if (newOffset < 0 && !rightAction) {
      newOffset = Math.max(newOffset * 0.2, -20);
    } else {
      // Apply resistance after threshold
      if (Math.abs(newOffset) > threshold) {
        const excess = Math.abs(newOffset) - threshold;
        newOffset = Math.sign(newOffset) * (threshold + excess * 0.3);
      }
      newOffset = Math.max(-maxOffset, Math.min(maxOffset, newOffset));
    }

    setOffsetX(newOffset);

    // Haptic feedback when crossing threshold
    const action = newOffset > 0 ? leftAction : rightAction;
    if (action && Math.abs(newOffset) >= threshold && !hasTriggeredHaptic.current) {
      hasTriggeredHaptic.current = true;
      haptics.medium();
    } else if (Math.abs(newOffset) < threshold && hasTriggeredHaptic.current) {
      hasTriggeredHaptic.current = false;
    }
  }, [disabled, isDragging, leftAction, rightAction, threshold, haptics]);

  const handleTouchEnd = useCallback(() => {
    if (disabled || !isDragging) return;

    setIsDragging(false);

    // Check if action should be triggered
    if (Math.abs(offsetX) >= threshold) {
      const action = offsetX > 0 ? leftAction : rightAction;
      if (action) {
        haptics.success();
        action.onTrigger();
      }
    }

    // Reset position
    setOffsetX(0);
    isHorizontalSwipe.current = null;
  }, [disabled, isDragging, offsetX, threshold, leftAction, rightAction, haptics]);

  // Calculate action visibility
  const leftProgress = leftAction ? Math.min(Math.max(offsetX / threshold, 0), 1) : 0;
  const rightProgress = rightAction ? Math.min(Math.max(-offsetX / threshold, 0), 1) : 0;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left action background */}
      {leftAction && (
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-start pl-4 transition-opacity"
          style={{
            backgroundColor: leftAction.color,
            width: '100%',
            opacity: leftProgress,
          }}
        >
          <div
            className="flex items-center gap-2"
            style={{
              transform: `scale(${0.5 + leftProgress * 0.5})`,
              opacity: leftProgress,
            }}
          >
            <span className="text-2xl">{leftAction.icon}</span>
            <span
              className="font-medium text-sm"
              style={{ color: leftAction.textColor || 'white' }}
            >
              {leftAction.label}
            </span>
          </div>
        </div>
      )}

      {/* Right action background */}
      {rightAction && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 transition-opacity"
          style={{
            backgroundColor: rightAction.color,
            width: '100%',
            opacity: rightProgress,
          }}
        >
          <div
            className="flex items-center gap-2"
            style={{
              transform: `scale(${0.5 + rightProgress * 0.5})`,
              opacity: rightProgress,
            }}
          >
            <span
              className="font-medium text-sm"
              style={{ color: rightAction.textColor || 'white' }}
            >
              {rightAction.label}
            </span>
            <span className="text-2xl">{rightAction.icon}</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
