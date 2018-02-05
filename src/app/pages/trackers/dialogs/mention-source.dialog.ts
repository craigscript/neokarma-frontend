import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Request, Alert } from "../../../services";

@Component({
	templateUrl: './mention-source.dialog.html',
	styleUrls: ['./mention-source.dialog.scss'],
})
export class TrackersMentionSourceDialog
{
	name = "";
	target: any = {};
	options: any = {};
	trackers: any[] = [];
	loadingTrackers = true;
	extracts: any[] = [
		{
			name: "Number of Posts with Mentions",
			value: "posts",
		},
		{
			name: "Total Number of Mentions",
			value: "mentions",
		},
		{
			name: "Sentiment Score",
			value: "sentiment",
		},
	];

	tooltips = [
		'Number of Posts with Mentions: Lorem ipsum dolor sit amet.',
		'Total Number of Mentions: Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
		'Sentiment Score: Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
	];

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<TrackersMentionSourceDialog>,
		public request: Request,
		public alert: Alert
	)
	{
		this.name = data.name;
		this.target = data.target;
		if(!data.options)
		{
			this.options = {};
		} else {
			this.options = data.options;
		}
	}

	ngOnInit()
	{
		this.loadingTrackers = true;
		this.request.get("/mentions/getTrackers").then( response => {
			this.loadingTrackers = false;
			if(!response.success)
			{
				this.alert.error(response.message);
				return this.dialogRef.close(null);
			}
			this.trackers = response.trackers;
		});
	}

	Save()
	{
		this.dialogRef.close({
			name: this.name,
			target: this.target,
			options: this.options
		});
	}
}
