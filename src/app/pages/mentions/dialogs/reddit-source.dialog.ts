import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Request, Alert } from "../../../services/";

@Component({
	selector: 'neo-mention-reddit-source-dialog',
	templateUrl: './reddit-source.dialog.html',
	styleUrls: ['./reddit-source.dialog.scss'],
})
export class MentionRedditSourceDialog
{
	target = {};
	options = {};

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<MentionRedditSourceDialog>,
		public request: Request,
		public alert: Alert
	)
	{
		this.target = data.target;
		this.options = data.options;
	}

	Save()
	{
		this.dialogRef.close(Object.assign({}, {
			target: this.target,
			options: this.options
		}));
	}
}
