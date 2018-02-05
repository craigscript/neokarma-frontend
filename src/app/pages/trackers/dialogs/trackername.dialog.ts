import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'neo-trackers-trackername-dialog',
	templateUrl: './trackername.dialog.html',
	styleUrls: ['./trackername.dialog.scss'],
})
export class TrackersTrackerNameDialog
{
	Name: string = "";

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<TrackersTrackerNameDialog>
	)
	{
		if (data.tracker)
		{
			this.Name = data.tracker.name;
		}
	}

	ngOnInit()
	{

	}

	saveName()
	{
		this.dialogRef.close(this.Name);
	}
}
