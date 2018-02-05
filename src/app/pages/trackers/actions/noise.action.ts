import { Component, OnInit, Inject, Injector, Input, Output} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './noise.action.html',
})
export class NoiseActionDialog
{
	window: 1;

  	constructor(	
		@Inject(MD_DIALOG_DATA)
	    public data:any, 
	   public media: TdMediaService, public dialogRef: MdDialogRef<NoiseActionDialog>)
	{
		this.window = data.window || 1;
	}

	ngOnInit()
	{
	}

	saveAction()
	{
		this.dialogRef.close({
			window: this.window,
		});
	}

}