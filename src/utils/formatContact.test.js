import { getInitials, truncateText, getAvatarColor, formatPhoneDisplay } from './formatContact';
describe('formatContact utils', () => {
  test('getInitials should return uppercase initials', () => {
    expect(getInitials('John', 'Doe')).toBe('JD');
  });
  test('getInitials should handle single name', () => {
    expect(getInitials('John', '')).toBe('J');
  });
  test('truncateText should truncate long text with ellipsis', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
  });
  test('truncateText should not truncate short text', () => {
    expect(truncateText('Hi', 5)).toBe('Hi');
  });
  test('getAvatarColor should return a valid hex color', () => {
    const color = getAvatarColor('John Doe');
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });
  test('getAvatarColor should return consistent color for same name', () => {
    const color1 = getAvatarColor('John Doe');
    const color2 = getAvatarColor('John Doe');
    expect(color1).toBe(color2);
  });
  test('formatPhoneDisplay should return formatted phone', () => {
    const phone = '+1 (555) 123-4567';
    const formatted = formatPhoneDisplay(phone);
    expect(formatted).toBe(phone);
  });
  test('formatPhoneDisplay should handle null/undefined', () => {
    expect(formatPhoneDisplay(null)).toBe('N/A');
    expect(formatPhoneDisplay(undefined)).toBe('N/A');
  });
});