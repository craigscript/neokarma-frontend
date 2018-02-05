import { Chart } from "./Chart";
import { LineChartStyle } from "./Styles/LineChartStyle";
import { RenderableLine, RenderableTicks } from "./Renderer";
import { Scales } from "./Scales";
import { DataSet } from "./Datasets";
import { ChartMath } from "./Utils/ChartMath";

export class LineChart extends Chart
{	
	leftAxis:RenderableTicks = null;
	bottomAxis:RenderableTicks = null;
	labels = [];

	datasets:DataSet[] = [];
	lines: RenderableLine[] = [];
	Options = {
		scale: "lineear"
	};
	drawRect:any= {};
	

	getDrawingRect()
	{
		return {
			top: (this.Canvas.height / 100 ) * (this.Styles.general.padding + (this.Styles.general["padding-top"] || 0)),
			left: (this.Canvas.width / 100 ) * (this.Styles.general.padding + (this.Styles.general["padding-left"] || 0)),
			right: this.Canvas.width - (this.Canvas.width / 100 ) * (this.Styles.general.padding + (this.Styles.general["padding-right"] || 0)),
			bottom: this.Canvas.height - (this.Canvas.height / 100 ) * (this.Styles.general.padding + (this.Styles.general["padding-bottom"] || 0)),
		};
	}

	constructor(Canvas, Options={}, StyleOverrides:any = {})
	{
		super(Canvas, Object.assign(LineChartStyle, StyleOverrides));
		
		// Override default options
		this.Options = Object.assign(this.Options, Options);

		// Axes

		this.leftAxis = new RenderableTicks(this.Styles.axes);
		this.bottomAxis = new RenderableTicks(this.Styles.axes);

		this.leftAxis.ZIndex = -1;
		this.bottomAxis.ZIndex = -1;
		this.addObject(this.leftAxis);
		this.addObject(this.bottomAxis);

	

	}

	addDataSet(dataset: DataSet, Styles={})
	{
		this.datasets.push(dataset);
		let line = new RenderableLine([], Object.assign(this.Styles.lines, Styles));
		
		// Line charts should be in the front
		line.ZIndex = 1;

		this.lines.push(line);
		this.objects.push(line);
	}

	setLabels(labels)
	{
		this.labels = labels;
	}

	resized(width, height)
	{
		this.drawRect = this.getDrawingRect();
		for(var dataset of this.datasets)	
		{
			dataset.markDirty();
		}
		this.chartDirty = true;
	}

	tick(deltaTime)
	{
		super.tick(deltaTime);

		let updated = false;
		this.drawRect = this.getDrawingRect();
		for(let i = 0;i<this.datasets.length;++i)
		{
			if(this.processDataSet(this.lines[i], this.datasets[i]))
				updated = true;
		}

		if(updated)
		{
			this.chartDirty = true;
			this.updateAxes();
		}
	
	}

	updateAxes()
	{
		// Axes
		this.leftAxis.setTickPoints(
			{x: this.drawRect.left, y: this.drawRect.bottom},
			{x: this.drawRect.left, y: this.drawRect.top}
		);

		this.bottomAxis.setTickPoints(
			{x: this.drawRect.left, y: this.drawRect.bottom},
			{x: this.drawRect.right, y: this.drawRect.bottom}
		);
	}
	
	render(deltaTime)
	{
		if(!this.lines)
			return;
		
		if(!this.chartDirty)
			return;

	
		// Clear canvas with clear color
		this.Context.fillStyle = this.Styles.general.background;
		this.Context.fillRect(0, 0, this.Canvas.width, this.Canvas.height);


		// Render labels
		//this.Context.save();

		

		this.Context.restore();
		
		this.renderYLabels();
		this.renderXLabels();

		// Render objects
		for(let object of this.objects)
		{
			this.renderObject(object);
		}

		this.chartDirty = false;
	}

	renderYLabels()
	{
		var ranges = this.getRanges();
		

		var maxYTicks = this.Styles["labels"]["y-ticks"];
		this.Context.fillStyle = "#000000";
		this.Context.font = this.Styles["labels"]["font-size"] + "px " + this.Styles["labels"]["font"];

		for(var i=0;i<maxYTicks;++i)
		{
			var rangeStep = ChartMath.MapRange(i, 0, maxYTicks - 1, ranges.min, ranges.max);
			var posY = ChartMath.MapRange(i, 0, maxYTicks, this.drawRect.bottom, this.drawRect.top);
			var label = Math.floor(rangeStep).toString();
			var textWidth = this.Context.measureText(label).width;
			this.Context.fillText(label, this.drawRect.left - textWidth - this.Styles["labels"]["padding"], posY);
		}

		
	}

	renderXLabels()
	{
		var labels = this.getLabels();

		if(!labels.length)
			return;
		
		
		var maxXTicks = this.Styles["labels"]["x-ticks"];
		var lineHeight =  this.Styles["labels"]["font-size"];

		
		var xC= 0;
		
		for(var i=0;i<maxXTicks;++i)
		{
			var posX = ChartMath.MapRange(i, 0, maxXTicks - 1, this.drawRect.left, this.drawRect.right);
			var tickIndex = Math.floor(ChartMath.MapRange(i, 0, maxXTicks - 1, 0, labels.length));

			let textWidth = this.Context.measureText(labels[tickIndex]).width;

			this.Context.save();		
			this.Context.translate(posX + textWidth, this.drawRect.bottom);
			this.Context.rotate(-Math.PI / (180/75));	
			this.Context.fillText(labels[tickIndex], -textWidth - this.Styles["labels"]["padding"],  - this.Styles["labels"]["padding"]);
			this.Context.restore();
			
			xC += textWidth;
		}
	}

	getLabels()
	{
		return this.labels;
	}

	getScales()
	{
		return {
			max: Math.max.apply(null, this.datasets.map( dataset => dataset.getMaxScale())),
			min: Math.min.apply(null, this.datasets.map( dataset => dataset.getMinScale()))
		};
	}

	getRanges()
	{
		return {
			max: Math.max.apply(null, this.datasets.map( dataset => dataset.max)),
			min: Math.min.apply(null, this.datasets.map( dataset => dataset.min))
		};
	}

	processDataSet(line: RenderableLine, dataset: DataSet)
	{
		// If its not dirty then theres nothing to do.
		if(!dataset.isDirty)
			return false;
		
		// Clear the points in the line
		line.clearPoints();
		var points = dataset.getPoints();
		var Scales = this.getScales();

		// Add all line points
		for(let i=0;i<points.length;++i)
		{
			var x = ChartMath.MapRange(dataset.getScaledStep(i, Scales), Scales.min, Scales.max, this.drawRect.left, this.drawRect.right);
			var y = ChartMath.MapRange(dataset.getValue(i), dataset.min, dataset.max, this.drawRect.bottom, this.drawRect.top);
			line.addPoint(x, y);
		}

		dataset.isDirty = false;
		return true;
	}

	

	drawing: boolean = false;

	mouseDown()
	{
		this.drawing = true;
	}

	mouseUp()
	{
		this.drawing = false;
	}

	mouseMove(x, y)
	{
		if(!this.drawing)
			return;

		for(let line of this.lines)
		{
		//	line.addPoint(x, y);
		}
	}

	scaleDataset()
	{
		if(!Scales[this.Options.scale])
			throw new Error("Invalid scale:" + this.Options.scale);
		return Scales[this.Options.scale].ScaleDataset();
	}	

};