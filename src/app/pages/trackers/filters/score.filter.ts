import { Component, OnInit, Inject, Injector, Input, Output} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './score.filter.html',
})
export class ScoreFilterDialog
{
	Min: number = -10;
	Max: number = 10;

  	constructor(
		@Inject(MD_DIALOG_DATA)
	    public data:any, 
	   public media: TdMediaService, public dialogRef: MdDialogRef<ScoreFilterDialog>)
	{
		this.Min = data.min;
		this.Max = data.max;
	}

	ngOnInit()
	{
	}

	saveFilter()
	{
		this.dialogRef.close({
			min: this.Min,
			max: this.Max,
		});
	}
	
	generateFilterProperty(): any
	{
		
	}

	getDescriptor()
	{
		
	}
}