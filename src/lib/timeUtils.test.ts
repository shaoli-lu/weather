import { describe, it, expect, vi } from 'vitest';
import { formatTimeParts, formatLocalDate, formatChineseDate } from './timeUtils';

describe('formatTimeParts', () => {
  it('should format time correctly', () => {
    const date = new Date('2026-05-08T11:56:31');
    const { timeStr, period } = formatTimeParts(date);
    
    // We check for the structure rather than exact value because of local timezone dependency
    expect(timeStr).toMatch(/\d{2}:\d{2}:\d{2}/);
    expect(['AM', 'PM']).toContain(period);
  });

  it('should return Japan Standard Time for Tokyo timezone', () => {
    const date = new Date('2026-05-08T11:56:31');
    
    // Mock Intl.DateTimeFormat to simulate Tokyo timezone behavior
    const originalDateTimeFormat = Intl.DateTimeFormat;
    
    // @ts-ignore
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation((locale, options) => {
      if (locale === 'en-US' && options?.timeZoneName === 'long') {
        return {
          formatToParts: () => [{ type: 'timeZoneName', value: 'Japan Standard Time' }]
        } as any;
      }
      return new originalDateTimeFormat(locale, options);
    });

    const { tz } = formatTimeParts(date);
    expect(tz).toBe('Japan Standard Time');

    vi.restoreAllMocks();
  });

  it('should return China Standard Time for China timezone', () => {
    const date = new Date('2026-05-08T11:56:31');
    
    // Mock Intl.DateTimeFormat
    const originalDateTimeFormat = Intl.DateTimeFormat;
    
    // @ts-ignore
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation((locale, options) => {
      if (locale === 'en-US' && options?.timeZoneName === 'long') {
        return {
          formatToParts: () => [{ type: 'timeZoneName', value: 'China Standard Time' }]
        } as any;
      }
      return new originalDateTimeFormat(locale, options);
    });

    const { tz } = formatTimeParts(date);
    expect(tz).toBe('China Standard Time');

    vi.restoreAllMocks();
  });

  it('should fall back to long timezone if found', () => {
    const date = new Date('2026-05-08T11:56:31');
    
    // Mock Intl.DateTimeFormat to simulate NY timezone
    const originalDateTimeFormat = Intl.DateTimeFormat;
    
    // @ts-ignore
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation((locale, options) => {
      if (locale === 'en-US' && options?.timeZoneName === 'long') {
        return {
          formatToParts: () => [{ type: 'timeZoneName', value: 'Eastern Daylight Time' }]
        } as any;
      }
      return new originalDateTimeFormat(locale, options);
    });

    const { tz } = formatTimeParts(date);
    expect(tz).toBe('Eastern Daylight Time');

    vi.restoreAllMocks();
  });

  it('should format time for a custom timezone correctly', () => {
    const date = new Date('2026-05-08T12:00:00Z'); // 12:00:00 UTC
    // Tokyo timezone is UTC+9, so it should be 21:00:00 in Tokyo (09:00:00 PM)
    const { timeStr, period, tz } = formatTimeParts(date, 'Asia/Tokyo');
    expect(timeStr).toBe('09:00:00');
    expect(period).toBe('PM');
    expect(tz).toBe('Japan Standard Time');
  });

  it('should format date for a custom timezone correctly', () => {
    const date = new Date('2026-05-08T23:00:00Z');
    // Tokyo timezone is UTC+9, so local date is 2026-05-09 (Saturday)
    const localDateStr = formatLocalDate(date, 'Asia/Tokyo');
    const chineseDateStr = formatChineseDate(date, 'Asia/Tokyo');
    
    expect(localDateStr).toContain('Saturday');
    expect(localDateStr).toContain('May 9, 2026');
    
    expect(chineseDateStr).toContain('星期六');
    expect(chineseDateStr).toContain('2026年5月9日');
  });
});
