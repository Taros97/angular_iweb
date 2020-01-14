import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }
        
        if(control.value.getFullYear() <= matchingControl.value.getFullYear()){
            if(control.value.getMonth() <= matchingControl.value.getMonth()){
                if(matchingControl.value.getMonth() >  control.value.getMonth()){
                    matchingControl.setErrors(null);
                }else if(control.value.getDay() <= matchingControl.value.getDay()){
                    matchingControl.setErrors(null);
                }else{
                    matchingControl.setErrors({ mustMatch: true });
                }
            }else{
                matchingControl.setErrors({ mustMatch: true });
            }
        }else{
            matchingControl.setErrors({ mustMatch: true });
        }
    }
}

// custom validator to check that two fields match
export function MustSelector(controlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];

        if(control.value === 'Habitación o sala'){
            control.setErrors({ mustSelector: true });
        }else if(control.value.startsWith('Habitación') || control.value.startsWith('Sala')){
            control.setErrors(null);
        }else{
            control.setErrors({ mustSelector: true });
        }
    }
}