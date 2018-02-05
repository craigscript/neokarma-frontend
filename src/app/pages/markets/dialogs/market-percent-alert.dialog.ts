import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Request, Alert, Market, Utils } from "../../../services/";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
	selector: 'neo-market-percent-alert-dialog',
	templateUrl: './market-percent-alert.dialog.html',
	styleUrls: ['./market-percent-alert.dialog.scss'],
})
export class MarketPercentageChangeAlertDialog implements OnInit
{
	Market: any = null;
	loadingMarket = false;
	Alert:any = {
		name: "",
		market: "",
		alarmStrategy: "percentchange",
		alarmOptions: {
			index: "Price",
			method: "inc",
			range: 60*60,
			change: 0
		},
	}

	PriceKeys: any[] = [
		{
			name: "Volume",
			value: "Volume",
		},
		{
			name: "Quote Volume",
			value: "QuoteVolume",
		},
		{
			name: "Price",
			value: "Price",
		}
	];

	CompareMethods: any[] = [
		// Increase
		{
			name: "Increases by",
			value: "inc",
		},
		// Decrease
		{
			name: "Decreases by",
			value: "dec",
		},
		// No change with limit (-a, +a)
		{
			name: "Steady on",
			value: "st",
		},
	];

	Periods: any[] = [
		{
			name: "1 Hour",
			value: 60*60,
		},
		{
			name: "2 Hours",
			value: 60*60*2,
		},
		{
			name: "3 Hours",
			value: 60*60*3,
		},
		{
			name: "6 Hours",
			value: 60*60*6,
		},
		{
			name: "12 Hours",
			value: 60*60*12,
		},
		{
			name: "1 Day",
			value: 60*60*24,
		},
		{
			name: "2 Days",
			value: 60*60*48,
		},
		{
			name: "1 Week",
			value: 60*60*24*7,
		},
		{
			name: "2 Weeks",
			value: 60*60*24*14,
		},
	];

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<MarketPercentageChangeAlertDialog>,
		public request: Request,
		public alert: Alert,
		public marketService: Market,
	)
	{
		this.Alert = Utils.copy(data.alert) || this.Alert;
		this.Alert.market = data.market || this.Alert.market;
		this.loadingMarket = true;
		console.log("data:market,", data.market);
		this.request.get("/market/getMarket/" + this.Alert.market).then( response => {
			this.loadingMarket = false;
			if(!response.success)
				return this.alert.error(response.message);

			this.Market = response.market;			
		});
		
	}

	ngOnInit()
	{
	
	}


	
	Save()
	{
		if(!this.Alert._id)
			this.Create();

		this.Update();
	}

	Create()
	{
		var loading = this.alert.loading("Creating alert.");
		this.request.post("/market/alerts/createAlert", this.Alert).then( response => {
			
			loading.afterClosed().subscribe(() => {
				if(!response.success)
					return this.alert.error(response.message);
				this.dialogRef.close(response.alert);	
				return this.alert.success("Alert created!");
			});
			loading.close();
			
		});
	}

	Update()
	{
		var loading = this.alert.loading("Creating alert.");
		this.request.post("/market/alerts/updateAlert/" + this.Alert._id, this.Alert).then( response => {
			
			loading.afterClosed().subscribe(() => {
				if(!response.success)
					return this.alert.error(response.message);
				this.dialogRef.close(this.Alert);	
				return this.alert.success("Alert Saved!");
			});
			loading.close();
			
		});
	}
}
