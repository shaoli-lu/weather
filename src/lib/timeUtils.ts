/**
 * Formats a date into time string, period (AM/PM), and a localized timezone abbreviation.
 */
export const formatTimeParts = (date: Date, timeZone?: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: true 
  };
  if (timeZone) {
    options.timeZone = timeZone;
  }

  // Use en-US for the time string and period to maintain consistency with the existing UI
  const hhmmss = date.toLocaleTimeString('en-US', options);
  
  const parts = hhmmss.split(' ');
  const timeStr = parts[0];
  const period = parts[1];

  // For the timezone, we try to get the long spelled-out name.
  const getTzParts = (loc: string, nameType: 'short' | 'long') => {
    const opts: Intl.DateTimeFormatOptions = { timeZoneName: nameType };
    if (timeZone) {
      opts.timeZone = timeZone;
    }
    return Intl.DateTimeFormat(loc, opts)
      .formatToParts(date)
      .find(p => p.type === 'timeZoneName')?.value;
  };

  let tz = getTzParts('en-US', 'long') || '';

  // If the timezone looks like a generic offset, try to map it to a spelled out standard name
  if (!tz || tz.startsWith('GMT+') || tz.startsWith('GMT-') || tz.startsWith('UTC') || tz === 'GMT' || tz === 'UTC') {
    // Manual mapping for IANA timezone names to spelled-out names
    const mapping: Record<string, string> = {
      'Asia/Tokyo': 'Japan Standard Time',
      'Asia/Shanghai': 'China Standard Time',
      'Asia/Chongqing': 'China Standard Time',
      'Asia/Hong_Kong': 'Hong Kong Standard Time',
      'Asia/Singapore': 'Singapore Standard Time',
      'Asia/Taipei': 'Taiwan Standard Time',
      'Europe/London': 'British Summer Time',
      'Europe/Dublin': 'Irish Standard Time',
      'Europe/Paris': 'Central European Time',
      'Europe/Berlin': 'Central European Time',
      'Europe/Rome': 'Central European Time',
      'America/Chicago': 'Central Standard Time',
      'America/New_York': 'Eastern Standard Time',
      'America/Los_Angeles': 'Pacific Standard Time',
      'Pacific/Honolulu': 'Hawaii Standard Time',
      'Australia/Sydney': 'Australian Eastern Standard Time',
      'Asia/Dubai': 'Gulf Standard Time',
      'Asia/Kolkata': 'India Standard Time',
      'America/Toronto': 'Eastern Standard Time',
      'America/Phoenix': 'Mountain Standard Time',
      'America/Vancouver': 'Pacific Standard Time',
      'America/Costa_Rica': 'Central Standard Time',
      'Pacific/Auckland': 'New Zealand Standard Time',
      'America/Nassau': 'Eastern Standard Time',
      'America/Cayman': 'Eastern Standard Time',
      'America/Sao_Paulo': 'Brasilia Standard Time',
    };

    if (timeZone && mapping[timeZone]) {
      tz = mapping[timeZone];
      // Dynamic adjustments for summer time if the runtime returned GMT+1 for London
      if (timeZone === 'Europe/London') {
        const month = date.getMonth();
        // Summer time in UK is roughly last Sunday of March to last Sunday of October
        if (month > 2 && month < 10) {
          tz = 'British Summer Time';
        } else {
          tz = 'Greenwich Mean Time';
        }
      }
    }
  }

  // Double check: if it is still GMT+1, force replace it for London
  if (timeZone === 'Europe/London' && (tz.includes('GMT+1') || tz === 'BST')) {
    tz = 'British Summer Time';
  }

  return { timeStr, period, tz };
};

/**
 * Formats a date into a localized date string in English.
 */
export const formatLocalDate = (date: Date, timeZone?: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  };
  if (timeZone) {
    options.timeZone = timeZone;
  }
  return date.toLocaleDateString('en-US', options);
};

/**
 * Formats a date into a localized date string in Chinese (Simplified).
 */
export const formatChineseDate = (date: Date, timeZone?: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  };
  if (timeZone) {
    options.timeZone = timeZone;
  }
  return date.toLocaleDateString('zh-CN', options);
};
