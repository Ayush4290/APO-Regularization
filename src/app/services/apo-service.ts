import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ApoService {
  constructor(private http: HttpClient) {
  }

  async getPostAsync(): Promise<any> {
    try {
      return await this.http.get<any>(`${environment.apoUrl}/api/master/post`).toPromise();
    } catch (error) {
      throw new Error(`Failed to fetch post details: ${this.handleError(error)}`);
    }
  }

  async getStatusAsync(): Promise<any> {
    try {
      return await this.http.get<any>(`${environment.apoUrl}/api/master/status`).toPromise();
    } catch (error) {
      throw new Error(`Failed to fetch status details: ${this.handleError(error)}`);
    }
  }

  async getHeadAsync(): Promise<any> {
    try {
      return await this.http.get<any>(`${environment.apoUrl}/api/master/hq`).toPromise();
    } catch (error) {
      throw new Error(`Failed to fetch status details: ${this.handleError(error)}`);
    }
  }

  async getPersonnelByIdAsync(id: any): Promise<any> {
    try {
      return await this.http.get<any>(`${environment.apoUrl}/api/master/emp/${id}`).toPromise();
    } catch (error) {
      throw new Error(`Failed to fetch status details: ${this.handleError(error)}`);
    }
  }

  async getDashboardAsync(body: any): Promise<any> {
    try {
      return await this.http.post(`${environment.apoUrl}/api/dashboard/getall`, body).toPromise();
    } catch (error) {
      throw new Error(`Failed to get dashboard: ${this.handleError(error)}`);
    }
  }

  async createApoDocAsync(body: any): Promise<any> {
    try {
      return await this.http.post<any>(`${environment.apoUrl}/api/apo-docs`, body).toPromise();;
    } catch (error) {
      throw new Error(`Failed to create: ${this.handleError(error)}`);
    }
  }

  async getApoDocAsync(body: any): Promise<any> {
    try {
      return await this.http.get(`${environment.apoUrl}/api/apo-docs?fileIds=${body.fileIds}&createdBy=${body.createdBy}`).toPromise();
    } catch (error) {
      throw new Error(`Failed to create: ${this.handleError(error)}`);
    }
  }

  async deleteApoDocAsync(body: any): Promise<any> {
    try {
      return await this.http.delete<any>(`${environment.apoUrl}/api/apo-docs`, body).toPromise();;
    } catch (error) {
      throw new Error(`Failed to create: ${this.handleError(error)}`);
    }
  }

  async createApoAsync(body: any): Promise<any> {
    try {
      return await this.http.post<any>(`${environment.apoUrl}/api/apo-orders`, body).toPromise();;
    } catch (error) {
      throw new Error(`Failed to create: ${this.handleError(error)}`);
    }
  }

  async updateApoAsync(body: any): Promise<any> {
    try {
      return await this.http.put<any>(`${environment.apoUrl}/api/apo-orders`, body).toPromise();
    } catch (error) {
      throw new Error(`Failed to update with ID ${body.id}: ${this.handleError(error)}`);
    }
  }

  async genApoAsync(): Promise<any> {
    try {
      return await this.http.get<any>(`${environment.apoUrl}/api/apo-orders/apoid`).toPromise();
    } catch (error) {
      throw new Error(`Failed to fetch status details: ${this.handleError(error)}`);
    }
  }

  async getApoByOrderNoAsync(body: any): Promise<any> {
    try {
      return await this.http.get<any>(`${environment.apoUrl}/api/apo-orders?orderNo=${body.orderNo}&createdBy=${body.createdBy}`).toPromise();
    } catch (error) {
      throw new Error(`Failed to fetch status details: ${this.handleError(error)}`);
    }
  }

  private handleError(error: any): string {
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        return `Client-side error: ${error.error.message}`;
      } else {
        return `Server-side error: ${error.status} - ${error.message || error.statusText}`;
      }
    } else if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred.';
  }
}