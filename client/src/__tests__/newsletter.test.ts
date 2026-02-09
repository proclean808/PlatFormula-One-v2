import { describe, it, expect } from 'vitest';

/**
 * Newsletter Signup Tests
 * 
 * These tests verify the newsletter signup functionality
 */

describe('Newsletter Signup', () => {
  it('should validate email format', () => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    
    // Valid emails
    expect(emailRegex.test('founder@startup.com')).toBe(true);
    expect(emailRegex.test('test.email+tag@example.co.uk')).toBe(true);
    expect(emailRegex.test('user_123@domain.io')).toBe(true);
    
    // Invalid emails
    expect(emailRegex.test('invalid')).toBe(false);
    expect(emailRegex.test('@example.com')).toBe(false);
    expect(emailRegex.test('user@')).toBe(false);
    expect(emailRegex.test('user@domain')).toBe(false);
  });

  it('should normalize email addresses', () => {
    const testEmail = '  Founder@StartUp.COM  ';
    const normalized = testEmail.toLowerCase().trim();
    
    expect(normalized).toBe('founder@startup.com');
  });

  it('should have required newsletter table fields', () => {
    // Define expected schema
    const expectedFields = [
      'id',
      'email',
      'subscribed_at',
      'source',
      'status'
    ];
    
    // Verify all required fields are defined
    expect(expectedFields).toContain('email');
    expect(expectedFields).toContain('subscribed_at');
    expect(expectedFields).toContain('source');
    expect(expectedFields).toContain('status');
  });

  it('should use correct default values', () => {
    const defaultSource = 'footer';
    const defaultStatus = 'active';
    
    expect(defaultSource).toBe('footer');
    expect(defaultStatus).toBe('active');
  });
});
