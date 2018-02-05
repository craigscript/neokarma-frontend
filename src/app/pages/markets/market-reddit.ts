import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck, OnChanges, AfterViewChecked, SimpleChanges, NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MediaChange, ObservableMedia } from "@angular/flex-layout";
import { Request, User, Alert, SocketService, Market, Utils } from "../../services/";
import { MdDialog, MdRipple } from '@angular/material';
import { MarketDialogMap, MarketHoldingsDialog } from "./dialogs";
import { Subscription } from "rxjs/Subscription";
import { SortablejsDirective } from "angular-sortablejs";

@Component({
	templateUrl: './market-reddit.html',
	styleUrls: ['./market-reddit.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketRedditPage implements OnInit, OnDestroy
{
	markets = [];
	loadingMarkets = true;

	tickerInterval = null;


	
	searchSub: Subscription;
	viewModeSub: Subscription;
	mediaSub: Subscription;
	GraphData = [0, 1];
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
		this.loadingMarkets = true;
		this.getReddit();
	}

	ngOnDestroy()
	{
	}

	getReddit()
	{
		this.request.getRedditData("http://default-environment.ybq5a73yz3.us-east-2.elasticbeanstalk.com").then( response => {
			
			for(var item of response) {
				console.log(item.value);
				this.GraphData.push(parseInt(item.value));
			}

			this.loadingMarkets = false;
			
		})
	}
}
