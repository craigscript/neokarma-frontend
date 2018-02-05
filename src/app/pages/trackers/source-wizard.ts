import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from "@angular/router";
import { Request, Alert } from "../../services/";
import { TrackersSourceFilterDialog } from "./dialogs/filter.dialog";
import { TrackersSourceActionDialog } from "./dialogs/action.dialog";
import { RedditFilterMap, TwitterFilterMap, FilterDialogs, } from "./filters";
import { RedditActionMap, ActionDialogs } from "./actions";
import * as moment from 'moment-timezone';

export const SourceDialogs: any[] = [
	TrackersSourceActionDialog,

	// Filter Dialogs
	FilterDialogs,
	ActionDialogs,
];

@Component({
  selector: 'neo-trackers-sourcewizard',
  templateUrl: './source-wizard.html',
  styleUrls: ['./source-wizard.scss'],
})
export class TrackersSourceWizard implements OnInit
{
	trackerId: string;
	sourceId: string;
	Source: any = {};
	loading: boolean = false;
	FilterMap = {
		reddit: RedditFilterMap,
		twitter: TwitterFilterMap,
		mention: RedditFilterMap,
		market: RedditFilterMap,
	};
	ActionMap = {
		reddit: RedditActionMap,
		twitter: RedditActionMap,
		mention: RedditActionMap,
		market: RedditActionMap,
	};

	@ViewChild("filtersStep") filtersStep;
	@ViewChild("actionsStep") actionsStep;
	@ViewChild("finalStep") finalStep;

	userTimezone: any;
	timezones = [];

	constructor(
		public media: TdMediaService,
		private titleService: Title,
		public dialog: MdDialog,
		public router: Router,
		public location: Location,
		public route: ActivatedRoute,
		public request: Request,
		public alert: Alert
	)
	{
		route.params.subscribe((params) => {
			this.trackerId = params.trackerId;
			this.sourceId = params.sourceId;
			if(this.trackerId && this.sourceId)
			{
				this.getSource();
			}
		});
	}

	ngOnInit()
	{
		this.titleService.setTitle( 'Mentions Monitor' );
		this.createOptions();
		// get timezones
		this.timezones = moment.tz.names();
		// get user timezone
		this.userTimezone = moment.tz.guess();
		// get timezone offset
		//console.log(moment.tz(this.userTimezone).format("Z"));
	}

	getSource()
	{
		this.loading = true;
		this.request.get("/trackers/getSource/" + this.trackerId + "/" + this.sourceId).then( response => {
			this.loading = false;
			if(!response.success)
			{
				this.alert.error(response.message);
			}
			this.Source = response.source;
			this.getSourceData();
		});
	}

	getFilterMap()
	{
		return this.FilterMap[this.Source.type];
	}

	getFilterFromMap(filter)
	{
		return this.FilterMap[this.Source.type][filter];
	}

	addFilter()
	{
		let dialogRef = this.dialog.open(TrackersSourceFilterDialog, {
			data: this.getFilterMap()
		});

		dialogRef.afterClosed().subscribe( filterName => {
			if(!filterName)
				return;

			let filter = {
				name: filterName,
				data: {},
			};
			this.Source.filters.push(filter);
			this.editFilter(filter);
		});
	}

	editFilter(filter)
	{
		let Filter = this.getFilterFromMap(filter.name);
		if(!Filter.DialogComponent)
			return;

		let dialogRef = this.dialog.open(Filter.DialogComponent, {
			data: filter.data || {}
		});
		dialogRef.afterClosed().subscribe( data  => {
			if(!data)
				return;

			filter.data = data || {};
		});
	}

	removeFilter(filter)
	{
		this.Source.filters.splice(this.Source.filters.indexOf(filter), 1);
	}

	finishFilters()
	{
		this.saveSource().then(() => {
		//	this.filtersStep.active = false;
		//	this.actionsStep.active = true;
		});
	}

	getActionMap()
	{
		return this.ActionMap[this.Source.type];
	}

	getActionFromMap(action)
	{
		return this.ActionMap[this.Source.type][action];
	}

	addAction()
	{
		let dialogRef = this.dialog.open(TrackersSourceActionDialog, {
			data: this.getActionMap()
		});

		dialogRef.afterClosed().subscribe( actionName => {
			if(!actionName)
				return;

			let action = {
				name: actionName,
				data: {},
			};
			this.Source.actions.push(action);
			this.editAction(action);
		});
	}

	editAction(action)
	{
		let Action = this.getActionFromMap(action.name);
		if(!Action.DialogComponent)
			return;

		let dialogRef = this.dialog.open(Action.DialogComponent, {
			data: action.data || {}
		});
		dialogRef.afterClosed().subscribe( data  => {
			if(!data)
				return;

			action.data = data || {};
		});
	}

	removeAction(action)
	{
		this.Source.actions.splice(this.Source.actions.indexOf(action), 1);
	}

	finishActions()
	{
		this.saveSource().then(() => {
		//	this.actionsStep.active = false;
		//	this.finalStep.active = true;
		});
	}

	finishAll()
	{
		this.saveSource().then( () => {
			this.alert.success("Source ready.");
		});
	}

	saveSource()
	{
		this.loading = true;
		console.log("Actions:", this.Source.actions);
		return this.request.post("/trackers/updateSourceData/" + this.sourceId, {
			filters: this.Source.filters,
			actions: this.Source.actions,
		}).then( response => {
			this.loading = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.getSourceData();
		});
	}

	// Chart API
	SourceData: any[] = null;
	loadingChart: boolean = false;
	DataInterval = 1800;
	EndDate = new Date(Date.now() + (3600 * 12 * 1000) );
	StartDate = new Date(Date.now() - (3600 * 12 * 1000) );
	public ChartData:Array<any> = [];
	public ChartLabels:Array<any> = [];
	public ChartOptions:any = { responsive: true };
	public ChartType:string = 'line';
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
		this.getSourceData();
	}

	endDateChanged($event)
	{
		this.EndDate = $event;
		this.getSourceData();
	}

	SetDataInterval(DataInterval)
	{
		this.DataInterval = DataInterval;
		this.getSourceData();
	}

	updateChart()
	{
		this.ChartData = new Array();
		this.ChartLabels = [];
		let i = 0;

		if(!this.SourceData)
			return;

		let values = [];

		for(let data of this.SourceData)
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
			label: this.Source.name
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

	getSourceData()
	{
		this.loadingChart = true;
		this.loadingChart = true;
		return this.request.get("/trackers/getSourceData/" + this.trackerId + "/" + this.sourceId + "/" + this.DataInterval + "/" + (this.StartDate.getTime()/1000) + "/" + (this.EndDate.getTime()/1000) + "/").then( response => {
			this.loadingChart = true;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}

			if(!response.data)
				return;

			this.SourceData = response.data;
			this.updateChart();
		});
	}
}
