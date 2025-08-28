import { Component, Inject, OnInit } from '@angular/core';
import { ApoService } from '../../../services/apo-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../common/shared-module';

@Component({
  selector: 'app-show-attachment-dialog',
  imports: [SharedModule],
  templateUrl: './show-attachment-dialog.html',
  styleUrl: './show-attachment-dialog.css'
})
export class ShowAttachmentDialog implements OnInit {
  status: boolean = false;
  title: any = 'Additional Documents'
  files: any[] = [];
  userId: any;
  roleId: any;
  constructor(private apoService: ApoService, public dialogRef: MatDialogRef<ShowAttachmentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  async ngOnInit() {
    this.userId = sessionStorage.getItem('userId');
    this.roleId = sessionStorage.getItem('roleId');
    if (this.data.type == 'AO') {
      this.title = 'APO Document';
    } else if (this.data.type == 'PO') {
      this.title = 'Posting Document';
    } else if (this.data.type == 'JO') {
      this.title = 'Joining Document';
    }
    this.files = this.data.files;
  }

  onCancelClick(): void {
    this.dialogRef.close({
      status: this.status, // after delete button implement then set true
      type: this.data.type,
      files: this.files.map((x: any) => x.fileId)
    });
  }

  async deleteAttach(id: any) {
    let fileIds = [id]
    await this.apoService.deleteApoDocAsync({ "fileIds": fileIds, "createdBy": this.userId }).then(res => {
      if (res.message == 'Data Deleted') {
        this.status = true;
        this.files = this.files.filter((x: any) => x.fileId !== id);
      }
    });
  }
}
