import { Component, OnInit, Input, Output, EventEmitter, Directive, ViewContainerRef} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { Request, Alert } from "../../../../services";
@Component({
	templateUrl: './seriesavggtconst.rule.html',
})
export class SeriesAvgGtConstRule
{
	@Input()
	ruleOptions: any = null;

	Trackers: any[] = [];

	loadingSources = true;

	constructor(
		public request: Request,
		public alert: Alert,
	)
	{

	}

	ngOnInit()
	{
		if(!this.ruleOptions.moment)
		{
			this.ruleOptions.moment = {
				tracker: null,
				time: 0,
				range: 0,
				method: "avg",
			};
		}

		this.getUserSources();
		//this.getGlobalSources();
		//this.getMarketSources();
	}

	getUserSources()
	{
		this.loadingSources = true;
		this.request.get("/notificationtrackers/getUserSources").then( response => {
			this.loadingSources = false;

			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.Trackers = response.trackers;
			//Array.prototype.push(this.Trackers, response.trackers);
		})
	}

	getGlobalSources()
	{
		this.loadingSources = true;
		this.request.get("/notificationtrackers/getGlobalSources").then( response => {
			this.loadingSources = false;

			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			
			Array.prototype.push(this.Trackers, response.trackers);
		})
	}

	getMarketSources()
	{
		this.loadingSources = true;
		this.request.get("/notificationtrackers/getMarketSources").then( response => {
			this.loadingSources = false;

			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			
			Array.prototype.push(this.Trackers, response.trackers);
		})
	}


}
