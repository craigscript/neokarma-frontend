import { Component, OnInit } from "@angular/core";
import { Title } from '@angular/platform-browser';

@Component({
	templateUrl: "./notification-history.html",
	styleUrls: ['./notification-history.scss']
})
export class NotificationHistoryPage implements OnInit
{

	constructor(
		private title: Title,
	)
	{

	}

	ngOnInit()
	{
		this.title.setTitle( 'Notification History' );
	}
}
