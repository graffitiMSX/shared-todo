import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatTime, formatDateTime } from './utils';

describe('cn (className utility)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'active', false && 'hidden')).toBe('base active');
  });

  it('should merge Tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('should handle objects', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });
});

describe('formatDate', () => {
  it('should format date string correctly', () => {
    // Use a date with explicit time to avoid timezone issues
    const result = formatDate('2024-12-25T12:00:00');
    expect(result).toContain('December');
    expect(result).toContain('2024');
  });

  it('should format Date object correctly', () => {
    // Create date with local timezone
    const date = new Date(2024, 6, 4); // July 4, 2024 (months are 0-indexed)
    const result = formatDate(date);
    expect(result).toContain('July');
    expect(result).toContain('4');
    expect(result).toContain('2024');
  });

  it('should handle different months', () => {
    expect(formatDate('2024-01-15T12:00:00')).toContain('January');
    expect(formatDate('2024-06-20T12:00:00')).toContain('June');
    expect(formatDate('2024-11-30T12:00:00')).toContain('November');
  });
});

describe('formatTime', () => {
  it('should format morning time correctly', () => {
    const result = formatTime('09:30');
    expect(result).toContain('9');
    expect(result).toContain('30');
    expect(result.toLowerCase()).toContain('am');
  });

  it('should format afternoon time correctly', () => {
    const result = formatTime('14:45');
    expect(result).toContain('2');
    expect(result).toContain('45');
    expect(result.toLowerCase()).toContain('pm');
  });

  it('should format noon correctly', () => {
    const result = formatTime('12:00');
    expect(result).toContain('12');
    expect(result).toContain('00');
    expect(result.toLowerCase()).toContain('pm');
  });

  it('should format midnight correctly', () => {
    const result = formatTime('00:00');
    expect(result).toContain('12');
    expect(result).toContain('00');
    expect(result.toLowerCase()).toContain('am');
  });
});

describe('formatDateTime', () => {
  it('should format date without time', () => {
    // Use explicit time to avoid timezone issues
    const result = formatDateTime('2024-12-25T12:00:00');
    expect(result).toContain('December');
    expect(result).toContain('2024');
  });

  it('should format date with time', () => {
    // Create local date to avoid timezone issues
    const date = new Date(2024, 11, 25); // December 25, 2024
    const result = formatDateTime(date, '15:30');
    expect(result).toContain('December');
    expect(result).toContain('25');
    expect(result).toContain('2024');
    expect(result).toContain('3');
    expect(result).toContain('30');
  });

  it('should handle Date object with time', () => {
    const date = new Date(2024, 6, 4); // July 4, 2024
    const result = formatDateTime(date, '10:00');
    expect(result).toContain('July');
    expect(result).toContain('4');
    expect(result).toContain('10');
  });
});
