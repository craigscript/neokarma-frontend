import { Component, OnInit, Inject, Injector, Input, Output} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './user.filter.html',
})
export class UserFilterDialog
{
	User: any[] = [];
	Mode: boolean = true; // True: Include, False: Exclude

  	constructor(
		@Inject(MD_DIALOG_DATA)
	    public data:any, 
	   public media: TdMediaService, public dialogRef: MdDialogRef<UserFilterDialog>)
	{
		this.User = data.user;
		this.Mode = data.mode || true;
	}

	ngOnInit()
	{
	}

	toggleInclude()
	{
		this.Mode = !this.Mode;
		console.log("this Mode:", this.Mode);
	}
	
	saveFilter()
	{
		console.log({
			user: this.User,
			mode: this.Mode,
		});
		this.dialogRef.close({
			user: this.User,
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