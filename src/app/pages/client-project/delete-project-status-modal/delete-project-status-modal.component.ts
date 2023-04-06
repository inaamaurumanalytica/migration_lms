import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-project-status-modal',
  templateUrl: './delete-project-status-modal.component.html',
  styleUrls: ['./delete-project-status-modal.component.scss']
})
export class DeleteProjectStatusModalComponent implements OnInit {
  dataSource: any;
  constructor(
      private dialogRef: MatDialogRef<DeleteProjectStatusModalComponent>,
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