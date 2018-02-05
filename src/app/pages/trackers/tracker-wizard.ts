import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MdDialog } from '@angular/material';
import { TdMediaService } from "@covalent/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Request, Alert } from "../../services";
// Source Dialogs
import { TrackersRedditSourceDialog } from "./dialogs/reddit-source.dialog";
import { TrackersMarketSourceDialog } from "./dialogs/market-source.dialog";
import { TrackersTwitterSourceDialog } from "./dialogs/twitter-source.dialog";
import { TrackersMentionSourceDialog } from "./dialogs/mention-source.dialog";
// Editor Dialogs
import { TrackersExporterDialog } from "./dialogs/exporter.dialog";
import { TrackersSourceActionDialog } from "./dialogs/action.dialog";
import { ExporterMap, SumExporterDialog } from "./exporters";
import * as moment from 'moment-timezone';

export const TrackerDialogs: any[] = [
	// Source Types
	TrackersRedditSourceDialog,
	TrackersMarketSourceDialog,
	TrackersTwitterSourceDialog,
	TrackersMentionSourceDialog,
	// Exporters
	SumExporterDialog,
];

@Component({
  selector: 'neo-trackers-tracker-wizard',
  templateUrl: './tracker-wizard.html',
  styleUrls: ['./tracker-wizard.scss'],
})
export class TrackersTrackerWizard implements OnInit
{
	loadingTracker = false;
	TrackerId = null;
	Tracker: any = {
		sources: [],
		exporters: [],
	};
	SourceDialogMap: any = {
		reddit: TrackersRedditSourceDialog,
		market: TrackersMarketSourceDialog,
		twitter: TrackersTwitterSourceDialog,
		mention: TrackersMentionSourceDialog,
	};
	ExporterDialogMap = ExporterMap;

	@ViewChild("sourceStep") sourceStep;
	@ViewChild("exportsStep") exportsStep;
	@ViewChild("finalStep") finalStep;

	userTimezone: any;
	timezones = [];

  constructor(
		public media: TdMediaService,
		private titleService: Title,
		public alert: Alert,
		public dialog: MdDialog,
		public request: Request,
		public route: ActivatedRoute
	)
	{

	}

	ngOnInit()
	{
		this.route.params.subscribe((params) => {
			if(params.trackerId)
			{
				this.getTracker(params.trackerId);
			}
		});
		this.titleService.setTitle( 'Mentions Monitor' );
		this.createOptions();
		// get timezones
		this.timezones = moment.tz.names();
		// get user timezone
		this.userTimezone = moment.tz.guess();
		// get timezone offset
		//console.log(moment.tz(this.userTimezone).format("Z"));
	}

	getTracker(trackerId)
	{
		this.loadingTracker = true;
		this.request.get("/trackers/getTracker/" + trackerId).then( response => {
			this.loadingTracker = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.Tracker = response.tracker;
			this.TrackerId = trackerId;
			this.getTrackerData();
		});
	}

	addSource(type)
	{
		let dialogRef = this.dialog.open(this.SourceDialogMap[type], {
			data: {
				name: "",
				target: "",
				options: {},
			}
		});

		dialogRef.afterClosed().subscribe( sourceData => {

			if(!sourceData)
				return;

			let loading = this.alert.loading("Please wait.");
			this.request.post("/trackers/createSource/" + this.Tracker._id, {
				name: sourceData.name,
				type: type,
				target: sourceData.target,
				options: sourceData.options,
			}).then( response => {
				loading.close();
				if(!response.success)
				{
					return this.alert.error(response.message);
				}
				this.Tracker.sources.push(response.source);
			});

		});
	}

	editSource(source)
	{
		let dialogRef = this.dialog.open(this.SourceDialogMap[source.type], {
			data: JSON.parse(JSON.stringify(source))
		});

		dialogRef.afterClosed().subscribe( sourceData => {
			if(!sourceData)
				return;

			let loading = this.alert.loading("Please wait.");
			this.request.post("/trackers/updateSource/" + this.Tracker._id + "/" + source._id, {
				name: sourceData.name,
				target: sourceData.target,
				options: sourceData.options,
			}).then( response => {
				loading.close();
				if(!response.success)
				{
					return this.alert.error(response.message);
				}
				source.name = sourceData.name;
				source.target = sourceData.target;
				source.options = sourceData.options;
			});
		});
	}

	deleteSource(source)
	{
		let dialogRef = this.alert.confirm("Confirm Delete", "Are you sure you want to delete this source?");

		dialogRef.afterClosed().subscribe(result => {
			if(!result)
				return;

			let loading = this.alert.loading("Removing source...");
			this.request.get("/trackers/deleteSource/" + this.Tracker._id + "/" +  source._id).then( response => {
				loading.close();
				if(!response.success)
					return this.alert.error(response.message);

				this.Tracker.sources.splice(this.Tracker.sources.indexOf(source), 1);
			});
		});
	}

	addExporter()
	{
		let dialogRef = this.dialog.open(TrackersExporterDialog, {
			data: this.ExporterDialogMap,
		});

		dialogRef.afterClosed().subscribe( exporterName => {
			console.log("Dialog result:", exporterName);
			if(!exporterName)
				return;

			let exporter = {
				name: exporterName,
				params: {},
			};
			this.Tracker.exporters.push(exporter);
			this.editExporter(exporter);
		});
	}

	editExporter(exporter)
	{
		let dialogRef = this.dialog.open(this.ExporterDialogMap[exporter.name].DialogComponent, {
			data: exporter.params
		});

		dialogRef.afterClosed().subscribe( data  => {
			if(!data)
				return;

			exporter.params = data;
		});
	}

	removeExporter(exporter)
	{
		this.Tracker.exporters.splice(this.Tracker.exporters.indexOf(exporter), 1);
	}

	saveExporters()
	{
		this.saveTracker().then(() => {
			this.exportsStep.active = false;
			this.finalStep.active = true;
		});
	}

	saveTracker()
	{
		this.loadingTracker = true;
		return this.request.post("/trackers/updateTrackerData/" + this.Tracker._id, {
			exporters: this.Tracker.exporters
		}).then( response => {
			this.loadingTracker = false;
			if(!response.success)
			{
				this.alert.error(response.message);
			}
		});
	}

	// Chart API
	TrackerData: any [] = null;
	loadingChart = false;
	DataInterval = 1800;
	EndDate = new Date(Date.now() + (3600 * 12 * 1000) );
	StartDate = new Date(Date.now() - (3600 * 12 * 1000) );
	public ChartData = [];
	public ChartLabels  = [];
	public ChartOptions: any = { responsive: true };
	public ChartType = 'line';
	public ShouldStackCharts = false;
	public ShouldNormalize = false;

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
		this.getTrackerData();
	}

	endDateChanged($event)
	{
		this.EndDate = $event;
		this.getTrackerData();
	}

	SetDataInterval(DataInterval)
	{
		this.DataInterval = DataInterval;
		this.getTrackerData();
	}

	updateChart()
	{
		this.ChartData = new Array();
		this.ChartLabels = [];
		let i = 0;

		if(!this.TrackerData)
			return;

		let values = [];

		for(let data of this.TrackerData)
		{
			//values.push(data.value);
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
			label: this.Tracker.name,
		});

		// this.ChartLabels = this.ChartLabels.sort((a, b) => {
		// 	if(a > b)
		// 		return 1;
		// });
		this.loadingChart = false;
		this.createOptions();
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

	getTrackerData()
	{
		this.loadingChart = true;
		return this.request.get("/trackers/getTrackerData/" + this.TrackerId + "/" + this.DataInterval + "/" + (this.StartDate.getTime()/1000) + "/" + (this.EndDate.getTime()/1000) + "/").then( response => {
			this.loadingChart = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}

			if(!response.data)
				return;

			this.TrackerData = response.data;
			this.updateChart();
		});
	}
}
