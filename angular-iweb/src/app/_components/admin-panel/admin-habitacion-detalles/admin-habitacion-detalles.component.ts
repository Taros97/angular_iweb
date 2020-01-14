import { Component, OnInit, ViewChildren } from '@angular/core';
import { Habitacion } from '@/_models';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HabitacionService } from '@/_services';
import { NgbCarouselConfig, NgbSlideEvent, NgbCarousel, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@/_services';
import { HABITACIONES } from '@/_mockups';


function ObtenerVistas(habitaciones: Habitacion[]){
  var aux: string[] = [];
  for(let habitacion of habitaciones){
    if(!aux.includes(habitacion.vistas)){
      aux.push(habitacion.vistas);
    }
  }
  var vistas: Vista[] = [];
  vistas.push({value: '', viewValue: 'Todas'})
  for(let vista of aux){
    vistas.push({value: vista, viewValue: vista});
  }
  return vistas;
}

interface Vista {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-admin-habitacion-detalles',
  templateUrl: './admin-habitacion-detalles.component.html',
  styleUrls: ['./admin-habitacion-detalles.component.css'],
  providers: [HabitacionService, DecimalPipe, NgbCarouselConfig]
})
export class AdminHabitacionDetallesComponent implements OnInit {
  habitacion: Habitacion
  images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/900/500`);

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  submitted = false;
  habitacionForm: FormGroup;
  habitaciones: Habitacion[] = HABITACIONES;
  vistas: Vista[];
  @ViewChildren('carousel') carousel: NgbCarousel;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: HabitacionService,
    config: NgbCarouselConfig,
    private alertService: AlertService,
    private locate: Location) {
    config.interval = 3000;
  }

  ngOnInit() {
    var id;
    this.route.params.subscribe(params => {
      id = params['id'];
    });
    this.habitacion = this.service.getHabitacion(parseInt(id));
    this.habitacionForm = this.formBuilder.group({
      descripcion: [this.habitacion.descripcion, Validators.required],
      plazas: [this.habitacion.plazas, Validators.required],
      vistas: [this.habitacion.vistas, Validators.required],
      superficie: [this.habitacion.superficie, Validators.required],
      precio: [this.habitacion.precio, Validators.required],
      categoria: [this.habitacion.categoria, Validators.required],
      wifi: [this.habitacion.wifi, Validators.required],
    });
    this.vistas = ObtenerVistas(this.habitaciones);
  }

  get f() { return this.habitacionForm.controls; }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

  goBack() {
    this.locate.back();
  }

  onSubmit() {

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.habitacionForm.invalid) {
      return;
    }

    console.log(this.habitacionForm.value)
  }
}
