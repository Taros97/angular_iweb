import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  formContactaConNosotros: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formContactaConNosotros = this.formBuilder.group({
      tratamiento: [''],
      nombre: [''],
      tema: [''],
      telefono: ['', [Validators.minLength(9), Validators.maxLength(9)]],
      mensaje: [''],
    })
  }

  onSubmit(){
    //console.log(this.formContactaConNosotros);
  }

}
