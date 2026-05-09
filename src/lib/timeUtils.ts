/**
 * Formats a date into time string, period (AM/PM), and a localized timezone abbreviation.
 */
export const formatTimeParts = (date: Date) => {
  // Use en-US for the time string and period to maintain consistency with the existing UI
  const hhmmss = date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: true 
  });
  
  const parts = hhmmss.split(' ');
  const timeStr = parts[0];
  const period = parts[1];

  // For the timezone, we try to get a localized abbreviation.
  // Some locales provide better abbreviations for certain regions.
  // For Japan, ja-JP often provides 'JST' whereas en-US might provide 'GMT+9'.
  
  const getTzParts = (loc: string, nameType: 'short' | 'long') => 
    Intl.DateTimeFormat(loc, { timeZoneName: nameType })
      .formatToParts(date)
      .find(p => p.type === 'timeZoneName')?.value;

  let tz = getTzParts('en-US', 'short') || '';

  // If the timezone looks like a generic offset, try to find a better one
  if (tz.startsWith('GMT+') || tz.startsWith('GMT-') || tz.startsWith('UTC')) {
    const longTz = getTzParts('en-US', 'long');
    
    // Manual mapping for regions where en-US short names are often generic offsets
    const mapping: Record<string, string> = {
      'Japan Standard Time': 'JST',
      'China Standard Time': 'CST',
      'Hong Kong Standard Time': 'HKT',
      'Singapore Standard Time': 'SGT',
      'Taiwan Standard Time': 'CST',
      'Korea Standard Time': 'KST',
    };

    if (longTz && mapping[longTz]) {
      tz = mapping[longTz];
    } else {
      // Fallback: try ja-JP as it often provides JST even when en-US doesn't
      const jaTz = getTzParts('ja-JP', 'short');
      if (jaTz && !jaTz.startsWith('GMT')) {
        tz = jaTz;
      }
    }
  }

  return { timeStr, period, tz };
};

/**
 * Formats a date into a localized date string in English.
 */
export const formatLocalDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

/**
 * Formats a date into a localized date string in Chinese (Simplified).
 */
export const formatChineseDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};
