'use client';

import { useState, useRef, useCallback, type ReactNode } from 'react';
import { useHaptics } from '@/lib/hooks/useHaptics';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
  threshold?: number; // Pull distance to trigger refresh (default: 80)
  maxPull?: number; // Maximum pull distance (default: 120)
}

export function PullToRefresh({
  onRefresh,
  children,
  className = '',
  threshold = 80,
  maxPull = 120,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const haptics = useHaptics();
  const hasTriggeredHaptic = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only allow pull when at the top of the content
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
      hasTriggeredHaptic.current = false;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      // Apply resistance to the pull
      const resistance = 0.5;
      const distance = Math.min(diff * resistance, maxPull);
      setPullDistance(distance);

      // Trigger haptic when crossing threshold
      if (distance >= threshold && !hasTriggeredHaptic.current) {
        hasTriggeredHaptic.current = true;
        haptics.medium();
      } else if (distance < threshold && hasTriggeredHaptic.current) {
        hasTriggeredHaptic.current = false;
      }
    }
  }, [isPulling, isRefreshing, maxPull, threshold, haptics]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      haptics.success();

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh, haptics]);

  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 360;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex justify-center items-center pointer-events-none z-10"
        style={{
          top: 0,
          height: `${Math.max(pullDistance, isRefreshing ? 60 : 0)}px`,
          opacity: pullDistance > 10 || isRefreshing ? 1 : 0,
          transition: isPulling ? 'none' : 'all 0.3s ease-out',
        }}
      >
        <div
          className={`w-8 h-8 rounded-full border-3 border-emerald-200 border-t-emerald-600 ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          style={{
            transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
            borderWidth: '3px',
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
