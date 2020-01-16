import { Component, OnInit, ViewChildren } from '@angular/core';
import { Sala } from '@/_models';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SalaService } from '@/_services';
import { NgbCarouselConfig, NgbSlideEvent, NgbCarousel, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe, Location } from '@angular/common';

@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css'],
  providers: [SalaService, DecimalPipe, NgbCarouselConfig]
})
export class SalaComponent implements OnInit {
  sala : Sala = new Sala()
  images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/900/500`);

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;

  @ViewChildren('carousel') carousel: NgbCarousel;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: SalaService,
    config: NgbCarouselConfig,
    private locate: Location) {
      config.interval = 3000;
     }

  ngOnInit() {
    var id;
    this.route.params.subscribe(params => {
      id = params['id']; 
   });
  this.service.getSala(parseInt(id)).subscribe(s =>{
    this.sala=s;
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
