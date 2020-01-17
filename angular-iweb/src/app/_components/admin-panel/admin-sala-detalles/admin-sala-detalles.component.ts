import { Component, OnInit, ViewChildren } from '@angular/core';
import { Sala } from '@/_models';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SalaService, AdminSalasService } from '@/_services';
import { NgbCarouselConfig, NgbSlideEvent, NgbCarousel, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@/_services';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-admin-sala-detalles',
  templateUrl: './admin-sala-detalles.component.html',
  styleUrls: ['./admin-sala-detalles.component.css'],
  providers: [SalaService, DecimalPipe, NgbCarouselConfig]
})
export class AdminSalaDetallesComponent implements OnInit {
  sala: Sala = new Sala();
  images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/900/500`);

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  submitted = false;
  salaForm: FormGroup;


  @ViewChildren('carousel') carousel: NgbCarousel;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: AdminSalasService,
    config: NgbCarouselConfig,
    private alertService: AlertService,
    private locate: Location) {
    config.interval = 3000;
  }

  ngOnInit() {
    var id;
    this.route.params.subscribe(params => {
      //console.log(params)
      id = params['id'];
    });
    this.service.getSala(id).subscribe(data => {
      this.sala = data;
      this.salaForm = this.formBuilder.group({
        descripcion: [this.sala.descripcion, Validators.required],
        proyector: [this.sala.proyector, Validators.required],
        microfono: [this.sala.microfono, Validators.required],
        superficie: [this.sala.superficie, Validators.required],
        precio: [this.sala.precio, Validators.required],
        pizarra: [this.sala.pizarra, Validators.required],
        mesas: [this.sala.mesas, Validators.required],
        asientos: [this.sala.asientos, Validators.required],
      });
    });
    this.salaForm = this.formBuilder.group({
      descripcion: ['', Validators.required],
      proyector: ['', Validators.required],
      microfono: ['', Validators.required],
      superficie: ['', Validators.required],
      precio: ['', Validators.required],
      pizarra: ['', Validators.required],
      mesas: ['', Validators.required],
      asientos: ['', Validators.required],
    });
    //this.sala = this.service.getSala(parseInt(id));
  }

  get f() { return this.salaForm.controls; }

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

  editar() { 

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.salaForm.invalid) {
      return;
    }
    var salaUpdate : Sala = this.salaForm.value;
    salaUpdate.codigo = this.sala.codigo;
    this.service.updateSala(this.sala.codigo, salaUpdate).subscribe(data => {
      this.locate.back();
    });

    //console.log(this.salaForm.value)
  }
}
