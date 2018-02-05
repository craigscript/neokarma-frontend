import { Component, OnInit, Inject } from "@angular/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { TdMediaService } from "@covalent/core";

@Component({
	templateUrl: "./webhook-target.dialog.html"
})
export class MentionWebhookTargetDialog implements OnInit
{
	url: string;

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<MentionWebhookTargetDialog>,
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
			type: 'webhook',
			options: {
				url: this.url
			}
		};
		this.dialogRef.close(target);
	}
}
