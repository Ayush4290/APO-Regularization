import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Resolve } from '@angular/router';
import { ApoService } from '../apo-service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolver implements Resolve<any> {
  constructor(private apoService: ApoService, @Inject(PLATFORM_ID) private platformId: Object) {
  }
  async resolve(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      let body = {
        'createdBy': sessionStorage.getItem('userId'),
        'roleId': sessionStorage.getItem('roleId')
      };
      return await this.apoService.getDashboardAsync(body);
    }
  }
}
