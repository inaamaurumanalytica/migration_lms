import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { ClipBoardService } from '../services/clipboard.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  termsAndConditions:string =""
  public dummyElem = document.createElement('DIV');
  constructor(
    private router: Router,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService
  ) { }

  ngOnInit() {
    this.getTermsAndCond()
  }

  getTermsAndCond() {
    this.serverService.getPolicyByTANDC("").subscribe(
      data => {
        this.termsAndConditions = data._body
      },
      err => {
        this.clipBoardService.checkServerError(err, "")
      }
    )
  }

  decode(termsAndConditions) {
    var ret: string = "";
    this.dummyElem.innerHTML = termsAndConditions;
    document.body.appendChild(this.dummyElem);
    ret = this.dummyElem.textContent; // just grap the decoded string which contains the desired HTML tags
    document.body.removeChild(this.dummyElem);
    return ret;
  }
}

