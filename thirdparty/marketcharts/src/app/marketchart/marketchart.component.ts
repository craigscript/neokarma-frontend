import { Component, OnInit, OnDestroy, ViewChild, Input, Output } from '@angular/core';
import { CanvasDrawer, RenderableObject } from "./chart";
import { DataSet, LineChart, Axes } from "./chart";

@Component({
	selector: 'marketchart',
	templateUrl: './marketchart.component.html',
	styleUrls: ['./marketchart.component.scss']
})
export class MarketChartComponent implements OnInit, OnDestroy
{
	drawer:CanvasDrawer = null;

	@ViewChild("marketChart")
	marketChart;

	@Input("prices")
	prices: number[] = [];
	
	constructor()
	{
		
	}

	ngOnInit()
	{
		this.drawer = new CanvasDrawer(this.marketChart);
		this.drawer.addObject(new Axes());
		let chart = new LineChart([
			new DataSet([0, 25, 50, 25, 0, 25, 50, 75, 100]),
		]);
		this.drawer.addObject(chart);
	}

	addObject(object: RenderableObject)
	{
		this.drawer.addObject(object);
	}

	ngOnDestroy()
	{
		this.drawer.destroy();
	}
}
