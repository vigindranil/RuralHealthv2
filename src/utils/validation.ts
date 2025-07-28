// --- TYPE DEFINITIONS ---

/**
 * Defines the structure for a single field's configuration.
 * This should match the structure used in your MODULE_CONFIGS.
 */
export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'tel' | 'email' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  readOnly?: boolean;
  options?: string[];
  step?: string;
}

/**
 * Defines the structure for a module's complete form configuration.
 */
export interface FormConfig {
  title: string;
  fields: FormField[];
}

/**
 * Represents the form's data state, a key-value object.
 * Using `any` for the value to accommodate various input types (string, number, etc.).
 */
export type FormData = Record<string, any>;

/**
 * Defines the structure of the object returned by the validation function.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: string[];
  errorCount: number;
  warningCount: number;
}


// --- VALIDATION FUNCTION ---

/**
 * Validates form data based on a given configuration.
 * @param formData The current data from the form state.
 * @param config The configuration object for the specific form module.
 * @param normalizedId The unique identifier for the current form.
 * @returns A ValidationResult object containing errors, warnings, and validity status.
 */
export const validateForm = (
  formData: FormData,
  config: FormConfig,
  normalizedId: string | null
): ValidationResult => {
  const errors: Record<string, string[]> = {};
  const warnings: string[] = [];

  // --- Helper Functions ---
  const isRequired = (field: FormField): boolean => field.required === true;
  const isEmpty = (value: any): boolean => value === null || value === undefined || String(value).trim() === '';
  
  const isValidNumber = (value: any): boolean => {
    if (typeof value === 'number') return isFinite(value);
    if (typeof value === 'string' && value.trim() !== '') {
        // Check if converting to a number results in a finite number
        return isFinite(Number(value));
    }
    return false;
  };
  
  const isValidLength = (value: any, maxLength = 100): boolean => String(value).length <= maxLength;
  const isValidPhone = (phone: any): boolean => /^[6-9]\d{9}$/.test(String(phone));
  const isValidEmail = (email: any): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
  const isValidWeightRange = (weight: number): boolean => weight > 0 && weight <= 500;
  const isValidAgeRange = (age: number): boolean => age >= 0 && age <= 150;
  
  const isValidDate = (date: any): boolean => {
    if (!date) return true; // Optional dates are valid when empty
    const dateObj = new Date(date);
    const now = new Date();
    return dateObj instanceof Date && !isNaN(dateObj.getTime()) && dateObj <= now;
  };
  
  const isValidAlphaNumeric = (value: any): boolean => /^[a-zA-Z0-9\s\-_.,'()]+$/.test(String(value));
  
  const isValidName = (value: any): boolean => {
    const normalizedValue = String(value).trim();
    if (normalizedValue.length < 2) {
      return false; // Name must be at least 2 characters
    }
    const lowerCaseValue = normalizedValue.toLowerCase();
    
    // Blocklist of common non-name values
    const blockedNames = ['na', 'n/a', 'not applicable', 'null', 'undefined', 'test'];
    if (blockedNames.includes(lowerCaseValue)) {
      return false;
    }
  
    // Check characters are valid for a name
    const nameRegex = /^[a-zA-Z\s\-'.]+$/;
    return nameRegex.test(normalizedValue);
  };

  // Validate each field in the config
  config.fields?.forEach((field: FormField) => {
    const value: any = formData[field.id];
    const fieldErrors: string[] = [];

    // Skip validation for read-only fields that are auto-populated
    if (field.readOnly && ['icdsCentreId', 'healthCentreId'].includes(field.id)) {
      return;
    }

    // Required field validation
    if (isRequired(field) && isEmpty(value)) {
      fieldErrors.push(`${field.label} is required.`);
    }

    // Length validation (100 character limit for all fields except textarea)
    if (!isEmpty(value) && field.type !== 'textarea' && !isValidLength(value)) {
      fieldErrors.push(`${field.label} must be less than 100 characters.`);
    }

    // Field-specific validations
    if (!isEmpty(value)) {
      switch (field.type) {
        case 'tel':
          if (field.id === 'contactNo' && !isValidPhone(value)) {
            fieldErrors.push('Contact number must be a valid 10-digit Indian mobile number.');
          }
          break;

        case 'email':
          if (!isValidEmail(value)) {
            fieldErrors.push('Please enter a valid email address.');
          }
          break;

        case 'number':
          if (!isValidNumber(value)) {
            fieldErrors.push(`${field.label} must be a valid number.`);
          } else {
            const num = parseFloat(value);
            if (field.id === 'weight' && !isValidWeightRange(num)) {
              fieldErrors.push('Weight must be a positive number between 0.1 and 500 kg.');
            } else if (field.id === 'age' && !isValidAgeRange(num)) {
              fieldErrors.push('Age must be between 0 and 150 years.');
            } else {
              if (num < 0) {
                fieldErrors.push(`${field.label} cannot be negative.`);
              }
              // Add large number check as a warning, not an error
              if (field.step !== '0.1' && num > 999999) {
                warnings.push(`${field.label} (${value}) seems unusually large. Please verify the value.`);
              }
            }
          }
          break;

        case 'date':
          if (!isValidDate(value)) {
            fieldErrors.push(`${field.label} must be a valid date and not in the future.`);
          } else if (field.id === 'childDob') {
            const birthDate = new Date(value);
            const now = new Date();
            const ageInYears = (now.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
            if (ageInYears > 18) {
              warnings.push('Child seems to be over 18 years old, please verify the date of birth.');
            }
          }
          break;

        case 'text':
           if (['motherMaId', 'childId', 'villageName'].includes(field.id)) {
              // Specific validation for these IDs is handled in cross-field validation
           } else if (field.id.toLowerCase().includes('name') && !['icdsCentreName', 'healthCentreName'].includes(field.id)) {
            if (!isValidName(value)) {
              fieldErrors.push(`${field.label} must be at least 2 characters and contain valid characters (letters, spaces, ' - .).`);
            }
          } else if (!isValidAlphaNumeric(value)) {
            fieldErrors.push(`${field.label} contains invalid characters.`);
          }
          break;

        case 'select':
          if (field.options && !field.options.includes(value)) {
            fieldErrors.push(`Please select a valid option for ${field.label}.`);
          }
          break;

        case 'textarea':
          if (String(value).length > 500) {
            fieldErrors.push(`${field.label} must be less than 500 characters.`);
          }
          break;
      }
    }

    if (fieldErrors.length > 0) {
      errors[field.id] = fieldErrors;
    }
  });

  // --- Cross-field validations based on form type ---
  if (normalizedId) {
    // MatriMa ID and Child ID format validation
    const matriMaId = formData.motherMaId;
    if (matriMaId && !/^[A-Z0-9]{8,20}$/.test(matriMaId)) {
        errors.motherMaId = [...(errors.motherMaId || []), 'Matri Ma ID must be 8-20 uppercase letters and numbers.'];
    }
    const childId = formData.childId;
    if (childId && !/^[A-Z0-9]{6,15}$/.test(childId)) {
        errors.childId = [...(errors.childId || []), 'Child ID must be 6-15 uppercase letters and numbers.'];
    }

    // Anemic Girls specific validations
    if (normalizedId === 'anemic-girls') {
      const age = parseInt(formData.age, 10);
      const dob = formData.childDob;
      if (formData.age && (age < 10 || age > 19)) {
        errors.age = [...(errors.age || []), 'Age should be between 10-19 years for adolescent girls.'];
      }
      if (formData.age && dob && isValidDate(dob)) {
          const birthDate = new Date(dob);
          const now = new Date();
          let calculatedAge = now.getFullYear() - birthDate.getFullYear();
          const m = now.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
              calculatedAge--;
          }
          if (calculatedAge !== age) {
              errors.age = [...(errors.age || []), 'Age does not match the provided Date of Birth.'];
          }
      }
    }

    // Toilet Facilities specific validations
    if (normalizedId === 'toilet-facilities') {
      const householdsWithToilets = parseInt(formData.householdsWithToilets, 10) || 0;
      const householdsUsingToilets = parseInt(formData.householdsUsingToilets, 10) || 0;
      const usableToilets = parseInt(formData.usableToilets, 10) || 0;
      
      if (householdsUsingToilets > householdsWithToilets) {
        errors.householdsUsingToilets = [...(errors.householdsUsingToilets || []), 'Cannot exceed total households with toilets.'];
      }
      if (usableToilets > householdsWithToilets) {
         errors.usableToilets = [...(errors.usableToilets || []), 'Cannot exceed total households with toilets.'];
      }
      if (householdsUsingToilets > usableToilets) {
         errors.householdsUsingToilets = [...(errors.householdsUsingToilets || []), 'Cannot exceed the number of usable toilets.'];
      }
    }
  }

  // --- Final Centre validations ---
  if (config.fields.some(f => f.id === 'icdsCentreName') && formData.icdsCentreName && !formData.icdsCentreId) {
    errors.icdsCentreName = [...(errors.icdsCentreName || []), 'Please select a valid ICDS Centre from the list.'];
  }
  if (config.fields.some(f => f.id === 'healthCentreName') && formData.healthCentreName && !formData.healthCentreId) {
    errors.healthCentreName = [...(errors.healthCentreName || []), 'Please select a valid Health Centre from the list.'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    errorCount: Object.keys(errors).length,
    warningCount: warnings.length,
  };
};

/**
 * A usage example wrapper for the main validation function.
 * @returns `true` if the form is valid, `false` otherwise.
 */
export const handleFormValidation = (
  formData: FormData,
  config: FormConfig,
  normalizedId: string | null
): boolean => {
  const validation = validateForm(formData, config, normalizedId);
  
  if (!validation.isValid) {
    console.warn('Validation Errors:', validation.errors);
    return false;
  }
  
  if (validation.warnings.length > 0) {
    console.info('Validation Warnings:', validation.warnings);
  }
  
  return true;
};