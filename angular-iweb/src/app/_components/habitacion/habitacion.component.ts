import { Component, OnInit, ViewChildren } from '@angular/core';
import { Habitacion } from '@/_models';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HabitacionService } from '@/_services/habitacion.service';
import { NgbCarouselConfig, NgbSlideEvent, NgbCarousel, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe, Location } from '@angular/common';

@Component({
  selector: 'app-habitacion',
  templateUrl: './habitacion.component.html',
  styleUrls: ['./habitacion.component.css'],
  providers: [HabitacionService, DecimalPipe, NgbCarouselConfig]
})
export class HabitacionComponent implements OnInit {
  habitacion : Habitacion = new Habitacion();
  images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/900/500`);
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;

  @ViewChildren('carousel') carousel: NgbCarousel;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: HabitacionService,
    config: NgbCarouselConfig,
    private locate: Location) {
      config.interval = 3000;
     }

  ngOnInit() {
    var id;
    this.route.params.subscribe(params => {
      id = params['id']; 
   });
   this.service.getHabitacion(parseInt(id)).subscribe(h =>{
    this.habitacion=h;
  });
  }

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

  goBack(){
    this.locate.back();
  }
}
