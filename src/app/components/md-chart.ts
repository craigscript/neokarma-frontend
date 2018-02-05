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
import "moment";
import { Chart } from 'chart.js';


/* tslint:disable-next-line */
@Component({
	selector: 'md-chart',
	styleUrls: ["md-chart.scss"],
	templateUrl: './md-chart.html',
})
export class MdChart implements OnDestroy, OnChanges, OnInit
{
	chartMediaQuery = null;
	chartLastMedia = true;
	ChartIsFullScreen = false;

	constructor(
		public media: TdMediaService,
		private changeDetectorRef: ChangeDetectorRef
	)
	{
	}

	toggleFullScreen()
	{
		this.ChartIsFullScreen = !this.ChartIsFullScreen;
	}

	ngAfterViewInit()
	{
		this.media.broadcast();
		// Refresh chart on size change.
		// this.chartMediaQuery = this.media.registerQuery("gt-sm").subscribe(()=> {
			
		// 	let currentMedia = this.media.query('gt-sm');
		// 	if(currentMedia != this.chartLastMedia)
		// 	{
		// 		this.refresh();
		// 		console.log("Refreshing chart");
		// 	}
		// 	this.chartLastMedia = currentMedia;
			
		
		// });
		
		this.changeDetectorRef.detectChanges();
	}

	getChartLayouts()
	{
		if(this.media.query('gt-sm'))
		{
			return {
				padding: {
					left: 0,
					right: 0,
					top: 0,
					bottom: 0
				}
			}
		}else{
			return {
				padding: {
					left: 5,
					right: 5,
					top: 5,
					bottom: 5
				}
			}
		}
	}

	getCharFontSize()
	{
		if(this.media.query('gt-sm'))
		{
			return 14;
		}else{
			return 8;
		}
	}

	getTooltipPadding()
	{
		if(this.media.query('gt-sm'))
		{
			return 15;
		}else{
			return 2;
		}
	}

	public static defaultColors:Array<number[]> = [
		[26, 188, 156],
		[46, 204, 113],
		[52, 152, 219],
		[155, 89, 182],
		[52, 73, 94],
		[22, 160, 133],
		[39, 174, 96],
		[41, 128, 185],
		[142, 68, 173],
		[44, 62, 80],
		[241, 196, 15],
		[230, 126, 34],
		[231, 76, 60],
		[236, 240, 241],
		[149, 165, 166],
		[243, 156, 18],
		[211, 84, 0],
		[192, 57, 43],
		[189, 195, 199],
		[127, 140, 141], 
	];

	public getChartColor(index)
	{
		if(!this.chart)
			return "";
		if(!this.chart.data.datasets[index])
		{
			return "";
		}
		return this.chart.data.datasets[index].backgroundColor;
	}

	@Input() public data:number[] | any[];
	@Input() public datasets:any[];
	@Input() public labels:Array<any> = [];
	@Input() public options:any = {};
	@Input() public chartType:string;
	@Input() public colors:Array<any>;
	@Input() public legend:boolean;

	@Output() public chartClick:EventEmitter<any> = new EventEmitter();
	@Output() public chartHover:EventEmitter<any> = new EventEmitter();
	@ViewChild("chartCanvas") CanvasElement: ElementRef;

	public ctx:any;
	public chart:any;
	private cvs:any;
	private initFlag:boolean = false;

	public ngOnInit():any
	{
		this.ctx = this.CanvasElement.nativeElement.getContext('2d');
		this.cvs = this.CanvasElement.nativeElement;
		this.initFlag = true;
		if (this.data || this.datasets)
		{
			this.refresh();
		}
		if(this.chartMediaQuery)
		{
			this.chartMediaQuery.unsubscribe();
			this.chartMediaQuery = null;
		}
		
	}

	public ngOnChanges(changes: SimpleChanges): void
	{
		
		if (this.initFlag)
		{
			
			if(changes.hasOwnProperty('options') || changes.hasOwnProperty("labels"))
			{
				return this.refresh();
			}
			// Check if the changes are in the data or datasets
			if (changes.hasOwnProperty('data') || changes.hasOwnProperty('datasets'))
			{
				if(this.chart.data.datasets.length != changes['datasets'].currentValue.length)
				{
					this.refresh();
				}
				if (changes['data'])
				{
					this.updateChartData(changes['data'].currentValue);
				} else {
					this.updateChartData(changes['datasets'].currentValue);

				}

			this.chart.update();
			} else {
				// otherwise rebuild the chart
				this.refresh();
			}
		}
	}

	public ngOnDestroy():any {
		
		if (this.chart)
		{
			this.chart.destroy();
			this.chart = void 0;
		}
	}

	public getChartBuilder(ctx:any/*, data:Array<any>, options:any*/):any {
		let datasets:any = this.getDatasets();

		let options:any = Object.assign({
	}, this.options);
		if (this.legend === false) {
			options.legend = {display: false};
		}
	options.responsive = true;
	options.layout = this.getChartLayouts();

	// options.layout = {
	// 	padding: {
	// 		left: 0,
	// 		right: 0,
	// 		top: 0,
	// 		bottom: 0
	// 	}
		// };

	options.tooltips = {
		position: 'nearest',
	//	mode: 'x',
		intersect: false,
		yPadding: this.getTooltipPadding(),
		xPadding: this.getTooltipPadding(),
		caretSize: this.getTooltipPadding(),
		cornerRadius: 0,
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
		titleFontColor: 'rgb(0, 0, 0)',
		bodyFontColor: 'rgb(0, 0, 0)',
		borderColor: 'rgba(0,0,0, 1)',
		titleFontSize: this.getCharFontSize(),
		footerFontSize: this.getCharFontSize(),
		bodyFontSize: this.getCharFontSize(),
		borderWidth: 1
	};

		// hock for onHover and onClick events
		options.hover = options.hover || {};
		if (!options.hover.onHover) {
			options.hover.onHover = (active:Array<any>) => {
				if (active && !active.length) {
					return;
				}
				this.chartHover.emit({active});
			};
		}

		if (!options.onClick) {
			options.onClick = (event:any, active:Array<any>) => {
				this.chartClick.emit({event, active});
			};
		}

		let opts = {
			type: this.chartType,
			data: {
				labels: this.labels,
				datasets: datasets
			},
			options: options
		};
		
		return new Chart(ctx, opts);
	}

	private updateChartData(newDataValues: number[] | any[]): void
	{
		if(!newDataValues.length)
			return;
		
		if (Array.isArray(newDataValues[0].data))
		{
			this.chart.data.datasets.forEach((dataset: any, i: number) => {
				dataset.data = newDataValues[i].data;

				if (newDataValues[i].label)
				{
					dataset.label = newDataValues[i].label;
				}
				
				dataset.hidden = newDataValues[i].hidden;
				dataset.type = newDataValues[i].type;
			});
		} else {
			this.chart.data.datasets[0].data = newDataValues;
		}
		
	}

	private getDatasets():any {
		let datasets:any = void 0;
		// in case if datasets is not provided, but data is present
		if (!this.datasets || !this.datasets.length && (this.data && this.data.length)) {
			if (Array.isArray(this.data[0])) {
				datasets = (this.data as Array<number[]>).map((data:number[], index:number) => {
					return {data, label: this.labels[index] || `Label ${index}`};
				});
			} else {
				datasets = [{data: this.data, label: `Label 0`}];
			}
		}

		if (this.datasets && this.datasets.length ||
			(datasets && datasets.length)) {
			datasets = (this.datasets || datasets)
				.map((elm:number, index:number) => {
					let newElm:any = Object.assign({}, elm);
					if (this.colors && this.colors.length) {
						Object.assign(newElm, this.colors[index]);
					} else {
						Object.assign(newElm, getColors(this.chartType, index, newElm.data.length));
					}
					return newElm;
				});
		}

		if (!datasets)
	{
		return [];
		}
		return datasets;
	}

	private refresh():any {


		// todo: remove this line, it is producing flickering
		this.ngOnDestroy();
		
		this.chart = this.getChartBuilder(this.ctx/*, data, this.options*/);
	}
}

// private helper functions
export interface Color {
	backgroundColor?:string | string[];
	borderWidth?:number | number[];
	borderColor?:string | string[];
	borderCapStyle?:string;
	borderDash?:number[];
	borderDashOffset?:number;
	borderJoinStyle?:string;

	pointBorderColor?:string | string[];
	pointBackgroundColor?:string | string[];
	pointBorderWidth?:number | number[];

	pointRadius?:number | number[];
	pointHoverRadius?:number | number[];
	pointHitRadius?:number | number[];

	pointHoverBackgroundColor?:string | string[];
	pointHoverBorderColor?:string | string[];
	pointHoverBorderWidth?:number | number[];
	pointStyle?:string | string[];

	hoverBackgroundColor?:string | string[];
	hoverBorderColor?:string | string[];
	hoverBorderWidth?:number;
}

// pie | doughnut
export interface Colors extends Color {
	data?:number[];
	label?:string;
}

function rgba(colour:Array<number>, alpha:number):string {
	return 'rgba(' + colour.concat(alpha).join(',') + ')';
}

function getRandomInt(min:number, max:number):number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatLineColor(colors:Array<number>):Color {
	return {
		backgroundColor: rgba(colors, 0.4),
		borderColor: rgba(colors, 1),
		pointBackgroundColor: rgba(colors, 1),
		pointBorderColor: '#fff',
	pointRadius: 5,
	pointHoverRadius: 7,
	pointHitRadius: 10,
	pointStyle: 'rect',
		pointHoverBackgroundColor: '#fff',
		pointHoverBorderColor: rgba(colors, 0.8)
	};
}

function formatBarColor(colors:Array<number>):Color {
	return {
		backgroundColor: rgba(colors, 0.6),
		borderColor: rgba(colors, 1),
		hoverBackgroundColor: rgba(colors, 0.8),
		hoverBorderColor: rgba(colors, 1)
	};
}

function formatPieColors(colors:Array<number[]>):Colors {
	return {
		backgroundColor: colors.map((color:number[]) => rgba(color, 0.6)),
		borderColor: colors.map(() => '#fff'),
		pointBackgroundColor: colors.map((color:number[]) => rgba(color, 1)),
		pointBorderColor: colors.map(() => '#fff'),
		pointHoverBackgroundColor: colors.map((color:number[]) => rgba(color, 1)),
		pointHoverBorderColor: colors.map((color:number[]) => rgba(color, 1))
	};
}

function formatPolarAreaColors(colors:Array<number[]>):Color {
	return {
		backgroundColor: colors.map((color:number[]) => rgba(color, 0.6)),
		borderColor: colors.map((color:number[]) => rgba(color, 1)),
		hoverBackgroundColor: colors.map((color:number[]) => rgba(color, 0.8)),
		hoverBorderColor: colors.map((color:number[]) => rgba(color, 1))
	};
}

function getRandomColor():number[] {
	return [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
}

/**
 * Generate colors for line|bar charts
 * @param index
 * @returns {number[]|Color}
 */
function generateColor(index:number):number[] {
	return MdChart.defaultColors[index] || getRandomColor();
}

/**
 * Generate colors for pie|doughnut charts
 * @param count
 * @returns {Colors}
 */
function generateColors(count:number):Array<number[]> {
	let colorsArr:Array<number[]> = new Array(count);
	for (let i = 0; i < count; i++) {
		colorsArr[i] = MdChart.defaultColors[i] || getRandomColor();
	}
	return colorsArr;
}

/**
 * Generate colors by chart type
 * @param chartType
 * @param index
 * @param count
 * @returns {Color}
 */
function getColors(chartType:string, index:number, count:number) 
{
	if (chartType === 'pie' || chartType === 'doughnut') {
		return formatPieColors(generateColors(count));
	}

	if (chartType === 'polarArea') {
		return formatPolarAreaColors(generateColors(count));
	}

	if (chartType === 'line' || chartType === 'radar') {
		return formatLineColor(generateColor(index));
	}

	if (chartType === 'bar' || chartType === 'horizontalBar') {
		return formatBarColor(generateColor(index));
	}
	return generateColor(index);
}