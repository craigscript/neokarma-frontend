import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Request, Alert } from "../../../services/";

@Component({
	selector: 'neo-trackers-market-source-dialog',
	templateUrl: './market-source.dialog.html',
	styleUrls: ['./market-source.dialog.scss'],
})
export class TrackersMarketSourceDialog
{
	name: string = "";
	target: string = null;
		
	options: any = {};

	SelectedCurrency: any = {};

	loadingMarketOptions = true;
	marketOptions = {};

	exchanges = [];
	markets = [];
	currencies = [];
	queries = [];


	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public request: Request,
		public alert: Alert,
		public dialogRef: MdDialogRef<TrackersMarketSourceDialog>
	)
	{
		this.name = data.name;
		this.target = data.target;
	
		if(!data.options)
		{
			this.options = {};
		} else {
			this.options = data.options;
		}
	}

	ngOnInit()
	{
		this.loadingMarketOptions = true;
		this.request.get("/sources/getSourceOptions/market").then( response => {
			this.loadingMarketOptions = false;
			if(!response.success)
				return this.alert.error(response.message);
			this.marketOptions = response.exchanges;
			
			this.exchanges = Object.keys(this.marketOptions);
			this.selectExchange();
			this.selectMarket();
			this.selectCurrency();
		});
		this.queries = [];
	}

	
	selectExchange()
	{
		console.log("New target:", this.target);
		if(!this.target)
			return;

		this.markets = Object.keys(this.marketOptions[this.target].markets);
		this.queries = Object.keys(this.marketOptions[this.target].queries);
		this.currencies = [];
	}

	selectMarket()
	{
		console.log("New market:", this.options.market);

		if(!this.target)
			return;
		if(!this.options.market)
			return;

		this.currencies = Object.keys(this.marketOptions[this.target].markets[this.options.market].currencies);
	}

	selectCurrency()
	{
		console.log("New Currency:", this.options.currency);
	}

	selectQuery()
	{
		console.log("New Query:", this.options.query);
	}

	Save()
	{
		console.log("target:", this.target, "options:", this.options);
		this.dialogRef.close({
			name: this.name,
			target: this.target,
			options: this.options
		});
	}
}
