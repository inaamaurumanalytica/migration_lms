import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  ScrollIntoView(elem: string) {
    document.querySelector(elem).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  privacy(){
    window.open('privacy', '_blank','width=600,height=500')
  }
  terms(){
    window.open('terms-condition', '_blank','width=600,height=500')
  }
  refund(){
    window.open('refund', '_blank','width=600,height=500')
  }

}
