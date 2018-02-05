import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'neo-trackers-source-action-dialog',
	templateUrl: './action.dialog.html',
	styleUrls: ['./action.dialog.scss'],
})
export class TrackersSourceActionDialog
{
	ActionMap: any = {};
	SelectableActions: any[] = [];

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<TrackersSourceActionDialog>
	)
	{
		this.ActionMap = data;
		this.SelectableActions = Object.keys(data);
	}

	ngOnInit()
	{

	}

	createAction(Action)
	{
		console.log("Creating Action:", Action);
		this.dialogRef.close(Action);
		// let dialogRef = this.dialog.open(selectedAction.Component);
		// //	dialogRef.componentInstance.getDescriptor()
		// 	dialogRef.afterClosed().subscribe(result => {

		// });
	}
}
