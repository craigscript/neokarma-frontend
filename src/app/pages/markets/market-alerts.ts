import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Request, User, Alert } from "../../services/";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	templateUrl: './market-alerts.html',
	styleUrls: ['./market-alerts.scss'],
})
export class MarketAlertsPage implements OnInit
{

	
	constructor(
		private titleService: Title,
		public request: Request,
		public user: User,
		public alert: Alert,
		public route: ActivatedRoute,
	)
	{

	}

	ngOnInit()
	{
	}

	createAlert()
	{
		// Show market selection dialog
	}
}
