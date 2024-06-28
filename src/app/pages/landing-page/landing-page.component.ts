import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { DomSanitizer } from '@angular/platform-browser';
import { interval } from 'rxjs/internal/observable/interval';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  animations: [
    trigger('fadeIn', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('in => out', [
        animate('1s')
      ]),
      transition('out => in', [
        animate('1s')
      ])
    ])
  ]


})

export class LandingPageComponent implements OnInit {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private bgImgs: Array<any>;
  private current = 1;
  currentImage;
  state = 'in';
  counter = 0;
  enableAnimation = false;

  constructor(private sanitize: DomSanitizer, private cdr: ChangeDetectorRef) {
    this.bgImgs = [
      '../../../assets/images/photos/pexels-ketut-subiyanto-4559959.jpg',
      '../../../assets/images/photos/pexels-anna-pou-8132472.jpg',
      '../../../assets/images/photos/pexels-starter-cam-2850860-4387718.jpg',
      '../../../assets/images/photos/pexels-shvets-production-8929273.jpg',
      '../../../assets/images/photos/pexels-arianne-cresta-corpuz-2868697-4402188.jpg',
      '../../../assets/images/photos/pexels-tstudio-34805588-8714475.jpg',
      '../../../assets/images/photos/pexels-brett-sayles-3990842.jpg',
      '../../../assets/images/photos/pexels-anna-pou-8133025.jpg',
      '../../../assets/images/photos/pexels-cottonbro-7520356.jpg',
      '../../../assets/images/photos/pexels-dudumatik-3916376.jpg',
      '../../../assets/images/photos/pexels-pixabay-164745.jpg',
      '../../../assets/images/photos/pexels-tima-miroshnichenko-6671716.jpg',
      '../../../assets/images/photos/pexels-romanp-35880.jpg',
      '../../../assets/images/photos/pexels-cottonbro-5650546.jpg',
      '../../../assets/images/photos/pexels-brett-sayles-2479312.jpg',
      '../../../assets/images/photos/pexels-dmitry-demidov-515774-3774606.jpg',
      '../../../assets/images/photos/pexels-rdne-8198629.jpg',
    ];
    this.bgImgs.forEach(img => {
      const image = new Image();
      image.src = img;
    });
    this.currentImage = this.sanitize.bypassSecurityTrustStyle(`url(${this.bgImgs[0]})`);
  }



  ngOnInit() {
    interval(4000)
      .subscribe((x) => {
        this.runAnimation();
      })
  }

  runAnimation() {
    this.enableAnimation = true;
    this.counter = 0;
    this.toggleState();
  }

  toggleImg() {
    this.currentImage = this.sanitize.bypassSecurityTrustStyle(`url(${this.bgImgs[this.current]})`);
    this.current = (this.current + 1) % this.bgImgs.length;
    this.cdr.detectChanges();  // Manually trigger change detection
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onDone($event: any) {
    if (this.enableAnimation) {
      if (this.counter === 1) {
        this.toggleImg();
      }
      this.toggleState();
    }
  }

  toggleState() {
    if (this.counter < 2) {
      this.state = this.state === 'in' ? 'out' : 'in';
      this.counter++;
    }
  }
}