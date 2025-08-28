import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../common/shared-module';
import { DatePipe } from '@angular/common';
import { EnumStatus } from '../../../common/enums';

@Component({
  selector: 'app-apo-history-attachments',
  imports: [SharedModule],
  providers: [DatePipe],
  templateUrl: './apo-history-attachments.html',
  styleUrl: './apo-history-attachments.css'
})
export class ApoHistoryAttachments implements OnInit {
  title: any;
  files: any[] = [];
  history: any;
  @Input() data: any;
  constructor() {
  }

  ngOnInit(): void {
    this.files = this.data?.files;
    this.history = this.data?.history;
  }


  getStatusClass(id: any): string {
    switch (id) {
      case EnumStatus.DRAFT: return 'draft-button'
      case EnumStatus.PENDING: return 'pending-button';
      case EnumStatus.SUBMITTED: return 'submitted-button';
      case EnumStatus.REJECTED: return 'rejected-button';
      case EnumStatus.APPROVED: return 'approved-button';
      case EnumStatus.RETURNED: return 'returned-button';
      default: return 'responsed-button';
    }
  }
}
