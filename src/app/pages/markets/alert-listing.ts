import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Request, User, Alert, Utils } from "../../services/";
import { ActivatedRoute, Router } from "@angular/router";
import { MdDialog } from '@angular/material';
import { MarketDialogMap } from "./dialogs";

@Component({
	selector: "market-alert-listing",
	templateUrl: './alert-listing.html',
	styleUrls: ['./alert-listing.scss'],
})
export class MarketAlertListingComponent implements OnInit, OnDestroy
{
	@Input("marketName")
	marketName:any = null;

	loadingAlerts = false;

	alerts = [];

	constructor(
		private titleService: Title,
		public request: Request,
		public user: User,
		public alert: Alert,
		public route: ActivatedRoute,
		public dialog: MdDialog,
	)
	{
	}

	ngOnChanges(changes)
	{
		if(changes.marketName)
		{
			this.getMarketAlerts();
		}
	}

	ngOnInit()
	{
		this.getMarketAlerts();
	}

	ngOnDestroy()
	{

	}

	getMarketAlerts()
	{
		if(!this.marketName)
			return this.getAlerts();

		this.loadingAlerts = true;
		this.request.get("/market/alerts/market/" + this.marketName).then( response => {
			this.loadingAlerts = false;
			if(!response.success)
				return this.alert.error(response.message);
			this.alerts = response.alerts;
		})
	}

	getAlerts()
	{
		this.loadingAlerts = true;
		this.request.get("/market/alerts/").then( response => {
			this.loadingAlerts = false;
			if(!response.success)
				return this.alert.error(response.message);
			this.alerts = response.alerts;
		})
	}

	createAlert(alarmStrategy: string, marketName:string)
	{
		if(!this.user.IsAuthenticated())
			return this.alert.info("Please log in to create alerts!");

		if(!MarketDialogMap[alarmStrategy])
			return;

		let alertDialgoRef = this.dialog.open(MarketDialogMap[alarmStrategy], {
			data: {
				market: marketName,
			}
		});

		alertDialgoRef.afterClosed().subscribe( MarketAlert => {

			if(!MarketAlert)
				return;

			console.log("new alert: ", MarketAlert);
			this.alerts.push(MarketAlert);
		});
	}

	editAlert(alert)
	{
		if(!this.user.IsAuthenticated())
			return this.alert.info("Please log in to create alerts!");

		if(!MarketDialogMap[alert.alarmStrategy])
			return;

		let alertDialgoRef = this.dialog.open(MarketDialogMap[alert.alarmStrategy], {
			data: {
				alert: alert,
			}
		});

		alertDialgoRef.afterClosed().subscribe( MarketAlert => {

			if(!MarketAlert)
				return;
			console.log("alert updated:", MarketAlert);
			alert = Utils.copy(MarketAlert);
		});
	}

	removeAlert(alert)
	{
		var confirm = this.alert.confirm("Remove market alert?", "Are you sure you want to remove this market alert?");
		confirm.afterClosed().subscribe( result => {
			if(!result)
				return;

			this.loadingAlerts = true;
			this.request.get("/market/alerts/removeAlert/" + alert._id).then( response => {
				this.loadingAlerts = false;
				if(!response.success)
					return this.alert.error(response.message);
				this.alerts.splice(this.alerts.indexOf(alert), 1);
			});
		})
		
	}

}
