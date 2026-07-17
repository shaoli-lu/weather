import { describe, expect, it } from 'vitest';
import { getAQIDescription } from './weather';

describe('getAQIDescription', () => {
  it('returns hazardous for very high numeric AQI values', () => {
    expect(getAQIDescription(373)).toBe('Hazardous / 危险');
  });

  it('returns moderate for mid-range AQI values', () => {
    expect(getAQIDescription(75)).toBe('Moderate / 良');
  });
});
