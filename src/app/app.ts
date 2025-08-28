import { Component, OnInit, signal } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { SharedModule } from './common/shared-module';
import { Spinner } from "./spinner/spinner";
import { CUSTOM_DATE_FORMATS } from './common/constants';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-root',
  imports: [
    SharedModule,
    Spinner,
    MatMomentDateModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }

  protected readonly title = signal('APO');
}

