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
	selector: 'neo-market-holdings-dialog',
	templateUrl: './market-holdings.dialog.html',
	styleUrls: ['./market-holdings.dialog.scss'],
})
export class MarketHoldingsDialog implements OnInit
{
	Market: any = {};
	Amount: string;

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<MarketHoldingsDialog>,
		public request: Request,
		public alert: Alert,
	)
	{
		this.Market = data.market;
		this.Amount = data.market.holdings;
	}

	ngOnInit()
	{
	
	}


	Save()
	{
		this.request.post("/market/hold/" + this.Market.market, {
			amount: parseFloat(this.Amount) || 0,
		}).then( response => {
			if(!response.success)
				return this.alert.error(response.message);
			this.dialogRef.close({
				amount: parseFloat(this.Amount) || 0,
			});
		})
		
	}
}
