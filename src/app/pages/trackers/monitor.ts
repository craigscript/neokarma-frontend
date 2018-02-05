import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdLoadingService, TdMediaService, TdDataTableSortingOrder, TdDataTableService, ITdDataTableSortChangeEvent, TdDigitsPipe } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { Request, Alert } from "../../services/";
import { MdChart } from "../../components/";
import * as moment from 'moment-timezone';

@Component({
	selector: 'neo-trackers-monitor',
	templateUrl: './monitor.html',
	styleUrls: ['./monitor.scss'],
})
export class TrackersMonitorPage implements OnInit
{
	public ChartData: any [] = [];
	public ChartLabels: any [] = [];
	public ChartOptions: any = { responsive: true };
	public ChartType: string = 'line';
	public ShouldStackCharts = false;
	public ShouldNormalize = false;
	Charts: any[] = [];
	loadingChart: boolean = false;

	// Date Time selector
	DataInterval = 1800;
	EndDate = new Date(Date.now() + (3600 * 12 * 1000) );
	StartDate = new Date(Date.now() - (3600 * 12 * 1000) );

	// Data Listings
	loadingTrackers: boolean = true;
	Trackers: any[] = [];

	loadingExchanges: boolean = true;
	exchanges = [];

	loadingGlobalTrackers: boolean = false;
	GlobalTrackers: any[] = [];

	loadingMentionTrackers: boolean = false;
	MentionTrackers: any[] = [];

	userTimezone: any;
	timezones = [];

	@ViewChild("TrackerChart")
	TrackerChart: MdChart;

	constructor(
		private titleService: Title,
		public request: Request,
		public alert: Alert,
		public media: TdMediaService
	)
	{

	}

	ngOnInit()
	{
		this.titleService.setTitle( 'Mentions Monitor' );
		this.getMarkets();
		this.getTrackers();
		this.getMentionTrackers();
		this.createOptions();
		// get timezones
		this.timezones = moment.tz.names();
		// get user timezone
		this.userTimezone = moment.tz.guess();
		// get timezone offset
		//console.log(moment.tz(this.userTimezone).format("Z"));
	}

	getMarkets()
	{
		this.loadingExchanges = true;
		this.request.get("/sources/getSourceOptions/market").then( response => {
			this.loadingExchanges = false;
			if(!response.success)
				return this.alert.error(response.message);
			this.exchanges = response.exchanges;
		});
	}

	getTrackers()
	{
		this.loadingTrackers = true;
		this.request.get("/trackers/getTrackers").then( response => {
			this.loadingTrackers = false;
			if(response.success)
			{
				this.Trackers = response.trackers;
			}
		});
		this.loadingGlobalTrackers = true;
		this.request.get("/trackers/getGlobalTrackers").then( response => {
			this.loadingGlobalTrackers = false;
			if(response.success)
			{
				this.GlobalTrackers = response.trackers;
			}
		});
	}

	getMentionTrackers()
	{
		this.loadingMentionTrackers = true;
		this.request.get("/mentions/getTrackers").then( response => {
			this.loadingMentionTrackers = false;
			if (!response.success)
				return this.alert.error(response.message);

			this.MentionTrackers = response.trackers;
		});
	}

	addMarket(exchange, market, currency, query, menuItem)
	{
		menuItem._element.nativeElement.remove();

		var marketChart = {
			name: this.exchanges[exchange].markets[market].currencies[currency].name + " " + this.exchanges[exchange].queries[query],
			exchange: exchange,
			market: market,
			currency: currency,
			query: query,
		};

		this.addChart(marketChart, "market");
	}

	addTracker(tracker)
	{
		tracker.show = !tracker.show;
		if(tracker.show)
		{
			this.addChart(tracker, "tracker");
		}
		tracker.added = true;
	//	this.Trackers.splice(this.Trackers.indexOf(tracker), 1);
	}

	addMentionTracker(tracker)
	{
		this.addChart(tracker, "mention");
		tracker.added = true;
	}

	addTrackerSource(source, tracker)
	{
		source.show = !source.show;
		source.ownerId = tracker._id;
		if(source.show)
		{
			this.addChart(source, "source");
		}
		source.added = true;
	}

	addChart(tracker, type)
	{
		let chart = {
			name: tracker.name,
			data: null,
			datatype: type,
			loading: true,
			hidden: false,
			tracker: tracker,
		};

		if(chart.datatype == 'tracker')
		{
			this.getTrackerData(chart).then( () => {
				this.updateChart();
			});
		}

		if(chart.datatype == 'mention')
		{
			this.getMentionTrackerData(chart).then( ()=> {
				this.updateChart();
			});
		}

		if(chart.datatype == "source")
		{
			this.getSourceData(chart).then(() => {
				this.updateChart();
			});
		}

		if(chart.datatype == 'market')
		{
			this.getMarketData(chart).then( () => {
				this.updateChart();
			});
		}
		this.Charts.push(chart);
	}

	updateChart()
	{
		this.ChartData = new Array();
		this.ChartLabels = [];
		var i = 0;
		for(let chart of this.Charts)
		{
			if(!chart.data)
			continue;

			chart.index = i;
			++i;
			var values = [];

			for(var data of chart.data)
			{
				values.push({
					t: new Date(data.date),
					y: data.value
				});
				// var label = moment(data.date).format("MM/DD/YYYY HH:mm");
				// var index = this.ChartLabels.indexOf(label);
				// if(index < 0)
				// {
				// 	this.ChartLabels.push(label);
				// }
			}

			if(this.ShouldNormalize)
			{
				let ratio = Math.max.apply(Math, values.map(item => Math.abs(item.y))) / 1;
				values = values.map((item) => {
					return {
						t: item.t,
						y: item.y / ratio
					};
				});
			}

			this.ChartData.push({
				data: values,
				label: chart.name,
				hidden: chart.hidden,
				type: chart.type,
				borderDash: (chart.market?[2, 2]:[]),
			});
		}
		// this.ChartLabels = this.ChartLabels.sort((a, b) => {
		// 	if(a > b)
		// 	return 1;
		// });

		this.loadingChart = false;
	}

	createOptions()
	{
		this.loadingChart = true;
		setTimeout(() => {
			this.loadingChart = false;
		}, 1000);
		this.ChartOptions = {
			legend: {
				display: false
			},
			animation: {
				duration: 250, // general animation time
			},
			hover: {
				animationDuration: 250, // duration of animations when hovering an item
			},
			elements: {
				line: {
					tension: 0, // disables bezier curves
				}
			},
			responsive: true,

			tooltips: {
				mode: 'nearest'
			},
			scales: {
				xAxes: [{
					type: "time",
					time: {
						format: 'MM/DD/YYYY HH:mm',
						// round: 'day'
						tooltipFormat: 'll HH:mm'
					},
					scaleLabel: {
						display: true,
						labelString: 'Date'
					}
				}, ],
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'value'
					},
					stacked: this.ShouldStackCharts
				}]
			}
		};
	}

	createChart()
	{
		this.createOptions();
		this.loadingChart = true;
	}

	updateChartData()
	{
		this.loadingChart = true;
		this.ChartData = [];
		let promises = [];

		// Reset hidden charts and load all visbile data
		for(let chart of this.Charts)
		{
			chart.data = null;
			if(!chart.hidden)
			{
				let promise = null;
				if(chart.datatype == 'tracker')
				{
					promise = this.getTrackerData(chart);
				}
				if(chart.datatype == 'market')
				{
					promise = this.getMarketData(chart);
				}
				if(chart.datatype == 'mention')
				{
					promise = this.getMentionTrackerData(chart);
				}
				promises.push(promise);
			}
		}

		Promise.all(promises).then(() => {
			this.updateChart();
		});
	}

	toggleChart(chart)
	{
		chart.hidden = !chart.hidden;
		if(!chart.hidden && !chart.data)
		{
			if(chart.datatype == 'tracker')
			{
				this.getTrackerData(chart).then( () => {
					this.updateChart();
				});
			}
			if(chart.datatype == 'market')
			{
				this.getMarketData(chart).then( () => {
					this.updateChart();
				});
			}
		}
		this.updateChart();
	}

	toggleStack()
	{
		this.ShouldStackCharts = !this.ShouldStackCharts
		this.createOptions();
	}

	toggleNormalize()
	{
		this.ShouldNormalize = !this.ShouldNormalize;
		this.updateChart();
	}

	startDateChanged($event)
	{
		this.StartDate = $event;
		this.updateChartData();
	}

	endDateChanged($event)
	{
		this.EndDate = $event;
		this.updateChartData();
	}

	SetStepSize(DataInterval)
	{
		this.DataInterval = DataInterval;
		this.updateChartData();
	}

	getMarketData(chart)
	{
		chart.loading = true;
		this.loadingChart = true;

		return this.request.get("/market/"+  chart.tracker.query + "/" + chart.tracker.exchange + "/" + chart.tracker.market + "/" + chart.tracker.currency + "/" + this.DataInterval + "/" + (this.StartDate.getTime() / 1000) + "/" + (this.EndDate.getTime() / 1000) + "/").then( response => {
			chart.loading = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}

			if(!response.data)
				return;

			chart.market = true;
			chart.data = response.data;
		});
	}

	getTrackerData(chart)
	{
		chart.loading = true;
		this.loadingChart = true;
		return this.request.get("/trackers/getTrackerData/" + chart.tracker._id + "/" + this.DataInterval + "/" + (this.StartDate.getTime()/1000) + "/" + (this.EndDate.getTime()/1000) + "/").then( response => {
			chart.loading = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}

			if(!response.data)
				return;

			chart.data = response.data;
		});
	}

	getMentionTrackerData(chart)
	{
		chart.loading = true;
		return this.request.get("/mentions/getTrackerData/" + chart.tracker._id + "/" + this.DataInterval + "/" + (this.StartDate.getTime()/1000) + "/" + (this.EndDate.getTime()/1000) + "/").then( response => {
			chart.loading = false
			if (!response.success)
				return this.alert.error(response.message);

			if (!response.data)
				return;

			chart.data = response.data;
		});
	}

	getSourceData(chart)
	{
		chart.loading = true;
		this.loadingChart = true;
		return this.request.get("/trackers/getSourceData/" + chart.tracker.ownerId + "/" + chart.tracker._id + "/" + this.DataInterval + "/" + (this.StartDate.getTime()/1000) + "/" + (this.EndDate.getTime()/1000) + "/").then( response => {
			chart.loading = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}

			if(!response.data)
				return;

			chart.data = response.data;
		});
	}

	loadChartData(event)
	{

	}
}
