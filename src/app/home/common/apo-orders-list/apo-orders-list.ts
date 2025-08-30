import { DatePipe } from '@angular/common';
import { AbstractType, AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SharedModule } from '../../../common/shared-module';
import { EnumRole, EnumStatus } from '../../../common/enums';
import { ApoService } from '../../../services/apo-service';
import { MatSort } from '@angular/material/sort';
import { PeriodicElement } from '../../../common/interfaces';
import { constants } from '../../../common/constants';

@Component({
  selector: 'app-apo-orders-list',
  imports: [SharedModule],
  providers: [DatePipe],
  templateUrl: './apo-orders-list.html',
  styleUrl: './apo-orders-list.css'
})
export class ApoOrdersList implements AfterViewInit, OnChanges, OnInit {

  // displayedColumns: string[] = ['#', 'orderNo', 'name', 'service', 'apoDt', 'posOrderDt', 'joiningDt', 'apoDurtn', 'aging', 'status', 'action'];
  displayedColumns: string[] = ['#', 'orderNo', 'name', 'service', 'apoDt', 'posOrderDt', 'joiningDt', 'apoDurtn', 'status', 'action'];

  dataSource = new MatTableDataSource<any>();

  @Input() data: any;
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;

  enumStatus: any = EnumStatus;
  constants: any = constants;
  roleId: any;
  userId: any;
  constructor(private router: Router, public datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.roleId = sessionStorage.getItem('roleId');
    this.userId = sessionStorage.getItem('userId');
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      if (changes) {
        this.dataSource.data = changes['data'].currentValue;
      }
    }, 200);
  }

  loadData() {
    setTimeout(() => {
      this.dataSource.data = []
      this.dataSource.data = this.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.sortingDataAccessor = (item, property) => {
        if (property === 'name') {
          return item.person.empName;
        }
        if (property === 'service') {
          return item.person.service;
        }
        if (property === 'status' || property === 'action') {
          return item.status.statusName;
        }
        return item[property];
      };

      //Based on column filter
      // this.dataSource.filterPredicate = this.filterPredicate();
    }, 200);
  }

  //Based on column filter
  // private filterColumn: string = '';
  // filterPredicate() {
  //   return (data: PeriodicElement, filter: string): boolean => {
  //     const searchTerms = JSON.parse(filter);
  //     const filterValue = searchTerms.filterValue.trim().toLowerCase();
  //     switch (this.filterColumn) {
  //       case 'orderNo':
  //         return data.orderNo.toLowerCase().includes(filterValue);
  //       case 'name':
  //         return data.person.empName.toLowerCase().includes(filterValue);
  //       case 'service':
  //         return data.person.service.toLowerCase().includes(filterValue);
  //       case 'apoDt':
  //         return data.apoDt.toDateString().toLowerCase().includes(filterValue);
  //       case 'posOrderDt':
  //         return data.posOrderDt.toDateString().toLowerCase().includes(filterValue);
  //       case 'joiningDt':
  //         return data.joiningDt.toDateString().toLowerCase().includes(filterValue);
  //       case 'apoDurtn':
  //         return data.apoDurtn.toLowerCase().includes(filterValue);
  //       default:
  //         const dataStr = JSON.stringify(data).toLowerCase();
  //         return dataStr.includes(filterValue);
  //     }
  //   };
  // }

  // applyFilter(event: Event, column: string) {
  //   this.filterColumn = column;
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = JSON.stringify({
  //     filterValue: filterValue,
  //     column: column
  //   });
  // }
  //End based on column filter

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteOrder(orderNo: string) {
  console.log("filter")
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


  goToAPO(orderNo: any, statusId: any) {
    if (statusId == EnumStatus.DRAFT) {
      this.router.navigate(['/home/apo-request'], {
        queryParams: { apoNo: orderNo },
      });
    }
    if (statusId == EnumStatus.PENDING) {
      if (this.roleId == EnumRole.APO) {
        this.router.navigate(['/home/apo-pending'], {
          queryParams: { apoNo: orderNo },
        });
      } else {
        this.router.navigate(['/home/apo-approver'], {
          queryParams: { apoNo: orderNo },
        });
      }
    } else if (statusId == EnumStatus.APPROVED || statusId == EnumStatus.RETURNED || statusId == EnumStatus.REJECTED || statusId == EnumStatus.SUBMITTED) {
      this.router.navigate(['/home/apo-status'], {
        queryParams: { apoNo: orderNo },
      });
    }
  }
}
