import { Component, ViewChild, Input, Output, OnInit, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { ChartRenderer, BarLineChart } from "./ChartRenderer";

@Component({
  selector: 'superchart',
  templateUrl: './superchart.component.html',
  styleUrls: ['./superchart.component.css']
})
export class SuperChartComponent implements OnInit, OnChanges
{
	@ViewChild("chartCanvas")
	canvas: ElementRef;

	@Input("datasets")
	datasets = [];

	@Input("stylesheet")
	stylesheet = {};
	
	renderer: ChartRenderer = null;

	constructor()
	{

	}
	
	ngOnInit()
	{
		this.renderer = new ChartRenderer(this.canvas.nativeElement);
		this.renderer.addRenderable(new BarLineChart([1, 2, 3], this.renderer));
	}

	ngOnChanges(changes: SimpleChanges)
	{
		console.log("properties changed:", changes)
	}

	addDataset()
	{

	}
}
