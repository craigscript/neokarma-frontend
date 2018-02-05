import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { User } from "../../services/";

@Component({
	selector: 'neo-trackers-notifications-history',
	templateUrl: './notifications-history.html',
	styleUrls: ['./notifications-history.scss'],
})
export class TrackersNotificationsHistory implements OnInit
{

	constructor(
		public media: TdMediaService,
		private titleService: Title,
		public user: User
	)
	{

	}

	ngOnInit()
	{
		this.titleService.setTitle( 'Trackers Notifications History' );
	}
}
