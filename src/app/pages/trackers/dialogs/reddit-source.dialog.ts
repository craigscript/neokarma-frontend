import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'neo-trackers-reddit-source-dialog',
	templateUrl: './reddit-source.dialog.html',
	styleUrls: ['./reddit-source.dialog.scss'],
})
export class TrackersRedditSourceDialog
{
	name: string = "";
	target: any = {};
	options: any = {};
	extracts: any[] = [
		{
			name: "Number of Posts",
			value: "posts",
		},
		{
			name: "Number of Comments",
			value: "comments",
		},
		{
			name: "Number of Submissions",
			value: "submissions",
		},
		{
			name: "Number of Active Users",
			value: "users",
		},
		{
			name: "Total Up Votes",
			value: "upvotes",
		},
		{
			name: "Total Down Votes",
			value: "downvotes",
		},
		{
			name: "Total Votes",
			value: "votes",
		},
		{
			name: "Total Score",
			value: "score",
		},
		{
			name: "Sentiment Score",
			value: "sentiment",
		},

	];

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<TrackersRedditSourceDialog>
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
