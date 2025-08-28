import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../common/shared-module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApoService } from '../../services/apo-service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { constants } from '../../common/constants';
import { ApoHistoryAttachments } from "../common/apo-history-attachments/apo-history-attachments";

@Component({
  selector: 'app-apo-status',
  imports: [SharedModule, ApoHistoryAttachments],
  providers: [DatePipe],
  templateUrl: './apo-status.html',
  styleUrl: './apo-status.css'
})
export class ApoStatus implements OnInit {
  apoForm!: FormGroup;
  postlist: any[] = [];
  headlist: any[] = [];
  allData: any;
  roleId: any;
  userId: any;
  constructor(private fb: FormBuilder, private apoService: ApoService,
    public dialog: MatDialog, private route: ActivatedRoute, private datePipe: DatePipe) {
  }
  ngOnInit(): void {
    this.roleId = sessionStorage.getItem('roleId');
    this.userId = sessionStorage.getItem('userId');
    this.apoForm = this.fb.group({
      personnelId: [''],
      personnelName: [''],
      department: [''],
      nameOfService: [''],
      apoOrderNumber: [''],
      apoOrderDate: [''],
      apoDate: [''],
      postingOrderNumber: [''],
      postingOrderDate: [''],
      joiningDate: [''],
      previousPost: [''],
      newPost: [''],
      apoDuration: [''],
      apoHeadquarters: [''],
      apoReasonDetails: [''],
    })
    this.getPostAsync();
    this.getHeadAsync();
    this.route.queryParamMap.subscribe((params) => {
      this.getApoByOrderNoAsync({ orderNo: params.get('apoNo'), createdBy: this.userId })
    });
  }

  async getPostAsync() {
    await this.apoService.getPostAsync().then(result => {
      this.postlist = result;
    });
  }

  async getHeadAsync() {
    await this.apoService.getHeadAsync().then(result => {
      this.headlist = result;
    });
  }

  async getApoByOrderNoAsync(body: any) {
    await this.apoService.getApoByOrderNoAsync(body).then(result => {
      if (result.req != null) {
        this.apoForm.patchValue({
          personnelId: result.req.person.personId,
          personnelName: result.req.person.empName,
          department: result.req.person.dept,
          nameOfService: result.req.person.service,
          apoOrderNumber: result.req.apoOrderNo,
          apoOrderDate: this.datePipe.transform(result.req.orderDt, constants.dtFormat),
          apoDate: this.datePipe.transform(result.req.apoDt,  constants.dtFormat),
          postingOrderNumber: result.req.posOrderNo,
          postingOrderDate: this.datePipe.transform(result.req.posOrderDt,  constants.dtFormat),
          joiningDate: this.datePipe.transform(result.req.joiningDt,  constants.dtFormat),
          previousPost: result.req.prevPost.postName,
          newPost: result.req.newPost.postName,
          apoDuration: result.req.apoDurtn,
          apoHeadquarters: result.req.headquarter.hqName,
          apoReasonDetails: result.req.apoRsn
        });
      }
    });
  }
}