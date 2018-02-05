import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MdDialog } from '@angular/material';
import { Router } from "@angular/router";
import { Request, Alert, User } from "../../services/";


@Component({
	selector: 'neo-tracking-stats',
	templateUrl: './tracking-stats.html',
	styleUrls: ["tracking-stats.scss"]
})
export class TrackingStatsPage implements OnInit
{
	trackingStats = {};
	statsTimer = null;
	trackings = [];
	statCategory = "gdax";
	statCategories = [];
	constructor(
		private titleService: Title,
		public request: Request,
		public dialog: MdDialog,
		public alert: Alert,
		public user: User,
		public router: Router,
	)
	{

	}

	ngOnInit()
	{
		this.titleService.setTitle( 'Tracking Stats' );
		this.getStats();
	}
	
	ngOnDestroy()
	{
	
		clearTimeout(this.statsTimer);
	
	}

	getStats()
	{
		this.request.get("/stats/getTrackings").then( response => {
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			clearTimeout(this.statsTimer);
			this.statsTimer = setTimeout(() => {
				this.getStats();
			}, 15*1000);

			this.trackings = response.trackings.map((item) => {
				item.late = (Date.now() - item.updated) > (60 * 5 * 1000);
				return item;
			});

			this.trackings.forEach( tracking => {
				if(!this.trackingStats[tracking.type])
				{
					this.statCategories.push(tracking.type);
					this.trackingStats[tracking.type] = [];
				}

				var tracker = this.trackingStats[tracking.type].find( item => {
					if(item.target == tracking.target)
						return true;
					return false;
				});

				//tracking.chartData = this.getChartData(tracking);
				if(tracker)
				{
					tracker = tracking;
				}else{
					this.trackingStats[tracking.type].push(tracking);
				}

			});
			// this.trackingStats = response.trackings.map((item) => {
			// 	item.late = (Date.now() - item.updated) > (60 * 5 * 1000);
			// 	return item;
			// });
		});
	}

	getChartData(tracking)
	{
		var interval = 60*1000;
		var points = [];
		
		if(!tracking.updates)
			return [];

		tracking.updates.forEach( updateTime => {
			var update = new Date(updateTime).getTime();
			var g = (update / interval) - ((update / interval) % 1);

			
			var point = points.find( point => {
				if(point.timestamp == g)
					return true;
				return false;
			});
			if(!point)
			{
				points.push({
					timestamp: g,
					date: new Date(g),
					value: 1,
				});
			}else{
				point.value++;
			}
		});
		//console.log("points:", points);
		return points;
	}

	selectCategory(category)
	{
		this.statCategory = category;
	}
}
