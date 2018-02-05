import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Request, Alert } from "../../../services/";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
	selector: 'neo-market-update-alert-dialog',
	templateUrl: './market-update-alert.dialog.html',
	styleUrls: ['./market-update-alert.dialog.scss'],
})
export class MarketUpdateAlertDialog implements OnInit
{
	Market: any = {};

	Name: string = "";
	PriceKey: string = "";
	UpdateFrequency: string = "";

	PriceKeys: any[] = [
		{
			name: "Asking Price",
			value: "Ask",
		},
		{
			name: "Bid Price",
			value: "Bid",
		},
		{
			name: "Price",
			value: "Price",
		}
	];

	UpdateFrequencies: any[] = [
		{
			name: "Hourly",
			value: 60*60,
		},
		{
			name: "3 Hourly",
			value: 60*60*3,
		},
		{
			name: "6 Hourly",
			value: 60*60*6,
		},
		{
			name: "12 Hourly",
			value: 60*60*12,
		},
		{
			name: "Daily",
			value: 60*60*24,
		},
		{
			name: "2 Daily",
			value: 60*60*48,
		},
		{
			name: "Weekly",
			value: 60*60*24*7,
		},
	];

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<MarketUpdateAlertDialog>,
		public request: Request,
		public alert: Alert,
	)
	{
		this.Market = data.market;
		this.Name = data.name;
		this.PriceKey = data.key || "";
		this.UpdateFrequency = data.method || "";
	}

	ngOnInit()
	{

	}


	Save()
	{
		this.dialogRef.close({
			name: this.Name
		});
	}
}
