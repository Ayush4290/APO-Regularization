import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApoHistoryAttachments } from './apo-history-attachments';

describe('ApoHistoryAttachments', () => {
  let component: ApoHistoryAttachments;
  let fixture: ComponentFixture<ApoHistoryAttachments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApoHistoryAttachments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApoHistoryAttachments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
