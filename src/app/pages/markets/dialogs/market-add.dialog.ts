import { Component, OnInit, Inject } from '@angular/core';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Request, Alert } from "../../../services/";

@Component({
	templateUrl: './market-add.dialog.html',
})
export class MarketAddDialog implements OnInit
{
	loadingMarkets = false;
	markets = [];
	currency: string;

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<MarketAddDialog>,
		public request: Request,
		public alert: Alert,
	)
	{

	}

	ngOnInit()
	{

	}

	searchMarket()
	{
		this.loadingMarkets = true;
		this.request.post("/market/search", {
			search: this.currency
		}).then( response => {
			this.loadingMarkets = false;
			if(!response.success)
				return this.alert.error(response.message);

			this.markets = response.markets;
			//console.log(this.markets);
		})
	}

	addMarket(market)
	{
		this.dialogRef.close(market);
	}
}
