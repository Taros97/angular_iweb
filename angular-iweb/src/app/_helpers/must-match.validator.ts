import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const fechaInicio = formGroup.controls[controlName];
        const fechaFinal = formGroup.controls[matchingControlName];

        if (fechaFinal.errors && !fechaFinal.errors.mustMatch) {
            // return if another validator has already found an error on the fechaFinal
            return;
        }

        if(fechaInicio.value.getFullYear() <= fechaFinal.value.getFullYear()){
            if(fechaInicio.value.getMonth() <= fechaFinal.value.getMonth()){
                if(fechaFinal.value.getMonth() >  fechaInicio.value.getMonth()){
                    fechaFinal.setErrors(null);
                }else if(fechaInicio.value.getDate() <= fechaFinal.value.getDate()){
                    fechaFinal.setErrors(null);
                }else{
                    fechaFinal.setErrors({ mustMatch: true });
                }
            }else{
                fechaFinal.setErrors({ mustMatch: true });
            }
        }else{
            fechaFinal.setErrors({ mustMatch: true });
        }
    }
}

// custom validator to check that two fields match
export function MustSelector(controlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        
        if(control.value === 'Habitación o sala'){
            //console.log('Habitacion o sala')
            control.setErrors({ mustSelector: true });
        }else if(control.value.startsWith('Habitación') || control.value.startsWith('Sala')){
            //console.log('startsWith Habitación o startsWith Sala')
            control.setErrors(null);
        }else{
            //console.log('error inesperado')
            control.setErrors({ mustSelector: true });
        }
    }
}