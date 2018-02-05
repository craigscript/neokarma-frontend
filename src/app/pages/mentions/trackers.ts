import { Component, OnInit, Input, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdLoadingService } from "@covalent/core";
import { MdDialog } from '@angular/material';
import { Request, Alert, User } from "../../services/";

@Component({
  selector: 'neo-mentions-trackers',
  templateUrl: './trackers.html',
  styleUrls: ['./trackers.scss'],
})
export class MentionsTrackersPage implements OnInit
{
	loadingTrackers: boolean = true;
	Trackers: any[] = [];
	inProgress = false;
	resetTrackers = false;

	constructor(
		public titleService: Title,
		private el:ElementRef,
		public request: Request,
		public alert: Alert,
		public user: User,
		public dialog: MdDialog
	)
	{

	}

	ngOnInit()
	{
		this.titleService.setTitle( 'Mentions Trackers & Words' );
		this.getTrackers();
	}

	getTrackers()
	{
		this.loadingTrackers = true;
		this.request.get("/mentions/getTrackers").then( response => {
			this.loadingTrackers = false;
			if (!response.success)
			{
				return this.alert.error(response.message);
			}
			this.Trackers = response.trackers;
			this.checkTrackers();
		});
	}

	deleteTracker(tracker)
	{
		let confirmation = this.alert.confirm("Confirm Delete", "Are you sure you want to delete this mention tracker?");

		confirmation.afterClosed().subscribe(result => {
			if (!result)
				return;

			let loading = this.alert.loading("Deleting tracker.");
			this.request.get("/mentions/deleteTracker/" + tracker._id).then( response => {
				loading.close();
				if (!response.success)
					return this.alert.error(response.message);

				this.alert.success("Tracker deleted");
				this.Trackers.splice(this.Trackers.indexOf(tracker), 1);
			});

		});
	}

	checkTrackers()
	{
		for (let tracker of this.Trackers)
		{
			if(tracker.inProgress)
			{
				this.inProgress = true;
			}
			if(tracker.resetTrackers)
			{
				this.resetTrackers = true;
			}
		}
	}
}
