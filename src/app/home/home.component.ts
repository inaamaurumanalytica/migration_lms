import { Component, OnInit, HostListener, HostBinding, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldControl } from '@angular/material';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import { ClipBoardService } from '../services/clipboard.service';
import { DOCUMENT } from '@angular/common';
import { trigger, state, transition, style, animate } from '@angular/animations';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fade',
      [
        state('void', style({ opacity: 0 })),
        transition(':enter', [animate(300)]),
        transition(':leave', [animate(500)]),
      ]
    )]
})
export class HomeComponent implements OnInit {
  isFixed;
  selected: any
  contactForm: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
  ) {
    
   }

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      message: ['', Validators.required]
    })
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
}
