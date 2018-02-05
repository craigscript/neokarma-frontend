import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from "@angular/router";
import { User, Request, Alert } from "../../services";
import { MdDialog } from '@angular/material';
import { TrackersTrackerNameDialog } from "./dialogs/trackername.dialog";

@Component({
	selector: 'neo-trackers-my-trackers',
	templateUrl: './my-trackers.html',
	styleUrls: ['./my-trackers.scss'],
})
export class TrackersMyTrackersPage implements OnInit
{
	loading = false;
	Trackers = [];

	constructor(
		private titleService: Title,
		public request: Request,
		public alert: Alert,
		public user: User,
		public router: Router,
		public dialog: MdDialog,
	)
	{

	}

	ngOnInit()
	{
		this.getTrackers();
		this.titleService.setTitle( 'Mentions Monitor' );
	}

	getTrackers()
	{
		this.loading = true;
		this.request.get("/trackers/getTrackers").then( response => {
			this.loading = false;
			if(!response.success)
			{
				return this.alert.open("Error", response.message);
			}
			this.Trackers = response.trackers;
		});
	}

	toggleTracker(tracker)
	{
		let loading = this.alert.loading("Updating tracker");

		console.log("Tracker status:", tracker.status);
		this.request.post("/trackers/updateTrackerStatus/" + tracker._id, {
			status: tracker.status,
		}).then( response => {
			loading.close();
			if(!response.success)
			{
				tracker.status = !tracker.status;
				return this.alert.open("Error", response.message);
			}
		});
	}

	deleteTracker(tracker)
	{
		let dialogRef = this.alert.confirm("Confirm Delete", "Are you sure you want to delete this tracker?");

		dialogRef.afterClosed().subscribe(result => {
			if(!result)
				return;
				
			let loading = this.alert.loading("Deleting tracker");
			this.request.get("/trackers/deleteTracker/" + tracker._id).then( response => {
				loading.close();
				if(!response.success)
				{
					return this.alert.open("Error", response.message);
				}
				this.Trackers.splice(this.Trackers.indexOf(tracker), 1);
			});
			
		});
	}

	addTracker(trackerInput)
	{
		let dialogRef = this.dialog.open(TrackersTrackerNameDialog, { data: {}});

		dialogRef.afterClosed().subscribe( newName => {
			if(!newName)
				return;

			let loading = this.alert.loading("Saving Tracker.");
			this.request.post("/trackers/createTracker", {
				name: newName,
			}).then( response => {
				loading.close();
				if(!response.success)
				{
					return this.alert.error(response.message);
				}
				//this.Trackers.push(response.tracker);
				this.router.navigateByUrl('/app/trackers/wizard/edit/' + response.tracker._id);
			});
		});
	}

	editTracker(tracker)
	{
		let dialogRef = this.dialog.open(TrackersTrackerNameDialog, {
			data: {
				tracker: tracker,
			}
		});

		dialogRef.afterClosed().subscribe( newName => {
			console.log("New Tracker Name:", newName);
			if(!newName)
				return;

			let loading = this.alert.loading("Saving Tracker.");
			this.request.post("/trackers/updateTracker/" + tracker._id, {
				name: newName,
			}).then( response => {
				loading.close();
				if(!response.success)
				{
					return this.alert.error(response.message);
				}
			});
		});
	}
}
