import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
	templateUrl: './notification-condition.dialog.html',
})
export class TrackersNotificationConditionDialog
{
	hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
	startInterval: string;
	endInterval: string;
	range: string;
	intervals = ['5 Min', '15 Mins', '30 Mins', '2 Hours', '4 Hours', '1 Day'];
	conditions = [];

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<TrackersNotificationConditionDialog>
	)
	{
		this.conditions = Object.keys(this.data);
	}

	getCondition(name)
	{
		return this.data[name];
	}

	createCondition(condition)
	{
		this.dialogRef.close(condition);
	}
}
