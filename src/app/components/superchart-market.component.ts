import { Component, OnInit, OnDestroy, ViewChild, Input, Output, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';

import { LineChart, DataSet, TimeSet } from "./superchart";
import { ChartStyle } from "./chartstyle";
import * as moment from "moment";
import { NgZone} from "@angular/core";
// import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: 'superchart-market',
  templateUrl: './superchart.component.html',
  styleUrls: ['./superchart.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuperChartMarketComponent
{
	chart:LineChart = null;

	@ViewChild("superChart")
	superChart: ElementRef = null;

	@Input("data")
	data;

	dataset = new TimeSet();
	constructor(
		private zone: NgZone,
	)
	{
	}

	ngOnChanges(changes)
	{
		// console.log("Changed?", changes);
		if(!this.chart)
			return;

		this.zone.runOutsideAngular( () => {
			this.buildData();
		});

		console.log("chart changes?", changes);
	}

	ngOnInit()
	{
		// //ChartStyle
		 this.zone.runOutsideAngular( () => {
			this.chart = new LineChart(this.superChart.nativeElement, null, ChartStyle);

			this.chart.addDataSet(this.dataset, {
				"color": "#5f758c",
				"color.hover": "#7c93aa",
			});
			this.buildData();
		});
	}

	ngOnDestroy()
	{

		this.chart.destroy();
	}

	buildData()
	{
		// console.log("this.data:", this.data);

		if(!this.data)
			return;

		// this.data.map( item => {
		// 		return {
		// 			t: new Date(item.itemstamp),
		// 			value: item.Price
		// 		};
		// 	});

		var labels = [];
		this.dataset.clear();
		//this.dataset.set(this.data);
		for(var i =0;i<this.data.length;++i)
		{
			this.dataset.push({
				t: new Date(this.data[i].timestamp),
				value: this.data[i].Price
			});

			//this.dataset.push(this.data[i].Price);
			labels.push(moment.localeData('en').weekdaysShort(moment(this.data[i].date)));
		}
		this.chart.setLabels(labels);
		this.chart.forceUpdate();
	}
	
	display()
	{
		this.chart.forceUpdate();
	}
}
