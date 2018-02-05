import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { TdMediaService } from "@covalent/core";
import { MdDialog } from "@angular/material";
import { Alert, Request } from "../../services";

import { TrackersNotificationDialog } from "./dialogs/notification.dialog";

@Component({
	templateUrl: './notifications.html',
	styleUrls: ['./notifications.scss'],
})
export class TrackersNotifications implements OnInit
{
	loading = false;
	trackers = [];

	constructor(
		public media: TdMediaService,
		private titleService: Title,
		public dialog: MdDialog,
		public router: Router,
		private alert: Alert,
		private request: Request,
	)
	{

	}

	ngOnInit()
	{
		this.titleService.setTitle( 'Trackers Notifications' );
		this.getNotificationTrackers();
	}

	getNotificationTrackers()
	{
		this.loading = true;
		this.request.get("/notificationtrackers/getTrackers").then( response => {
			
			this.loading = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.trackers = response.trackers;
		});
	}

	createNotificationTracker()
	{
		let createDialog = this.dialog.open(TrackersNotificationDialog, {
			data: {
				tracker: {
					name: "",
				}
			}
		});

		createDialog.afterClosed().subscribe( tracker => {
			if(!tracker)
				return;

			let loading = this.alert.loading("Creating Notification Tracker");

			this.request.post("/notificationtrackers/createTracker", tracker).then( response => {
				loading.close();

				if (!response.success)
				{
					return this.alert.error(response.message);
				}
				
				this.alert.success("Notification tracker has been created.");
				this.router.navigateByUrl("/app/trackers/notification-wizard/" + response.tracker._id);
			});
		});
	}

	editNotificationtracker(tracker)
	{
		let editDialog = this.dialog.open(TrackersNotificationDialog, {
			data: {
				tracker: Object.assign({}, tracker)
			}
		});

		editDialog.afterClosed().subscribe( result => {
			
			if(!result)
				return;

			let loading = this.alert.loading("Saving Notification Tracker");

			this.request.post("/notificationtrackers/updateTracker/" + tracker._id, result).then( response => {
				loading.close();

				if (!response.success)
				{
					return this.alert.error(response.message);
				}

				this.trackers[this.trackers.indexOf(tracker)] = Object.assign({}, result);
				
				this.alert.success("Notification tracker has been renamed.");

			});
		});
	}

	toggleStatus(tracker)
	{
		let newStatus = "Active";
		tracker.status == 'Active' ? newStatus = 'Inactive' : newStatus = 'Active';

		this.request.post("/notificationtrackers/updateTracker/" + tracker._id, {
			name: tracker.name,
			status: newStatus,
		}).then( response => {
			if (!response.success)
			{
				return this.alert.error(response.message);
			}
			tracker.status = newStatus;
			
		});
	}
	
	deleteNotificationTracker(tracker)
	{
		let confirmDialog = this.alert.confirm("Confirm delete", "Are you sue to delete this notification tracker?");
		confirmDialog.afterClosed().subscribe( result => {

			if(!result)
				return;

			let loading = this.alert.loading("Deleting tracker.");
			this.request.get("/notificationtrackers/deleteTracker/" + tracker._id).then( result => {
				
				loading.close();
				if(!result.success)
				{
					return this.alert.error(result.message);
				}

				this.trackers.splice(this.trackers.indexOf(tracker), 1);
			});
		});
	}
}
