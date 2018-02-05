import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Request, User } from "../../services/";
import { cryptoTickers } from "./cryptoTickers";

@Component({
	selector: 'neo-dashboard',
	templateUrl: './dashboard.html',
	styleUrls: ['./dashboard.scss'],
})
export class DashboardPage implements OnInit, OnDestroy
{
	Stats: any;
	ServerLoad = [];
	MentionQuota = [0, 0];
	TrackingQuota = [0, 0];
	SourceQuota = [0, 0];
	StatsTimer: any = null;
	cryptoTickers: any [];
	config: any;
	

	constructor(
		private titleService: Title,
		public request: Request,
		public user: User,
	)
	{
		this.Stats = {
			quotas: {},
			timelines: {},
		};
		this.config = {
			mentionsQuota: true,
			trackingQuota: true,
			sourceQuota: true,
			accountDetails: true,
			serviceUsage: true,
			trackingSpeed: true
		};
		this.cryptoTickers = cryptoTickers;
	}

	ngOnInit()
	{
		this.titleService.setTitle( 'Dashboard' );
		this.getStats();
		this.StatsTimer = setInterval(() => {
			this.getStats();
		}, 2000);
	}

	ngOnDestroy()
	{
		clearInterval(this.StatsTimer);
	}

	getStats()
	{
		this.request.get("/dashboard/stats").then( response => {
			if(response.success)
			{
				this.Stats = response.stats;
				this.ServerLoad = this.Stats.timelines.usage;
				//this.user.UpdateQuota(this.Stats.quotas);
				//this.TrackingQuota = [this.user.getMaxQuota("trackers.trackers"), this.user.getUsedQuota("trackers.trackers")];
				//this.SourceQuota = [this.user.getMaxQuota("mentions.trackers") * this.user.getMaxQuota("mentions.sources"), this.user.getUsedQuota("mentions.trackers") + this.user.getUsedQuota("mentions.sources")];
				//this.MentionQuota = [this.user.getMaxQuota("mentions.daily"), this.user.getUsedQuota("mentions.daily")];
				// this.TrackingQuota = [this.Stats.quotas.trackers.current, this.Stats.quotas.trackers.used];
				// this.SourceQuota = [this.Stats.quotas.sources.current, this.Stats.quotas.sources.used];
				// this.MentionQuota = [this.Stats.quotas.mentions.current, this.Stats.quotas.mentions.used];
				//this.Stats.Quota = [90, 10];
				//this.Stats.Timeline = [50, 50, 20, 30, 40, 100, 300, 500, 120, 40, 52, 75, 340];
			}
		});
	}

}
