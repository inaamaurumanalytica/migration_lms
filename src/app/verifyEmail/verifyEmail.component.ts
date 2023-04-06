import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { ServerService } from '../services/server.service'

@Component({
  selector: 'app-verifyEmail',
  templateUrl: './verifyEmail.component.html',
  styleUrls: ['./verifyEmail.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  message: string = "";
  parameter: any = {};
  successMessage: boolean = false
  showContainer: boolean = false
  constructor(private router: Router,
    private serverService: ServerService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.parameter = params);
    this.verifyEmail();
  }

  verifyEmail() {
    this.serverService.verifyEmail(this.parameter).subscribe(
      data => {
        this.message = data.message;
        this.successMessage = true;
        this.showContainer = true;
      },
      err => {
        let msg = JSON.parse(err._body)
        this.message = msg.message;
        this.showContainer = true;
        
      }
    )
  }



}

