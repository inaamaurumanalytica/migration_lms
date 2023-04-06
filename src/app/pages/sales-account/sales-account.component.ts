import { Component, OnInit } from '@angular/core';
import { ClipBoardService } from '../../services/clipboard.service';
import { ServerService } from '../../services/server.service';
import { SalesAccountCreateModalComponent } from './sales-account-create-modal/sales-account-create-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';
import { AssignUserComponent } from './assign-user/assign-user.component';
import { AssignProjectComponent } from './assign-project/assign-project.component';

@Component({
  selector: 'app-sales-account',
  templateUrl: './sales-account.component.html',
  styleUrls: ['./sales-account.component.scss']
})
export class SalesAccountComponent implements OnInit {
  showComponentLoader: boolean = false
  salesAccount:any;
  authToken = localStorage.getItem('token');
  totalCount:any;
  pageIndex: number = 0;
  pageSize: number = 50;
  elasticSearch: string = ""
  createdAt: any = ""
  updatedAt: any = "";
  userList:any[]=[];
  // vendor: any = {
  //   vendors: [],
  //   pagination: {}
  // }
  salesAccountCreateModalComponent: MatDialogRef<SalesAccountCreateModalComponent>
  assignUserComponent:MatDialogRef<AssignUserComponent>
  assignProjectComponent:MatDialogRef<AssignProjectComponent>
  constructor(
    private clipBoardService: ClipBoardService,
    private serverService: ServerService,
    private dialog: MatDialog,
   
  ) { 
    this.showComponentLoader = true
  }

  ngOnInit() {
    this.getAllSalesAccount();
    this.getFilteredUserList();
  }
  getAllSalesAccount() {
    let body = {
    }
    let url;
    if (this.elasticSearch.trim() != "") {
      body["name"] = this.elasticSearch
      url = 'sales_account?search='+body['name'];
    }
    else{
    url ='sales_account';
    } 
    this.serverService.getSalesAccountList(url,this.authToken).subscribe(
      data => {
        this.salesAccount = data;
        this.totalCount = data.pagination.total_count;
        // console.log(this.totalCount);
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }
  openCreateModal(){

      this.salesAccountCreateModalComponent = this.dialog.open(SalesAccountCreateModalComponent, {
        hasBackdrop: true,
        disableClose: false,
        autoFocus: true,
        width: '500px',
        panelClass: 'cdk-overlay-panel-right-side',
      });
      this.salesAccountCreateModalComponent.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getAllSalesAccount()
        }
      });
    }
  
  getNext(event) {
    this.showComponentLoader = true
    let body1 = {
      "per_page": event.pageSize,
      "page": event.pageIndex
    };
    //  console.log(body1);
    let body = {}
    this.pageSize = body1.per_page;
    this.pageIndex = body1.page
    let indexPage = this.pageIndex + 1
    if (this.elasticSearch.trim() != "") {
      body["name"] = this.elasticSearch
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body["created_at"] = [this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]];
    }
    if (this.updatedAt != undefined && this.updatedAt != "") {
      body["modified_at"] = [this.updatedAt.formatted.split(" - ")[0], this.updatedAt.formatted.split(" - ")[1]];
    }
    // this.pageIndex = 0;
    // this.pageSize = 50;
    this.showComponentLoader = true
    let url = "sales_account/?per_page=" + this.pageSize + "&page=" + indexPage;
    this.serverService.getSalesAccountList(url, this.authToken).subscribe(
      data => {
        this.salesAccount = data
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }
  getFilteredUserList(){

    this.serverService.usersList(this.authToken).subscribe(
      data => {
      data.users.filter((data)=>{
          if(data.role == "SalesAdmin")
          {
            this.userList.push(data);
          }
        })
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )

  }
  assignUser(user,event){
    let body={
      'user_id':event.value,
      'sales_account_id':user.id,
    }
    this.serverService.assignedUserOnSalesAccount(body,this.authToken).subscribe(
      data => {
        this.clipBoardService.showMessgeInText("User Assigned Succesfully", "success-snackbar");
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )

  }
  openAssignUserDialog(element) {
    this.assignUserComponent = this.dialog.open(AssignUserComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }

  openAssignProjectDialog(element) {
    this.assignProjectComponent = this.dialog.open(AssignProjectComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }
  

  removeSearch() {
    this.elasticSearch = ""
    this.clipBoardService.vendorName = ""
    this.getAllSalesAccount()
  }
  changeStatus(user,event){
    let body = {
      'name':user.name,
      'client_id':user.client_id,
      'vendor_id':user.vendor_id,
      'is_active':!user.is_active
    } 
    let status = body.is_active?"Enabled":"Disabled"
    this.serverService.updateSalesAccountStatus(user.id,body,this.authToken).subscribe((data)=>{
      this.clipBoardService.showMessgeInText("Status "+status+" Successfully", "success-snackbar");
      // this.getAllSalesAccount();

    },err =>{
      this.clipBoardService.checkServerError(err, this.authToken)
    })
  }

}
