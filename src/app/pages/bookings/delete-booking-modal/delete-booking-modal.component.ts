import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-booking-modal',
  templateUrl: './delete-booking-modal.component.html',
  styleUrls: ['./delete-booking-modal.component.scss']
})
export class DeleteBookingModalComponent implements OnInit {
  dataSource: any;
  constructor(
    private dialogRef: MatDialogRef<DeleteBookingModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data) { }

  ngOnInit() {
    this.dataSource = this.data;
  }

  yes() {
    this.dialogRef.close("yes");
  }

  close() {
    this.dialogRef.close();
  }
}