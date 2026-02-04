import { describe, it, expect } from 'vitest';
import { calculateNotifyAt, getReminderDescription } from './useNotifications';

describe('calculateNotifyAt', () => {
  describe('with due time', () => {
    const dueDate = '2024-12-25';
    const dueTime = '14:00'; // 2 PM

    it('should calculate 15 minutes before', () => {
      const result = calculateNotifyAt(dueDate, dueTime, '15min');
      const notifyDate = new Date(result);

      // Should be 1:45 PM
      expect(notifyDate.getHours()).toBe(13);
      expect(notifyDate.getMinutes()).toBe(45);
    });

    it('should calculate 1 hour before', () => {
      const result = calculateNotifyAt(dueDate, dueTime, '1hour');
      const notifyDate = new Date(result);

      // Should be 1:00 PM
      expect(notifyDate.getHours()).toBe(13);
      expect(notifyDate.getMinutes()).toBe(0);
    });

    it('should calculate 1 day before', () => {
      const result = calculateNotifyAt(dueDate, dueTime, '1day');
      const notifyDate = new Date(result);

      // Should be December 24 at 2:00 PM
      expect(notifyDate.getDate()).toBe(24);
      expect(notifyDate.getHours()).toBe(14);
    });

    it('should calculate custom minutes before', () => {
      const result = calculateNotifyAt(dueDate, dueTime, 'custom', 30);
      const notifyDate = new Date(result);

      // Should be 1:30 PM
      expect(notifyDate.getHours()).toBe(13);
      expect(notifyDate.getMinutes()).toBe(30);
    });

    it('should handle custom 0 minutes', () => {
      const result = calculateNotifyAt(dueDate, dueTime, 'custom', 0);
      const notifyDate = new Date(result);

      // Should be exactly 2:00 PM
      expect(notifyDate.getHours()).toBe(14);
      expect(notifyDate.getMinutes()).toBe(0);
    });
  });

  describe('without due time', () => {
    const dueDate = '2024-12-25';
    const dueTime = null;

    it('should default to 9:00 AM when no time provided', () => {
      const result = calculateNotifyAt(dueDate, dueTime, '15min');
      const notifyDate = new Date(result);

      // Should be 8:45 AM (15 min before 9 AM default)
      expect(notifyDate.getHours()).toBe(8);
      expect(notifyDate.getMinutes()).toBe(45);
    });

    it('should calculate 1 day before from 9 AM default', () => {
      const result = calculateNotifyAt(dueDate, dueTime, '1day');
      const notifyDate = new Date(result);

      // Should be December 24 at 9:00 AM
      expect(notifyDate.getDate()).toBe(24);
      expect(notifyDate.getHours()).toBe(9);
    });
  });

  describe('edge cases', () => {
    it('should handle midnight times', () => {
      const result = calculateNotifyAt('2024-12-25', '00:00', '1hour');
      const notifyDate = new Date(result);

      // Should be December 24 at 11:00 PM
      expect(notifyDate.getDate()).toBe(24);
      expect(notifyDate.getHours()).toBe(23);
    });

    it('should handle large custom values (1 week)', () => {
      const result = calculateNotifyAt('2024-12-25', '12:00', 'custom', 60 * 24 * 7);
      const notifyDate = new Date(result);

      // Should be December 18 at noon
      expect(notifyDate.getDate()).toBe(18);
      expect(notifyDate.getHours()).toBe(12);
    });

    it('should return valid ISO string', () => {
      const result = calculateNotifyAt('2024-12-25', '14:00', '15min');
      expect(() => new Date(result)).not.toThrow();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    });
  });
});

describe('getReminderDescription', () => {
  it('should return formatted date string', () => {
    const notifyAt = '2024-12-24T14:00:00.000Z';
    const result = getReminderDescription(notifyAt, '2024-12-25', '14:00');

    // Should contain month and day
    expect(result).toContain('Dec');
    expect(result).toContain('24');
  });

  it('should include time in description', () => {
    const notifyAt = '2024-12-24T14:30:00.000Z';
    const result = getReminderDescription(notifyAt, '2024-12-25', '14:30');

    // Should contain time
    expect(result).toMatch(/\d+:\d+/);
  });
});
