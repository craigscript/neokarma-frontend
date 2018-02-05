import { Component, OnInit, Inject, Injector, Input, Output} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './pixelize.action.html',
})
export class PixelizeActionDialog
{
	grid: 1;

  	constructor(	
		@Inject(MD_DIALOG_DATA)
	    public data:any, 
	   public media: TdMediaService, public dialogRef: MdDialogRef<PixelizeActionDialog>)
	{
		this.grid = data.grid || 1;
	}

	ngOnInit()
	{
	}

	saveAction()
	{
		this.dialogRef.close({
			grid: this.grid,
		});
	}

}