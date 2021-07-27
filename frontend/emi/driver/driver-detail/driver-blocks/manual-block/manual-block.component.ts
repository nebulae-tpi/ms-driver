import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AbstractControl } from '@angular/forms';


import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';

@Component({
// tslint:disable-next-line: component-selector
  selector: 'manual-block-dialog.component',
  templateUrl: './manual-block.component.html',
  styleUrls: ['./manual-block.component.scss']
})
export class ManualBlockDialogComponent implements OnInit {

  manualBlockForm: any;
  blockTypes = [
    { key: 'BREACH_SERVICE', duration: 1000 * 60 * 60 * 24 }, // 24 HOURS
    { key: 'BREACH_AGREEMENT', duration: 1000 * 60 * 60 * 5 },
    { key: 'DOORMAN_COMPLAINT', duration: 1000 * 60 * 60 * 2 },
    { key: 'BAD_DISCIPLINARY_BEHAVIOR_QR5', duration: 1000 * 60 * 60 * 6 },
    { key: 'STOLEN_SERVICE', duration: 1000 * 60 * 60 * 6 },   
    { key: 'MECHANICAL_PROBLEMS', duration: 1000 * 60 * 60 * 1 }, 
    // { key: 'OTHER', duration: 1000 * 60 * 60 * 2 },
    // { key: 'NON_PAYMENT', duration: undefined },
  ];
  forbidddenBlockKeys = [];
  mode: string;
  block: any;

  constructor(
    private dialogRef: MatDialogRef<ManualBlockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log('forbidddenBlockKeys ==>', data.forbidddenBlockKeys);
      this.forbidddenBlockKeys = data.forbidddenBlockKeys;
      this.mode = data.mode;
      this.block = data.block;
  }

  ngOnInit() {
    console.log('MANUAL BLOCK DIALOG COMPONENT ON NG_ON_INIT');
    this.manualBlockForm = new FormGroup({
      block: new FormControl(null, [Validators.required, this.validateBlock.bind(this) ]),
      duration: new FormControl(0),
      comment: new FormControl(''),
    });
  }

  validateBlock(control: AbstractControl) {
    if (control.value && this.forbidddenBlockKeys.includes(control.value.key)){
      return { blockExist: true };
    }
    return null;
  }

  pushButton(okButton: Boolean) {
    if (okButton) {
      const rawValueForm = this.manualBlockForm.getRawValue();
      const response = {
        key: rawValueForm.block.key,
        startTime: Date.now(),
        endTime: Date.now() + rawValueForm.block.duration,
        notes: rawValueForm.comment
      };
      this.dialogRef.close(response);
    } else {
      this.dialogRef.close(false);
    }
  }

}
