import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import BadWordsFilter from 'bad-words';

export interface ValidationWarnings {
    [key: string]: any;
}

export interface AbstractControlWithWarning extends AbstractControl {
    warnings: ValidationWarnings | null;
}

export class FormValidators {
    /**
     * @description
     * Validator that check password and confirm password are same.
     * Set 'confirmPasswordNotMatch' as error if validation fails.
     */
    static ConfirmPasswordValidator(controlName: string = 'password', matchingControlName: string = 'confirmPassword'): ValidatorFn | any {
        return (formGroup: FormGroup): ValidationErrors | any => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.confirmPasswordNotMatch) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmPasswordNotMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
            return;
        };
    }

    /**
     * @description
     * Validator that check old password and new password are different.
     * Set 'match' as error if validation fails.
     */
    static ChangePasswordValidator(controlName: string, matchingControlName: string): ValidatorFn | any {
        return (formGroup: FormGroup): ValidationErrors | any => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.match) {
                return;
            }
            if (control.value === matchingControl.value) {
                matchingControl.setErrors({ match: true });
            } else {
                matchingControl.setErrors(null);
            }
            return;
        };
    }

    /**
     * @description
     * Validator that check if FormArray has required(parameter 'minLength') length.
     * Set 'minlength' as error if validation fails.
     */
    static FormArrayMinLengthValidator(minLength: number): ValidatorFn | any {
        return (formArray: FormArray): ValidationErrors | any => {
            if (formArray.value.length >= minLength) return null;
            else return { minlength: true };
        };
    }

    /**
     * @description
     * Validator that check if FormArray has matching FormGroup control(parameter 'controlName').
     * Set 'duplicate' as error if validation fails.
     */
    static DuplicateValidator(controlName: string, isWarning: boolean = false): ValidatorFn | any {
        return (formArray: FormArray): ValidationErrors | any => {
            const allValues = (formArray.value as any[]).filter((_) => !!_[controlName]).map((_) => _[controlName]);
            formArray.controls.forEach((formGroup) => {
                const hasDuplicate =
                    allValues.filter((_) => _.trim().toLowerCase() == formGroup.value[controlName]?.trim().toLowerCase()).length > 1;
                if (isWarning) {
                    (formGroup.get(controlName) as AbstractControlWithWarning).warnings = hasDuplicate ? { duplicate: true } : null;
                } else {
                    formGroup.get(controlName)?.setErrors(hasDuplicate ? { duplicate: true } : null);
                }
            });
            return;
        };
    }

    /**
     * @description
     * Validator that check profanity of input.
     * Set 'profane' as error if validation fails.
     */
    static ProfaneValidator(): ValidatorFn | any {
        return (formControl: FormControl): ValidationErrors | any => {
            if (new BadWordsFilter().isProfane(formControl.value)) return { profane: true };
            else return null;
            // const control = formControl;
            // if (new BadWordsFilter().isProfane(control.value)) {
            //     control.setErrors({ profane: true });
            // } else {
            //     control.setErrors(null);
            // }
            // return;
        };
    }
}
