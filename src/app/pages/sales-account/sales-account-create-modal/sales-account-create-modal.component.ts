import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service';


@Component({
  selector: 'app-sales-account-create-modal',
  templateUrl: './sales-account-create-modal.component.html',
  styleUrls: ['./sales-account-create-modal.component.scss']
})
export class SalesAccountCreateModalComponent implements OnInit {
  btnStatus: boolean = false;
  createSalesAccountForm: FormGroup;
  authToken = localStorage.getItem('token');
  clients: any[] = []
  public min = new Date()
  filteredClients: any[] = []
  projects: any[] = []
  clientByVendor: any[] = [];
  filteredProjectsByClient: any[] = [];
  vendors = [];
  filteredVendors:any;
  
  constructor(
    private dialogRef: MatDialogRef<SalesAccountCreateModalComponent>,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
    private fb: FormBuilder,
  ) { 
    this.getVendors();
    // this.getClients();
    this.createSalesAccountForm = this.fb.group({
      "salesAccountName": [''],
      "vendor_id":[''],
      "client_id":[''],
      // "is_active":true,
    })
  }

  ngOnInit() {
  }
  add() {
    this.btnStatus = true;
    let body = {
        "name": this.createSalesAccountForm.value.salesAccountName,
        "vendor_id":this.createSalesAccountForm.value.vendor_id,
        "client_id":this.createSalesAccountForm.value.client_id,
        "is_active":true
    };
   
    this.btnStatus = false;
    this.serverService.createSalesAccount(body, this.authToken).subscribe(
        data => {
            this.btnStatus = false;
            this.dialogRef.close(data);
            this.clipBoardService.showMessgeInText("Sales Account Added Succesfully", "success-snackbar");
        },
        err => {
            this.clipBoardService.checkServerError(err, this.authToken)
            this.btnStatus = false;
        }
    )
}
getVendors() {
  this.serverService.vendorsList(this.authToken).subscribe(
      data => {
          this.filteredVendors = data;
      },
      err => {
          this.clipBoardService.checkServerError(err, this.authToken)
      }
  )
}
changeByClient(vendor) {
  let body = {
    "vendor_id":vendor.value
  }
  this.serverService.getClientsByVendor(body,this.authToken).subscribe(
      data => {
          this.clients = data.clients
          this.filteredClients = data.clients;
      },
      err => {
          this.clipBoardService.checkServerError(err, this.authToken)
      }
  )
}

  close() {
    this.dialogRef.close();
}
}
