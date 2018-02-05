import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'neo-trackers-source-filter-dialog',
	templateUrl: './filter.dialog.html',
	styleUrls: ['./filter.dialog.scss'],
})
export class TrackersSourceFilterDialog
{
	FilterMap: any = {};
	SelectableFilters: any[] = [];

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<TrackersSourceFilterDialog>
	)
	{
		this.FilterMap = data;
		this.SelectableFilters = Object.keys(data);
	}

	ngOnInit()
	{

	}

	createFilter(filter)
	{
		console.log("Creating filter:", filter);
		this.dialogRef.close(filter);
		// let dialogRef = this.dialog.open(selectedFilter.Component);
		// //	dialogRef.componentInstance.getDescriptor()
		// 	dialogRef.afterClosed().subscribe(result => {

		// });
	}
}
