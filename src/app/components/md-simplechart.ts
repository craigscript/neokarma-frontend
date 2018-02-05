import {
  OnDestroy,
  OnInit,
  OnChanges,
  EventEmitter,
  ElementRef,
  Input,
  Output,
  NgModule,
  SimpleChanges,
  Directive,
  Component,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { TdLoadingService, TdMediaService } from '@covalent/core';
import { SimpleChart } from "./chart/SimpleChart";

/* tslint:disable-next-line */
@Component({
  selector: 'md-simplechart',
  styleUrls: ["md-simplechart.scss"],
  templateUrl: './md-simplechart.html',
})
export class MdSimpleChart implements OnDestroy, OnChanges, OnInit
{
	@ViewChild("chartCanvas")
	ChartTarget: ElementRef;

	@Input("type")
	ChartType: string;

	@Input("data")
	ChartData: any;

	@Input("speed")
	Speed: any = 5;

	Chart = null;

	constructor(
		public media: TdMediaService,
		private changeDetectorRef: ChangeDetectorRef
	)
	{
	}

	public ngAfterViewInit()
	{
		this.createChart();
	}

	public ngOnChanges(changes: SimpleChanges): void
	{
		if(changes.ChartData)
		{
			this.createChart();
		}
		
	}

	public ngOnInit()
	{

	}
	
	public ngOnDestroy():any
	{
	}

	public createChart()
	{
		if(!this.Chart)
		{

			let Options = {
				Colors: [
					"#519CAE",
					"#719C41",
				],
				FontSize: "18",
				Font: "Arial",
				FontColor: "#9F9395",
				Size: 3,
				DonutScale: 0.2,
				Background: "#ffffff",
				Border: {
					Color: "rgb(41,128,185)",
					Size: 0,
				},
				Speed: this.Speed,
			};

			if(this.ChartType == "donut")
			{
				Options.Colors = [
					"#EFF3F5",
					"#719C41",
				];
			}
			this.Chart = new SimpleChart(this.ChartTarget.nativeElement, this.ChartType, this.ChartData, Options);
		}else{
			this.Chart.update(this.ChartData);
		}

	}
}