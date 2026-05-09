import { describe, it, expect, vi } from 'vitest';
import { formatTimeParts } from './timeUtils';

describe('formatTimeParts', () => {
  it('should format time correctly', () => {
    const date = new Date('2026-05-08T11:56:31');
    const { timeStr, period } = formatTimeParts(date);
    
    // We check for the structure rather than exact value because of local timezone dependency
    expect(timeStr).toMatch(/\d{2}:\d{2}:\d{2}/);
    expect(['AM', 'PM']).toContain(period);
  });

  it('should return JST for Tokyo timezone when ja-JP locale provides it', () => {
    const date = new Date('2026-05-08T11:56:31');
    
    // Mock Intl.DateTimeFormat to simulate Tokyo timezone behavior
    const originalDateTimeFormat = Intl.DateTimeFormat;
    
    // @ts-ignore
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation((locale, options) => {
      if (locale === 'en-US' && options?.timeZoneName === 'short') {
        return {
          formatToParts: () => [{ type: 'timeZoneName', value: 'GMT+9' }]
        } as any;
      }
      if (locale === 'ja-JP' && options?.timeZoneName === 'short') {
        return {
          formatToParts: () => [{ type: 'timeZoneName', value: 'JST' }]
        } as any;
      }
      return new originalDateTimeFormat(locale, options);
    });

    const { tz } = formatTimeParts(date);
    expect(tz).toBe('JST');

    vi.restoreAllMocks();
  });

  it('should return CST for China timezone', () => {
    const date = new Date('2026-05-08T11:56:31');
    
    // Mock Intl.DateTimeFormat
    const originalDateTimeFormat = Intl.DateTimeFormat;
    
    // @ts-ignore
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation((locale, options) => {
      if (locale === 'en-US' && options?.timeZoneName === 'short') {
        return {
          formatToParts: () => [{ type: 'timeZoneName', value: 'GMT+8' }]
        } as any;
      }
      if (locale === 'en-US' && options?.timeZoneName === 'long') {
        return {
          formatToParts: () => [{ type: 'timeZoneName', value: 'China Standard Time' }]
        } as any;
      }
      return new originalDateTimeFormat(locale, options);
    });

    const { tz } = formatTimeParts(date);
    expect(tz).toBe('CST');

    vi.restoreAllMocks();
  });

  it('should fall back to en-US timezone if no better name is found', () => {
    const date = new Date('2026-05-08T11:56:31');
    
    // Mock Intl.DateTimeFormat to simulate NY timezone
    const originalDateTimeFormat = Intl.DateTimeFormat;
    
    // @ts-ignore
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation((locale, options) => {
      if (locale === 'en-US' && options?.timeZoneName === 'short') {
        return {
          formatToParts: () => [{ type: 'timeZoneName', value: 'EDT' }]
        } as any;
      }
      return new originalDateTimeFormat(locale, options);
    });

    const { tz } = formatTimeParts(date);
    expect(tz).toBe('EDT');

    vi.restoreAllMocks();
  });
});
