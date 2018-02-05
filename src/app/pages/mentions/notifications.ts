import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MdDialog } from "@angular/material";
import { MentionEmailTargetDialog, MentionSmsTargetDialog, MentionWebhookTargetDialog } from "./dialogs";

@Component({
	templateUrl: "./notifications.html",
	styleUrls: ["./notifications.scss"]
})
export class MentionsNotificationPage implements OnInit
{
	trackerId: any;
	days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	intervals = ['Immediate updates', 'Hourly', '6 hours', '12 hours', 'Daily', '3 days', 'Weekly', 'Biweekly', 'Monthly'];
	hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
	targets: any[] = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MdDialog,
	)
	{
		route.params.subscribe( params => {
			this.trackerId = params.trackerId;
		});
	}

	ngOnInit()
	{

	}

	emailTarget()
	{
		let emailDialog = this.dialog.open(MentionEmailTargetDialog);

		emailDialog.afterClosed().subscribe( target => {
			if(!target)
				return;
				
			this.targets.push(target);
			
		});
	}

	smsTarget()
	{
		let smsDialog = this.dialog.open(MentionSmsTargetDialog);

		smsDialog.afterClosed().subscribe( target => {
			if(target)
			{
				this.targets.push(target);
			}
		});
	}

	webhookTarget()
	{
		let webhookDialog = this.dialog.open(MentionWebhookTargetDialog);

		webhookDialog.afterClosed().subscribe( target => {
			if(target)
			{
				this.targets.push(target);
			}
		});
	}

	saveSettings()
	{

	}

	testNotifications(target)
	{

	}
}
