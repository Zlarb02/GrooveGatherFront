import { animate, state, style, transition, trigger } from '@angular/animations';
// biome-ignore lint/style/useImportType: <explanation>
import { ChangeDetectorRef, Component, Input, ViewEncapsulation, type OnInit } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { DomSanitizer } from '@angular/platform-browser';
import Aos from 'aos';
import { interval } from 'rxjs/internal/observable/interval';
import { HeaderComponent } from '../../core/header/header.component';
import type { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  animations: [
    trigger('fadeIn', [
      state('in', style({ opacity: 0.8 })),
      state('out', style({ opacity: 0.8 })),
      transition('in => out', [
        animate('0.3s')
      ]),
      transition('out => in', [
        animate('0.3s')
      ])
    ])
  ],
  encapsulation: ViewEncapsulation.None


})

export class LandingPageComponent implements OnInit {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private bgImgs: Array<any>;
  private current = 1;
  currentImage;
  state = 'in';
  counter = 0;
  enableAnimation = false;

  @Input()
  user!: User;
  @Input()
  pageTitle!: string;

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
    // biome-ignore lint/complexity/noForEach: <explanation>
    this.bgImgs.forEach(img => {
      const image = new Image();
      image.src = img;
    });
    this.currentImage = this.sanitize.bypassSecurityTrustStyle(`url(${this.bgImgs[0]})`);
  }



  ngOnInit() {
    interval(3000)
      .subscribe((x) => {
        this.runAnimation();
      })
  }

  ngAfterViewInit() {
    Aos.init({
      offset: 90, // Ajuste l'offset selon tes besoins
      duration: 1000, // Durée de l'animation
      easing: 'ease', // Type d'animation
      once: true, // Si vrai, l'animation se déclenche une seule fois
      mirror: false, // Si vrai, l'animation se déclenche aussi lors du scroll vers le haut
    });
    setInterval(() => {
      Aos.refresh()
    }, 200);
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