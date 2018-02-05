import { Component, OnInit, Inject, Injector, Input, Output} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './outliers.action.html',
})
export class OutliersActionDialog
{
	threshold: 0.5;

  	constructor(	
		@Inject(MD_DIALOG_DATA)
	    public data:any, 
	   public media: TdMediaService, public dialogRef: MdDialogRef<OutliersActionDialog>)
	{
		this.threshold = data.threshold || 0.5;
	}

	ngOnInit()
	{
	}

	saveAction()
	{
		this.dialogRef.close({
			threshold: this.threshold,
		});
	}

}