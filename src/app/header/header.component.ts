import { Component, OnInit, HostListener, HostBinding, Inject } from "@angular/core";
import { trigger, state, transition, style, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('fade',
      [
        state('void', style({ opacity: 0 })),
        transition(':enter', [animate(300)]),
        transition(':leave', [animate(500)]),
      ]
    )]
})
export class HeaderComponent implements OnInit {
  isFixed;
  selected: any
  cities: any[] = []
  showSubmit: boolean = true
  authToken: string = localStorage.getItem("token")
  constructor(
    private router: Router,
    private serverService: ServerService,
    @Inject(DOCUMENT) document) {
  }
  ngOnInit() {
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset > 50) {
      let element = document.getElementById('home-header');
      element.classList.add('header-fixed');
    } else {
      let element = document.getElementById('home-header');
      element.classList.remove('header-fixed');
    }
  }

  select1(item) {
    // this.router.navigate(['location/' + item])
    this.selected = item;
  }
  
  @HostBinding("class.menu-opened") menuOpened = false;

  toggleMenu() {
    this.menuOpened = !this.menuOpened
  }

  ScrollIntoView(elem: string) {
    document.querySelector(elem).scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.menuOpened = false;
  }

  buyNow() {
    window.open('#');
  }
}
