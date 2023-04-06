import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Router } from '@angular/router';
import { ClipBoardService } from '../../../services/clipboard.service'
@Component({
    selector: 'vendor-info-modal',
    templateUrl: './vendor-info-modal.component.html',
    styleUrls: ['./vendor-info-modal.component.scss']
})
export class VendorInfoModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    vendor: any = {}
    displayedColumns: string[] = ['position', 'id', 'name'];
    displayedColumns1: string[] = ['position', 'id', 'name'];
    displayedColumns2: string[] = ['position', 'id', 'name'];
    constructor(
        private router: Router,
        private clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<VendorInfoModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.vendor = data
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

    viewProject(element) {
        if (!element.disable) {
            localStorage.setItem("projectInfo", JSON.stringify(element))
            this.clipBoardService.select('/page/project')
            this.clipBoardService.isActive('/page/project')
            this.router.navigate(["/page/project/leads"])
            this.dialogRef.close()
        } else {
            this.clipBoardService.showMessgeInText("Project is disable, Cannot show", "error-snackbar")
        }
    }

    viewUser(element) {
        //console.log(element)
        this.clipBoardService.userName = element.name
        this.clipBoardService.select('/page/users')
        this.clipBoardService.isActive('/page/users')
        this.router.navigate(["/page/users"])
        this.dialogRef.close()
    }
    viewVendor(element) {
        //console.log(element)
        this.clipBoardService.vendorName = element.name
        this.clipBoardService.select('/page/vendors')
        this.clipBoardService.isActive('/page/vendors')
        this.router.navigate(["/page/vendors"])
        this.dialogRef.close()
    }
}

