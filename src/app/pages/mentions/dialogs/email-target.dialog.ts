import { Component, OnInit, Inject } from "@angular/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { TdMediaService } from "@covalent/core";

@Component({
	templateUrl: "./email-target.dialog.html"
})
export class MentionEmailTargetDialog implements OnInit
{
	email: string;

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<MentionEmailTargetDialog>,
		public media: TdMediaService,
	)
	{

	}

	ngOnInit()
	{

	}

	save()
	{
		let target = {
			type: 'email',
			options: {
				address: this.email
			}
		}
		this.dialogRef.close(target);
	}
}
