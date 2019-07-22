
import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';


export const confirmarSenha: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const senha = control.get('password');
  const confirmarSenha = control.get('confirmPassword');

  return senha && confirmarSenha && senha.value !== confirmarSenha.value ? {'senhasNBatem': false} : null;
}
