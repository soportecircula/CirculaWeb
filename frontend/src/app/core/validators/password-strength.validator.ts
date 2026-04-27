import { AbstractControl, ValidationErrors } from '@angular/forms';

const SPECIAL_CHARS = /[!@#$%^&*()\-_=+\[\]{};:'",.<>?\/\\|`~]/;

export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const val: string = control.value ?? '';
  const errors: ValidationErrors = {};
  if (!/[A-Z]/.test(val)) errors['noUpperCase'] = true;
  if (!SPECIAL_CHARS.test(val)) errors['noSpecialChar'] = true;
  return Object.keys(errors).length ? errors : null;
}
