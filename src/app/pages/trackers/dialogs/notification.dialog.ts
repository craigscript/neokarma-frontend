import { Component, OnInit, Inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from "@angular/material";
import { Alert, Request } from "../../../services";

@Component({
	templateUrl: './notification.dialog.html',
})
export class TrackersNotificationDialog
{
	tracker: any;

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<TrackersNotificationDialog>,
		private router: Router,
		private alert: Alert,
		private request: Request,
	)
	{

	}

	ngOnInit()
	{
		this.tracker = this.data.tracker;
	}

	saveNotification()
	{
		if(this.tracker.name.length > 0)
		{
			this.dialogRef.close(this.tracker);
		}
	}
}
