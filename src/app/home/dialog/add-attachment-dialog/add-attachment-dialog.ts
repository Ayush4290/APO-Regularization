import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApoService } from '../../../services/apo-service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../../../common/shared-module';

@Component({
  selector: 'app-add-attachment-dialog',
  imports: [SharedModule, DragDropModule],
  templateUrl: './add-attachment-dialog.html',
  styleUrl: './add-attachment-dialog.css'
})
export class AddAttachmentDialog {
  docForm: FormGroup;
  errorMessage: string = ''
  constructor(private fb: FormBuilder, private apoService: ApoService, public dialogRef: MatDialogRef<AddAttachmentDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.docForm = this.fb.group({
      files: this.fb.array([])
    });
  }

  get files(): FormArray {
    return this.docForm.get('files') as FormArray;
  }

  onCancelClick(): void {
    this.dialogRef.close({
      status: false
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.docForm.valid) {
      let body: any[] = [];
      this.files.controls.forEach(element => {
        body.push(
          {
            fileName: element.value.fileName,
            fileType: element.value.fileType,
            fileContent: element.value.fileContent,
            fileDesc: element.value.fileDesc,
            fileCd: element.value.fileCd,
          }
        )
      });
      this.apoService.createApoDocAsync({ files: body, createdBy: sessionStorage.getItem('userId') }).then(res => {
        if (res.message == 'Success') {
          this.dialogRef.close(
            {
              status: true,
              type: this.data.type,
              files: res.fileIds
            }
          );
        }
      });
    } else {
      this.docForm.markAllAsTouched()
    }
  }

  onDrop(event: CdkDragDrop<string[]>) {
    console.log('Image was dropped!', event);
  }

  onFileSelected(event: any): void {
    this.errorMessage = '';
    let noOfFiles = this.data.noOfFiles + this.files.length;
    if (noOfFiles > 4) {
      this.errorMessage = 'Maximum 05 Files Upload.';
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Only JPEG,PNG,PDF files are allowed.';
        event.target.value = '';
        return;
      } else if (file.size > (2 * 1024 * 1024)) {
        this.errorMessage = 'File size exceeds 2MB. Please choose a smaller file.';
        event.target.value = '';
        return;
      } else if (this.files.controls.find((x: any) => x.fileName == file.name)) {
        this.errorMessage = 'Already you have choose a smaller file.';
        event.target.value = '';
        return;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          let base64 = reader.result?.toString().split(',')[1];
          const itemGroup = this.fb.group({
            fileName: [file.name, [Validators.required]],
            fileType: [file.type, [Validators.required]],
            fileSize: [file.size, [Validators.required]],
            fileContent: [base64, [Validators.required]],
            fileDesc: ['', [Validators.required]],
            fileCd: [this.data.type, [Validators.required]]
          });
          this.files.push(itemGroup);
        };
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };
        reader.readAsDataURL(file); // Or use readAsDataURL for images
      }
    } else {
      this.errorMessage = 'File is empty. Please choose a correct file.';
      event.target.value = '';
    }
  }

  removeFile(index: number) {
    this.files.removeAt(index);
  }
}

