import { Component, OnInit, Inject, Injector, Input, Output} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
	templateUrl: './sum.exporter.html',
})
export class SumExporterDialog
{
	Sources: any[] = [];

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialogRef: MdDialogRef<SumExporterDialog>
	)
	{
		this.Sources = data.sources || [];
	}

	ngOnInit()
	{

	}

	saveExporter()
	{
		this.dialogRef.close({
			sources: this.Sources
		});
	}
}
