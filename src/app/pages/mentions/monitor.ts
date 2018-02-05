import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdLoadingService, TdMediaService, TdDataTableSortingOrder, TdDataTableService, ITdDataTableSortChangeEvent, TdDigitsPipe } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { Request, Alert } from "../../services/";
import { MdChart } from "../../components/";
import * as moment from 'moment-timezone';

@Component({
	selector: 'neo-mentions-monitor',
	templateUrl: './monitor.html',
	styleUrls: ['./monitor.scss'],
})
export class MentionsMonitorPage implements OnInit
{
	public ChartData: any [] = [];
	public ChartLabels: any [] = [];
	public ChartOptions: any = { responsive: true };
	public ChartType: string = 'line';
	public ChartStacked: boolean = false;
	public ShouldNormalize: boolean = false;

	Trackers: any[] = [];
	Charts: any[] = [];
	loadingChart: boolean = false;
	loadingTrackers: boolean = true;
	StepSize = 3600;
	EndDate = new Date(Date.now() + (3600 * 12 * 1000) );
	StartDate = new Date(Date.now() - (3600 * 12 * 1000) );

	Categories: any[] = [
		{
			name: "All",
			value: null,
		},
		{
			name: "Title",
			value: "title",
		},
		{
			name: "Content",
			value: "content",
		},
		{
			name: "URL",
			value: "url",
		},
	];

	categoryFilter: any;

	userTimezone: any;
	timezones = [];

	@ViewChild("MentionsChart")
	MentionsChart: MdChart;

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
		this.getTrackers();
		this.createOptions();
		// get timezones
		this.timezones = moment.tz.names();
		// get user timezone
		this.userTimezone = moment.tz.guess();
		// get timezone offset
		//console.log(moment.tz(this.userTimezone).format("Z"));
	}

	getTrackers()
	{
		this.Charts = [];
		this.loadingTrackers = true;
		this.request.get("/mentions/getTrackers").then( response => {
			this.loadingTrackers = false;
			if (!response.success)
				return this.alert.error(response.message);

			this.Trackers = response.trackers;
			for(let tracker of response.trackers)
			{
				this.Charts.push({
					name: tracker.name,
					tracker: tracker,
					hidden: false,
					data: null,
					labels: [],
					index: -1,
				})
				tracker.hidden = true;
			}
			this.updateChartData();
		});
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
				// var index = this.ChartLabels.indexOf(data.date);
				// if (index < 0)
				// {
				// 	this.ChartLabels.push(data.date);
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
			});
		}

		// this.ChartLabels = this.ChartLabels.sort((a, b) => {
		// 	if(a > b)
		// 		return 1;
		// });
	}

	updateChartData()
	{
		this.loadingChart = true;
		this.ChartData = [];
		let promises = [];

		for(let chart of this.Charts)
		{
			chart.data = null;
			if(!chart.hidden)
			{
				promises.push(this.getTrackerData(chart));
			}
		}

		Promise.all(promises).then(() => {
			this.updateChart();
		});
	}

	toggleStack()
	{
		this.ChartStacked = !this.ChartStacked;
		this.createOptions();
	}

	toggleNormalize()
	{
		this.ShouldNormalize = !this.ShouldNormalize;
		this.updateChart();
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
					ticks: {
						fontSize: 10,
					},
					scaleLabel: {
						display: false,

					}
				}, ],
				yAxes: [{
					scaleLabel: {
						display: false,
					},
					ticks: {
						fontSize: 10,
					},
					stacked: this.ChartStacked
				}]
			}
		};
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

	SetStepSize(stepSize)
	{
		this.StepSize = stepSize;
		this.updateChartData();
	}

	toggleChart(chart)
	{
		console.log("Toggling chart:", chart.name);
		chart.hidden = !chart.hidden;
		if(!chart.data && !chart.hidden)
		{
			this.getTrackerData(chart).then(() => {
				this.updateChart();
			});
			return;
		}
		this.updateChart();
	}

	getTrackerData(chart)
	{
		this.loadingChart = true;
		return this.request.get("/mentions/getTrackerData/" + chart.tracker._id + "/" + this.StepSize + "/" + (this.StartDate.getTime()/1000) + "/" + (this.EndDate.getTime()/1000) + "/").then( response => {
			this.loadingChart= false;
			if (!response.success)
				return this.alert.error(response.message);

			if (!response.data)
				return;

			chart.data = response.data;
		});
	}

	loadingMentions = false;
	Mentions = [];

	loadChartedMentions(event)
	{
		console.log(event);

		this.Mentions = [];
		for(let activeChart of event.active)
		{
			let chart = this.Charts[activeChart._datasetIndex];
			if(!chart.data)
				continue;
			let dataPoint = chart.data[activeChart._index];
			console.log("dataPoint:", dataPoint);
			this.getMentionsAtMoment(chart.tracker._id, dataPoint.timestamp / 1000, this.StepSize);
		}
		//this.getMentionsAtMoment(trackerId, event.moment, this.StepSize);
	}


	getMentionsAtMoment(trackerId, Moment, Interval)
	{
		this.loadingMentions = true;
		console.log("Loading mentions:", trackerId, Moment, Interval);
		this.request.get("/mentions/getMoment/" + trackerId + "/" + Moment + "/" + Interval).then( response => {
			this.loadingMentions = false;
			if(!response.success)
			{
				console.log("Error:", response.message);
				return this.alert.error(response.message);
			}
			console.log("Loaded mentions:", response.mentions.length);
			Array.prototype.push.apply(this.Mentions, response.mentions);
		});
	}
}
