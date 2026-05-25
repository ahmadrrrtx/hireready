// ============================================================
// UTILITY: INPUT VALIDATORS
// Form validation helpers
// ============================================================

export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  required: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  isNumber: (value: string): boolean => {
    return !isNaN(Number(value)) && value.trim() !== '';
  },

  range: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },

  sanitizeInput: (input: string): string => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  },
};

export const validateForm = (
  fields: Record<string, any>,
  rules: Record<string, Array<(value: any) => boolean | { isValid: boolean; errors: string[] }>>
): { isValid: boolean; errors: Record<string, string[]> } => {
  const errors: Record<string, string[]> = {};

  Object.keys(rules).forEach(fieldName => {
    const fieldRules = rules[fieldName];
    const fieldValue = fields[fieldName];
    const fieldErrors: string[] = [];

    fieldRules.forEach(rule => {
      const result = rule(fieldValue);
      if (typeof result === 'boolean') {
        if (!result) {
          fieldErrors.push(`${fieldName} is invalid`);
        }
      } else {
        if (!result.isValid) {
          fieldErrors.push(...result.errors);
        }
      }
    });

    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
