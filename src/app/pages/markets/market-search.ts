import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck, OnChanges, AfterViewChecked, SimpleChanges, NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MediaChange, ObservableMedia } from "@angular/flex-layout";
import { Request, User, Alert, SocketService, Market, Utils } from "../../services/";
import { MdDialog, MdRipple } from '@angular/material';
import { MarketDialogMap, MarketHoldingsDialog } from "./dialogs";
import { Subscription } from "rxjs/Subscription";
import { SortablejsDirective } from "angular-sortablejs";

@Component({
	templateUrl: './market-search.html',
	styleUrls: ['./market-search.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketSearchPage implements OnInit, OnDestroy, AfterViewInit, OnChanges, DoCheck
{
	markets = [];
	loadingMarkets = null;

	tickerInterval = null;

	ColumnSize = (100/4);
	ListView = true;
	
	searchSub: Subscription;
	viewModeSub: Subscription;
	mediaSub: Subscription;

	constructor(
		private titleService: Title,
		public request: Request,
		public user: User,
		public alert: Alert,
		public dialog: MdDialog,
		public market: Market,
		public socket: SocketService,
		public changedetector: ChangeDetectorRef,
		public zone: NgZone,
	)
	{
		
		// setInterval(() => {
		// 	this.ColumnSize++;
		// }, 1000);
		this.socket.channel("nkr-tickers").subscribe( ticker => {
			console.log("NKR Ticker received:", ticker);
		});
		this.searchSub = this.market.onSearch.subscribe( marketName => {
			//console.log("Searched market:", marketName);

			if(!marketName || !marketName.length)
				return this.getFavorites();

//			this.searchMarket(marketName);
		});

		let forcedList = false;
		this.viewModeSub = this.market.onViewModeChange.subscribe( view => {
			//this.changedetector.markForCheck();
			this.ColumnSize = 100/view.columns;
			this.ListView = view.mode == "list";
			forcedList = view.mode == "list";
		});

		// Switch to list view whenever the screen is small
		// this.mediaSub = this.media.subscribe((change: MediaChange) => {
		// 	//this.changedetector.markForCheck();
			
		// 	if(!forcedList)
		// 	{
		// //		this.ListView = this.media.isActive("lt-md");
		// 	}
		// });
		//this.ListView = this.media.isActive("lt-md");
	}

	ngDoCheck()
	{
		console.log("checking MarketSearchPage fucker?");
	}

	ngOnChanges(changes)
	{
		//console.log("MarketSearchPage Change detector is running?", changes);
		
	}

	ngOnInit()
	{
		this.getMarkets();
		this.zone.runOutsideAngular(() => {
			this.tickerInterval = setInterval(() => {
				this.getTickers();
			}, 15*1000);
		})
	}

	ngOnDestroy()
	{
		clearInterval(this.tickerInterval);
		this.searchSub.unsubscribe();
		this.viewModeSub.unsubscribe();
		if(this.mediaSub)
			this.mediaSub.unsubscribe();
	}

	ngAfterViewChecked()
	{
		console.log("MarketSearchPage ngAfterViewChecked");
	}
	
	ngAfterViewInit()
	{
		console.log("MarketSearchPage ngAfterViewInit");
	}

	getMarkets()
	{
		this.loadingMarkets = true;
		this.request.get("/market").then( response => {
			this.loadingMarkets = false;
			if(!response.success)
				return this.alert.error(response.message);
			console.log("Got markets");
			this.markets = response.markets;
			this.changedetector.detectChanges();
		})
	}

	listUpdated(event)
	{
		console.log("listUpdated:", event);

		if(!this.user.IsAuthenticated())
			return;
		var prefs = Utils.ArrayMove(this.markets.map(market => market.market), event.newIndex, event.oldIndex);
		console.log("this.markets:", prefs);
	}

	addMarket()
	{
		console.log("Add market?", new Date().getSeconds());
	}

	hideMarket(market)
	{
		this.markets.splice(this.markets.indexOf(market), 1);
	}

	addAlert()
	{
		console.log("Add Alert");
	}



	favoriteFirst(event)
	{
		if(!this.markets.length)
			return;
		if(event.keyCode == 13)
		{
			this.favorite(this.markets[0]);
		}
	}

	searchMarket(marketName)
	{
		this.loadingMarkets = true;
		this.request.post("/market/search", {
			search: marketName
		}).then( response => {
			this.loadingMarkets = false;
			if(!response.success)
				return this.alert.error(response.message);

			this.markets = response.markets;

		//	console.log(this.markets);
			for(let market of this.markets)
			{
				//this.getHistory(market);
			}
			
			//this.changedetector.detectChanges();

		})
	}

	getFavorites()
	{
		this.loadingMarkets = true;
		this.request.get("/market").then( response => {
			this.loadingMarkets = false;
			if(!response.success)
				return this.alert.error(response.message);
			this.markets = response.markets;
			
			for(let market of this.markets)
			{
				//this.getHistory(market);
			}

			if(!this.markets.length)
			{
				this.searchMarket("");
			}
		})
	}

	getHistory(Market, StartDays=14, IntervalMins=60)
	{
		this.request.get("/market/history/nkr/" + Market.market + "/Price/avg/" + (Date.now() - (60*60*24*StartDays*1000)) + "/0/" + (60*IntervalMins*1000)).then( response => {
			Market.loadingChart = false;
			if(!response.success)
				return;

			Market.chartData = response.history;
			//this.changedetector.detectChanges();
		});
	}

	getTickers()
	{
		this.request.get("/market/ticker").then( response => {
			if(!response.success)
				return;
			for(var ticker of response.tickers)
			{
				var market = this.markets.find(item => {
					if(item.market == ticker.Market)
						return true;
					return false;
				});
				if(!market)
					continue;
				
				// TODO: Get the updated history data only if the ticker has changes!
				// if(ticker.Price != market.ticker.Price)
				// {
				// //	this.getHistory(market);
				// }
				
				market.ticker = ticker;

				// if(!market.chartData)
				// 	market.chartData  = [];

				// market.chartData.push(ticker.Price);
				// market.chartData = market.chartData.slice();
			}
			console.log("Received tickers!");
			//this.changedetector.detectChanges();
		})
	}

	favorite(market)
	{
		var state = (market.favorited>0?0:1);
		if(!state)
		{
			this.markets.splice(this.markets.indexOf(market), 1);
		}

		this.request.get("/market/favorite/" + market.market + "/" + state).then( response => {
			if(!response.success)
				return this.alert.error(response.message);
			market.favorited = state;
		});
	}

	createAlert(alarmStrategy: string, market)
	{
		if(!this.user.IsAuthenticated())
			return this.alert.info("Please log in to create alerts!");

		if(!MarketDialogMap[alarmStrategy])
			return;

		let alertDialgoRef = this.dialog.open(MarketDialogMap[alarmStrategy], {
			data: {
				market: market.market,
			}
		});

		alertDialgoRef.afterClosed().subscribe( MarketAlert => {

			if(!MarketAlert)
				return;

				this.alert.success("Alert has been set!");
		});
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
			
			if(!result)
				return;

			market.holdings = result.amount;
		});
	}

}
