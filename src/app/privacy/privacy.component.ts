import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { ClipBoardService } from '../services/clipboard.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  privacyPolicy: string = ""
  public dummyElem = document.createElement('DIV');
  constructor(
    private router: Router,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService
  ) { }

  ngOnInit() {
    this.getPrivacyPolicy()
  }

  getPrivacyPolicy() {
    this.serverService.getPolicyByPP("").subscribe(
      data => {
        this.privacyPolicy = data._body
      },
      err => {
        this.clipBoardService.checkServerError(err, "")
      }
    )
  }

  decode(privacyPolicy) {
    var ret: string = "";

    this.dummyElem.innerHTML = privacyPolicy;
    document.body.appendChild(this.dummyElem);
    ret = this.dummyElem.textContent; // just grap the decoded string which contains the desired HTML tags
    document.body.removeChild(this.dummyElem);
    return ret;
  }
  backToHome() {
    localStorage.clear()
    this.router.navigate(["/"])
  }
}

