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
	selector: 'neo-market-price-alert-dialog',
	templateUrl: './market-price-alert.dialog.html',
	styleUrls: ['./market-price-alert.dialog.scss'],
})
export class MarketPricePointAlertDialog implements OnInit
{
	Market: any = null;
	loadingMarket = false;
	Alert:any = {
		name: "",
		alarmStrategy: "pricepoint",
		alarmOptions: {
			index: "Price",
			method: "gt",
			pricepoint: 0
		},
	}

	PriceKeys: any[] = [
		{
			name: "Price",
			value: "Price",
		},
		{
			name: "Base Volume",
			value: "Volume",
		},
		{
			name: "Quote Volume",
			value: "QuoteVolume",
		}
	];

	CompareMethods: any[] = [
		{
			name: "Greater Than",
			value: "gt",
		},
		{
			name: "Less Than",
			value: "lt",
		},
	];

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<MarketPricePointAlertDialog>,
		public request: Request,
		public alert: Alert,
		public marketService: Market,
	)
	{
		this.Alert = Utils.copy(data.alert) || this.Alert;
		console.log("data:market,", data.market);
		this.Alert.market = data.market || this.Alert.market;
		this.loadingMarket = true;
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
