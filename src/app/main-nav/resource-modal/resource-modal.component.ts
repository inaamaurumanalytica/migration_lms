import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resource-modal',
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.scss']
})
export class ResourceModalComponent implements OnInit {
  userInfo = JSON.parse(localStorage.getItem('userInfo'));
  constructor(
    public dialogRef: MatDialogRef<ResourceModalComponent>,
    public router:Router
  ) { }

  ngOnInit() {
  }
  cplCalculator(){
    this.dialogRef.close()
    window.open('/cpl-calculator', "_blank");
    // this.router.navigate(['/cpl-calculator'])
  }
}
