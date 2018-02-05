import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'neo-trackers-exporter-dialog',
	templateUrl: './exporter.dialog.html',
	styleUrls: ['./exporter.dialog.scss'],
})
export class TrackersExporterDialog
{
	ExporterMap: any = {};
	SelectableExporters: any[] = [];

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<TrackersExporterDialog>
	)
	{
		this.ExporterMap = data;
		this.SelectableExporters = Object.keys(data);
	}

	ngOnInit()
	{

	}

	createExporter(Exporter)
	{
		console.log("Creating Exporter:", Exporter);
		this.dialogRef.close(Exporter);
		// let dialogRef = this.dialog.open(selectedExporter.Component);
		// //	dialogRef.componentInstance.getDescriptor()
		// 	dialogRef.afterClosed().subscribe(result => {

		// });
	}
}
