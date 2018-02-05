import { Component, OnInit, Inject, Injector, Input, Output} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './word.filter.html',
})
export class WordFilterDialog
{
	Words: any[] = [];
	Mode: string = "";

  	constructor(
		@Inject(MD_DIALOG_DATA)
	    public data:any, 
	   public media: TdMediaService, public dialogRef: MdDialogRef<WordFilterDialog>)
	{
		this.Words = data.words;
		this.Mode = data.mode;
	}

	ngOnInit()
	{
	}

	saveFilter()
	{
		this.dialogRef.close({
			words: this.Words,
			mode: this.Mode,
		});
	}
	
	generateFilterProperty(): any
	{
		
	}

	getDescriptor()
	{
		
	}
}