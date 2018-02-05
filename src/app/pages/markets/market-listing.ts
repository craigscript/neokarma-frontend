import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Request, User, Alert } from "../../services/";
import { ActivatedRoute, Router } from "@angular/router";
import { MdDialog } from '@angular/material';
import { MarketHoldingsDialog } from "./dialogs";
import { MarketAlertListingComponent } from "./alert-listing";

@Component({
	templateUrl: './market-listing.html',
	styleUrls: ['./market-listing.scss'],
})
export class MarketListingPage implements OnInit, OnDestroy
{
	// Market description
	loadingMarket = true;
	market:any = null;


	// Ticker
	tickerInterval = null;
	loadingChart = true;
	
	chartData = [];

	marketId = null;

	@ViewChild("alertsListing")
	alertsListing: MarketAlertListingComponent;

	constructor(
		private titleService: Title,
		public request: Request,
		public user: User,
		public alert: Alert,
		public route: ActivatedRoute,
		public dialog: MdDialog,
	)
	{
		this.route.params.subscribe((params) => {
			if(params.market)
			{
				this.marketId = params.market;
				this.getMarket();
				this.getHistory();
			}
		});
	}

	ngOnInit()
	{
		this.tickerInterval = setInterval(() => {
			this.getTicker();
		}, 5*1000);
	}

	ngOnDestroy()
	{
		clearInterval(this.tickerInterval);
	}

	getMarket()
	{
		this.request.get("/market/getMarket/" + this.marketId).then( response => {
			this.loadingMarket = false;
			if(!response.success)
				return this.alert.error(response.message);

			this.market = response.market;			
		})
	}

	getHistory(StartDays=14, IntervalMins=15)
	{
		console.log("Start Time:", (Date.now() - (60*60*24*StartDays*1000)), Date.now(), StartDays);
		this.request.get("/market/history/nkr/" + this.marketId + "/Price/avg/" + (Date.now() - (60*60*24*StartDays*1000)) + "/0/" + (60*IntervalMins*1000)).then( response => {
			this.loadingChart = false;
			if(!response.success)
				return;
			this.chartData = response.history;//.map( item => item.Price );
		});
	}

	getTicker()
	{
		if(!this.market)
			return;

		this.request.get("/market/ticker/" + this.market.market).then( response => {
			if(!response.success)
				return;

			if(!this.market)
				return;


			this.market.ticker = response.ticker;
			var arr = this.chartData;
			arr.push({
				timestamp: Date.now(),
				date: new Date(),
				Price: response.ticker.Price,
			});
			this.chartData = arr.slice();
			this.titleService.setTitle("NKR - " + this.market.name + ": " + response.ticker.Price);
			//this.getHistory();


		})
	}

	favorite(market)
	{
		var state = (market.favorited>0?0:1);

		this.request.get("/market/favorite/" + market.market + "/" + state).then( response => {
			if(!response.success)
				return this.alert.error(response.message);
			market.favorited = state;
		});
	}

	createAlert(alarmStrategy)
	{
		this.alertsListing.createAlert(alarmStrategy, this.market.market);
	}

	setHoldings(market)
	{
		if(!this.user.IsAuthenticated())
			return this.alert.info("Please log in to set holdings!");

		let marketDialogRef = this.dialog.open(MarketHoldingsDialog, {
			data: {
				market: market,
			}
		});

		marketDialogRef.afterClosed().subscribe( result => {
			console.log("Result:", result);
			if(!result)
				return;

			market.holdings = result.amount;
		});
	}

}
