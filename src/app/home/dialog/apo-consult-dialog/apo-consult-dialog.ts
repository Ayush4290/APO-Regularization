import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../common/shared-module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApoService } from '../../../services/apo-service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-apo-consult-dialog',
  imports: [SharedModule],
  templateUrl: './apo-consult-dialog.html',
  styleUrl: './apo-consult-dialog.css'
})
export class ApoConsultDialog implements OnInit {
  consultForm: FormGroup;
  departments: any[] = [];
  reasons: any[] = [];
  constructor(private fb: FormBuilder, private apoService: ApoService, public dialogRef: MatDialogRef<ApoConsultDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.consultForm = this.fb.group({
      consults: this.fb.array([])
    });
  }

  get consults(): FormArray {
    return this.consultForm.get('consults') as FormArray;
  }

  ngOnInit(): void {
    this.addMoreConsult();
  }

  addMoreConsult() {
    const itemGroup = this.fb.group({
      department: ['', [Validators.required]],
      reason: ['', [Validators.required]],
    });
    this.consults.push(itemGroup);
  }

  onCancelClick(): void {
    this.dialogRef.close({
      status: false
    });
  }

  onSubmit(): void {
    if (this.consultForm.valid) {
      let body: any[] = [];
      this.dialogRef.close({
        status: false
      });
    } else {
      this.consultForm.markAllAsTouched()
    }
  }
}
