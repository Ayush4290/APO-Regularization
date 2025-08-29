import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApoOrdersList } from "../common/apo-orders-list/apo-orders-list";
import { SharedModule } from '../../common/shared-module';
import { EnumRequestType, EnumRole, EnumStatus } from '../../common/enums';

@Component({
  selector: 'app-apo-orders',
  imports: [ApoOrdersList, SharedModule],
  templateUrl: './apo-orders.html',
  styleUrl: './apo-orders.css'
})
export class ApoOrders implements OnInit {
  allDataTemp: any[] = [];
  allData: any[] = [];
  allCount: number = 0;
  draftCount: number = 0;
  pendingCount: number = 0;
  returnedCount: number = 0;
  submittedCount: number = 0;
  rejectedCount: number = 0;
  approvedCount: number = 0;
  consultCount: number = 0;
  enumStatus: any = EnumStatus
  enumRole: any = EnumRole;
  roleId: any;
  activeTab: any = this.enumStatus.ALL;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.roleId = sessionStorage.getItem('roleId');
    let dashboardData: any = this.route.snapshot.data['dashboardData'];
    if (dashboardData && dashboardData?.length > 0) {
      setTimeout(() => {
        this.allDataTemp = this.allData = dashboardData;
        this.allCount = this.allData.length;
        this.draftCount = this.allData.filter((x: any) => x.status.statusId == EnumStatus.DRAFT).length;
        this.pendingCount = this.allData.filter((x: any) => x.status.statusId == EnumStatus.PENDING).length;
        this.returnedCount = this.allData.filter((x: any) => x.status.statusId == EnumStatus.RETURNED).length;
        this.submittedCount = this.allData.filter((x: any) => x.status.statusId == EnumStatus.SUBMITTED).length;
        this.rejectedCount = this.allData.filter((x: any) => x.status.statusId == EnumStatus.REJECTED).length;
        this.approvedCount = this.allData.filter((x: any) => x.status.statusId == EnumStatus.APPROVED).length;
        this.consultCount = this.allData.filter((x: any) => x.status.statusId == EnumStatus.CONSULT).length;
      }, 100);
    } else {
      this.router.navigate(['/home/request-message'], {
        queryParams: { typeId: EnumRequestType.New },
      });
    }
  }

  onTabChange(index: any): void {
     this.activeTab = index;

    if (index === EnumStatus.ALL) {
      this.allData = this.allDataTemp;
    } else if (index === EnumStatus.DRAFT) {
      this.allData = this.allDataTemp.filter((x: any) => x.status.statusId == EnumStatus.DRAFT);
    } else if (index === EnumStatus.SUBMITTED) {
      this.allData = this.allDataTemp.filter((x: any) => x.status.statusId == EnumStatus.SUBMITTED);
    } else if (index === EnumStatus.PENDING) {
      this.allData = this.allDataTemp.filter((x: any) => x.status.statusId == EnumStatus.PENDING);
    } else if (index === EnumStatus.RETURNED) {
      this.allData = this.allDataTemp.filter((x: any) => x.status.statusId == EnumStatus.RETURNED);
    } else if (index === EnumStatus.REJECTED) {
      this.allData = this.allDataTemp.filter((x: any) => x.status.statusId == EnumStatus.REJECTED);
    } else if (index === EnumStatus.APPROVED) {
      this.allData = this.allDataTemp.filter((x: any) => x.status.statusId == EnumStatus.APPROVED);
    } else if (index === EnumStatus.CONSULT) {
      this.allData = this.allDataTemp.filter((x: any) => x.status.statusId == EnumStatus.CONSULT);
    }
  }
}