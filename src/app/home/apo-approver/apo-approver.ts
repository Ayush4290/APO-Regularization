import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApoService } from '../../services/apo-service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../../common/shared-module';
import { AddAttachmentDialog } from '../dialog/add-attachment-dialog/add-attachment-dialog';
import { ApoMessageDialog } from '../dialog/apo-message-dialog/apo-message-dialog';
import { EnumRequestType, EnumRole, EnumStatus } from '../../common/enums';
import { ShowAttachmentDialog } from '../dialog/show-attachment-dialog/show-attachment-dialog';
import { constants } from '../../common/constants';
import { ApoHistoryAttachments } from "../common/apo-history-attachments/apo-history-attachments";
import { ApoInformationDialog } from '../dialog/apo-information-dialog/apo-information-dialog';
import { ApoConsultDialog } from '../dialog/apo-consult-dialog/apo-consult-dialog';

@Component({
  selector: 'app-apo-approver',
  imports: [SharedModule, ApoHistoryAttachments],
  providers: [DatePipe],
  templateUrl: './apo-approver.html',
  styleUrl: './apo-approver.css'
})
export class ApoApprover implements OnInit {
  orderNo: any = '';
  submitted = false;
  apoForm!: FormGroup;
  postlist: any[] = [];
  headlist: any[] = [];
  isPersonnel: boolean = false;
  dateTimeMax: Date = new Date;
  personnelDetail: any;
  allData: any;
  enumRole: any = EnumRole;
  enumStatus: any = EnumStatus;
  roleId: any;
  userId: any;
  constructor(private fb: FormBuilder, private apoService: ApoService, private ngZone: NgZone,
    public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.roleId = sessionStorage.getItem('roleId');
    this.userId = sessionStorage.getItem('userId');
    this.initiateForm();

    this.route.queryParamMap.subscribe(async (params) => {
      await this.getApoByOrderNoAsync({ orderNo: params.get('apoNo'), createdBy: this.userId });
    });
  }

  initiateForm() {
    this.apoForm = this.fb.group({
      orderNo: ['', [Validators.required]],
      personnelId: ['', [Validators.required]],
      personnelName: [''],
      department: [''],
      nameOfService: [''],
      apoOrderNumber: ['', [Validators.required]],
      apoOrderDate: ['', [Validators.required]],
      apoDate: ['', [Validators.required]],
      postingOrderNumber: ['', [Validators.required]],
      postingOrderDate: ['', [Validators.required]],
      joiningDate: ['', [Validators.required]],
      previousPost: ['', [Validators.required]],
      newPost: ['', [Validators.required]],
      apoDuration: ['', [Validators.required]],
      apoHeadquarters: ['', [Validators.required]],
      apoReasonDetails: ['', [Validators.required]],
      additionalComments: ['', [Validators.required]],
      otherDocument: ['']
    });
  }

  get fc() {
    return this.apoForm.controls;
  }
  getAttachedDocument(files: any[], type: any): any {
    if (files.length > 0) {
      return files?.filter(x => x.fileCd == type)?.map(y => y.fileId);
    }
  }

  async getApoByOrderNoAsync(body: any) {
    await this.apoService.getApoByOrderNoAsync(body).then((result: any) => {
      if (result.req) {
        console.log(JSON.stringify(result.req))
        this.apoForm.patchValue({
          orderNo: result.req.orderNo,
          personnelId: result.req.person.personId,
          personnelName: result.req.person.empName,
          department: result.req.person.dept,
          nameOfService: result.req.person.service,
          apoOrderNumber: result.req.apoOrderNo,
          apoOrderDate: this.datePipe.transform(result.req.orderDt, constants.dtFormat),
          apoDate: this.datePipe.transform(result.req.apoDt, constants.dtFormat),
          postingOrderNumber: result.req.posOrderNo,
          postingOrderDate: this.datePipe.transform(result.req.posOrderDt, constants.dtFormat),
          joiningDate: this.datePipe.transform(result.req.joiningDt, constants.dtFormat),
          previousPost: result.req.prevPost.postName,
          newPost: result.req.newPost.postName,
          apoDuration: result.req.apoDurtn,
          apoHeadquarters: result.req.headquarter.hqName,
          apoReasonDetails: result.req.apoRsn,
          additionalComments: result.req.comments.commentDesc,
          otherDocument: this.getAttachedDocument(result.req.files, 'A'),
        });
      }
    });
  }

  addAttachmentDialog(type: any): void {
    let noOfFiles = this.apoForm.value.otherDocument?.length ?? 0;
    const dialogRef = this.dialog.open(AddAttachmentDialog, {
      disableClose: true,
      width: '1000px',
      data: {
        type: type,
        noOfFiles: noOfFiles
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.status) {
        this.ngZone.run(() => {
          let otherDocument = this.apoForm.value.otherDocument;
          if (otherDocument != null && otherDocument?.length > 0) {
            this.apoForm.patchValue({
              otherDocument: [...otherDocument, ...result.files]
            })
          } else {
            this.apoForm.patchValue({
              otherDocument: result.files
            })
          };
        });
        this.updateApoAsync(EnumStatus.SUBMITTED);
      }
    });
  }

  async showAttachmentDialog(type: any) {
    let fileIds = this.apoForm.value.otherDocument;
    await this.apoService.getApoDocAsync({ "fileIds": fileIds, "createdBy": this.userId }).then(res => {
      if (res?.files) {
        const dialogRef = this.dialog.open(ShowAttachmentDialog, {
          disableClose: true,
          width: '900px',
          data: {
            type: type,
            files: res.files
          }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          if (result.status) {
            this.apoForm.patchValue({
              otherDocument: result.files
            });
            this.updateApoAsync(EnumStatus.SUBMITTED);
          }
        });
      }
    });
  }

  onReturn(enumStatus: EnumStatus): void {
    this.submitted = true;
    if (this.apoForm.valid) {
      const dialogRef = this.dialog.open(ApoMessageDialog, {
        disableClose: true,
        width: '500px',
        data: {
          isClose: false,
          title: 'Return Application',
          message: 'Are you sure you want to return this application?',
          leftbtntext: 'Cancel',
          rightbtntext: 'Yes, Return'
        }
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result == 'yes') {
          await this.updateApoAsync(enumStatus, result);
        }
      });
    } else {
      this.apoForm.markAllAsTouched();
    }
  }

  onReject(enumStatus: EnumStatus): void {
    this.submitted = true;
    if (this.apoForm.valid) {
      const dialogRef = this.dialog.open(ApoMessageDialog, {
        disableClose: true,
        width: '500px',
        data: {
          isClose: false,
          title: 'Reject Application',
          message: 'Are you sure you want to reject this application?',
          leftbtntext: 'Cancel',
          rightbtntext: 'Yes, Reject'
        }
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result == 'yes') {
          await this.updateApoAsync(enumStatus, result);
        }
      });
    } else {
      this.apoForm.markAllAsTouched();
    }
  }

  onApprove(enumStatus: EnumStatus): void {
        this.submitted = true;
    if (this.apoForm.valid) {
      const dialogRef = this.dialog.open(ApoMessageDialog, {
        disableClose: true,
        width: '500px',
        data: {
          isClose: false,
          title: 'Approve Application',
          message: 'Are you sure you want to approve this application?',
          leftbtntext: 'Cancel',
          rightbtntext: 'Yes, Approve'
        }
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result == 'yes') {
          await this.updateApoAsync(enumStatus, result);
        }
      });
    } else {
      this.apoForm.markAllAsTouched();
    }
  }

  onConsult(enumStatus: EnumStatus): void {
    this.submitted = true;
    if (this.apoForm.valid) {
      const dialogRef = this.dialog.open(ApoConsultDialog, {
        disableClose: true,
        width: '900px',
        data: {
        }
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result == 'yes') {
        }
      });
    } else {
      this.apoForm.markAllAsTouched();
    }
  }

  async updateApoAsync(enumStatus: EnumStatus, dialogMsg: any = null) {
    let body = {
      "orderNo": this.apoForm.value.orderNo,
      "statusId": enumStatus,
      "updatedBy": this.userId,
      "addFiles": this.apoForm.value.otherDocument,
      "comments": this.apoForm.value.additionalComments
    }

    await this.apoService.updateApoAsync(body).then(result => {
      if (result.status == 'UPDATED') {
        this.submitted = false;
        if (dialogMsg == 'yes') {
          if (enumStatus == EnumStatus.SUBMITTED || enumStatus == EnumStatus.APPROVED) {
            this.router.navigate(['/home/request-message'], {
              queryParams: { typeId: EnumRequestType.Success },
            });
          } else {
            this.onBack();
          }
        }
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/home/apo-orders']);
  }
}