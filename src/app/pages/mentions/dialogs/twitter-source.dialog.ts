import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Request, Alert } from "../../../services/";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
	selector: 'neo-mention-twitter-source-dialog',
	templateUrl: './twitter-source.dialog.html',
	styleUrls: ['./twitter-source.dialog.scss'],
})
export class MentionTwitterSourceDialog implements OnInit
{
	target = {};
	options = {};

	topicCtrl: FormControl;
	topics = [];
	filteredTopics = [];

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<MentionTwitterSourceDialog>,
		public request: Request,
		public alert: Alert
	)
	{
		this.target = data.target;
		this.options = data.options;

		this.topicCtrl = new FormControl();
		
    	this.updatefilter();
	}
	
	updatefilter()
	{
		this.topicCtrl.valueChanges.startWith(null).subscribe((value) => {
			this.filteredTopics = this.topics.filter( topic => {
				if(!value || value.length == 0 || topic.startsWith(value))
					return true;
			});
		});
		
	}

	ngOnInit()
	{
		this.request.get("/sources/getSourceOptions/twitter").then( response => {
			console.log(response);
			if(!response.success)
				return this.alert.error(response.message);
			this.topics = response.topics.map(topic => topic.toLowerCase());
			this.updatefilter();
		});
	}

	Save()
	{
		this.dialogRef.close(Object.assign({}, {
			target: this.target,
			options: this.options
		}));
	}
}
