import { Component, OnInit, OnDestroy, ViewChild, Input, Output, ElementRef } from '@angular/core';

import { LineChart, DataSet, TimeSet } from "./superchart";
import { ChartStyle } from "./chartstyle";


@Component({
  selector: 'superchart',
  templateUrl: './superchart.component.html',
  styleUrls: ['./superchart.component.scss']
})
export class SuperChartComponent
{
	chart:LineChart = null;

	@ViewChild("superChart")
	superChart: ElementRef = null;

	@Input("data")
	data = [];

	@Input("chartType")
	chartType = "line";

	@Input("labels")
	labels = [];

	dataset = new TimeSet();
	
	constructor()
	{
	
	}

	ngOnChanges(changes)
	{
		console.log("Changes:", changes, this.chart)

		if(!this.chart)
			return;
		
		
		if(this.data)
		{
			this.dataset.set(this.data);
		}

		if(this.labels)
		{
			this.chart.setLabels(this.labels);
		}
	}
	
	ngOnInit()
	{
		this.chart = new LineChart(this.superChart.nativeElement, null, ChartStyle);

		this.chart.addDataSet(this.dataset, {
			"color": "#c26dff",
			"color.hover": "#6a3177",
		});
		this.dataset.set(this.data);
		this.chart.setLabels(this.labels);
		
	}

	ngOnDestroy()
	{

		this.chart.destroy();
	}
}
