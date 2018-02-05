import { Component, OnInit, Inject, Injector, Input, Output} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './lpf.action.html',
})
export class LPFActionDialog
{
	smoothing: 0.5;

  	constructor(
		@Inject(MD_DIALOG_DATA)
	    public data:any, 
	   public media: TdMediaService, public dialogRef: MdDialogRef<LPFActionDialog>)
	{
		this.smoothing = data.smoothing || 0.5;
	}

	ngOnInit()
	{
	}

	saveAction()
	{
		this.dialogRef.close({
			smoothing: this.smoothing,
		});
	}

}