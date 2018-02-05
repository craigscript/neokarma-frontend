import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
	templateUrl: './notification-target.dialog.html',
})
export class TrackersNotificationTargetDialog
{


	targets = [];

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<TrackersNotificationTargetDialog>
	)
	{
		this.targets = Object.keys(this.data);
	}

	getTarget(name)
	{
		return this.data[name];
	}

	createTarget(target)
	{
		this.dialogRef.close(target);
	}
}
