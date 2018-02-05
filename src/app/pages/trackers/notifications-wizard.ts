import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router";
import { TdMediaService } from "@covalent/core";
import { MdDialog } from "@angular/material";
import { Alert, Request, User } from "../../services";
import { NotificationRuleMap } from "./notifications/rules/rulemap";
import { NotificationTargetMap } from "./notifications/targets/targetmap";
import { TrackersNotificationConditionDialog } from "./dialogs/notification-condition.dialog";
import { TrackersNotificationTargetDialog } from "./dialogs/notification-target.dialog";
import * as moment from 'moment-timezone';
// import { Timezones } from "../../config";

@Component({
	selector: 'neo-trackers-notifications-wizard',
	templateUrl: './notifications-wizard.html',
	styleUrls: ['./notifications-wizard.scss'],
})
export class TrackersNotificationsWizard implements OnInit
{

	loadingTracker = true;

	days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	intervals = ['Instant', 'Hourly', '6 hours', '12 hours', 'Daily', '3 days', 'Weekly', 'Biweekly', 'Monthly'];

	hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

	userTimezone: any;
	timezones = [];

	tracker: any = {
		triggerOptions: {
			days: [0, 1, 2, 3, 4, 5, 6],
			hours: this.hours,
			// get timezone offset
			timezona: moment.tz(this.userTimezone).format("Z"),
			interval: 0,
		},
		rules: [],
	};


	trackerId: any = null;

	constructor(
		public media: TdMediaService,
		private titleService: Title,
		public dialog: MdDialog,
		public user: User,
		public router: Router,
		public route: ActivatedRoute,
		private alert: Alert,
		private request: Request,
	)
	{
		// for(let i=-12;i<=14;++i)
		// {
		// 	this.timezones.push(i);
		// }

		this.route.params.subscribe((params) => {
				console.log("params:", params);
			this.trackerId = params.trackerId;
			if(this.trackerId)
			{
				this.getNotificationTracker();
			}
		});
	}

	ngOnInit()
	{
		this.titleService.setTitle( 'Trackers Notifications Wizard' );
		// get timezones
		this.timezones = moment.tz.names();
		// get user timezone
		this.userTimezone = moment.tz.guess();
	}

	getNotificationTracker()
	{
		this.loadingTracker = true;
		this.request.get("/notificationtrackers/getTracker/" + this.trackerId).then( response => {
			this.loadingTracker = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
				console.log(response.tracker);
				this.tracker = response.tracker;
			//	this.rules = response.tracker.rules;
			//	this.targets = response.tracker.targets;
		});
	}

	saveNotificationTracker()
	{
		this.loadingTracker = true;
		this.request.post("/notificationtrackers/updateTracker/" + this.trackerId, {
			rules: this.tracker.rules,
			targets: this.tracker.targets,
			triggerOptions: this.tracker.triggerOptions
		}).then( response => {
			this.loadingTracker = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.alert.success("Notification Settings saved.");
		});
	}


	addRule()
	{
		let conditionDialog = this.dialog.open(TrackersNotificationConditionDialog, {
			data: NotificationRuleMap,
		});

		conditionDialog.afterClosed().subscribe(condition => {
			if(!condition)
				return;

			this.tracker.rules.push({
				options: {},
				method: condition,
			});
		//	this.saveNotificationTracker();
		});
	}

	deleteRule(ruleIndex)
	{
		let confirmDialog = this.alert.confirm("Delete rule?", "Are you sure you want to delete this rule?");

		confirmDialog.afterClosed().subscribe( result => {
			if(!result)
				return;
			console.log("deleting rule:", ruleIndex);
			this.tracker.rules.splice(ruleIndex, 1);
		});

	}

	addTarget()
	{
		let targetDialog = this.dialog.open(TrackersNotificationTargetDialog, {
			data: NotificationTargetMap,
		});

		targetDialog.afterClosed().subscribe(target => {
			if(!target)
				return;
			this.tracker.targets.push({
				options: {},
				type: target,
			});
		//	this.saveNotificationTracker();
		});
	}

	deleteTarget(targetIndex)
	{
		let confirmDialog = this.alert.confirm("Delete Target?", "Are you sure you want to delete this target?");

		confirmDialog.afterClosed().subscribe( result => {
			if(!result)
				return;
			console.log("deleting target:", targetIndex);
			this.tracker.targets.splice(targetIndex, 1);
		});
	}
	// toggleNotification()
	// {

	// }

	// testNotification()
	// {

	// }

	// saveTargets()
	// {
	// 	this.request.post("/notificationtrackers/updateTracker/" + this.trackerId, {
	// 		tracker: {
	// 		//	targets: this.targets
	// 		}
	// 	}).then( response =>
	// 		{
	// 			if (!response.success)
	// 			{
	// 				this.alert.error(response.message);
	// 			}
	// 		});
	// }

	getTimeZoneData()
	{
		let today = new Date();
		return (today.getTimezoneOffset() / 60) * -1;
	}
}
