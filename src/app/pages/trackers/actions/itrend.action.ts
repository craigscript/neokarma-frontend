import { Component, OnInit, Inject, Injector, Input, Output} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './itrend.action.html',
})
export class ITrendActionDialog
{
	alpha: 0.5;

  	constructor(
		@Inject(MD_DIALOG_DATA)
	    public data:any, 
	   public media: TdMediaService, public dialogRef: MdDialogRef<ITrendActionDialog>)
	{
		this.alpha = data.alpha || 0.5;
		console.log("This. Alpha:", this.alpha);
	}

	ngOnInit()
	{
	}

	saveAction()
	{
		this.dialogRef.close({
			alpha: this.alpha,
		});
	}

}