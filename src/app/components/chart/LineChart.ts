import { ChartDrawer } from "./ChartDrawer";
import { ChartMath } from "./ChartMath";

export class LineChart extends ChartDrawer
{
	lastUpdate = 0;

	constructor(Options)
	{
		super();
		this.lastUpdate = Date.now();
	}

	Current = [];
	Target = [];

	public update(Canvas, Context, Data, Options)
	{
		// Clear the chart
		Context.clearRect(0, 0, Canvas.width, Canvas.height);

		if(!Data || !Data.length)
			return;

		this.Target = Data;
		this.updateTarget(Options);

		// Calculate Stepping & Normalize Data
		let PointDistance = Canvas.width / (this.Current.length - 1);
		let ratio = Math.max.apply(Math, this.Current.map(Math.abs)) / 1;
		let values = this.Current.map((item) => {
			return item / ratio;
		});

		// Calculate Origin
		let Min = Math.min.apply(Math, values);
		let Max = Math.max.apply(Math, values);
		let Origin = ((Canvas.height - Options.Border.Size) / 4);
		
		
		// Track X Stepping
		let XTracker = 0;

		let LastPosition = {
			x: XTracker,
			y: this.mapValue(values[0], Min, Max, Canvas.height - Origin, Origin)
		};

		// let CurrentPosition = {
		// 	x: XTracker,
		// 	y: Canvas.height
		// };

		for(let i=1;i<values.length;++i)
		{
			var value = this.mapValue(values[i], Min, Max, Canvas.height - Origin, Origin);
			var CurrentPosition = { x: XTracker, y: value };
			this.drawLine(Canvas, Context, Origin, LastPosition, CurrentPosition, Options.Size, Options.Colors[0]);
			XTracker += PointDistance;
			LastPosition = Object.assign({}, CurrentPosition);
		}

		// Draw origo
		// if(Origin != Canvas.height)
		// {
		// 	Context.lineWidth = Options.Border.Size;
		// 	Context.strokeStyle = Options.Border.color;
		// 	Context.beginPath();
		// 	Context.moveTo(0, Origin);
		// 	Context.lineTo(Canvas.width, Origin);
		// 	Context.stroke();
		// }
		
	}

	mapValue(number, in_min, in_max, out_min, out_max)
	{
		return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}


	public drawLine(Canvas, Context, Origin, PositionA, PositionB, Size, Color)
	{
		Context.lineWidth = Size;
		Context.strokeStyle = Color;
		Context.beginPath();
		Context.moveTo(PositionA.x, PositionA.y);
		Context.quadraticCurveTo(PositionA.x, PositionA.y, PositionB.x, PositionB.y);
		Context.stroke();
	}

	public updateTarget(Options)
	{
		var now = Date.now();
		var Delta = (now - this.lastUpdate) / 1000;
		this.lastUpdate = now;

		if(this.Current.length < this.Target.length)
		{
		//	this.Current = [];
			var initial = 0;
			if(this.Current.length > 0)
			{
				initial = this.Current[this.Current.length - 1];
			}
			
			for(let i=this.Current.length;i<this.Target.length;++i)
			{
				this.Current.push(initial);
			}
		}

		if(this.Current.length > this.Target.length)
		{
			this.Current = this.Current.slice(0, this.Target.length);
			// for(let i=0;i<this.Target.length;++i)
			// {
			// 	this.Current.push(0);
			// }
		}

		for(let i=0;i<this.Target.length;++i)
		{
			this.Current[i] = ChartMath.Interpolate(this.Current[i], this.Target[i], Delta, Options.Speed);
		}
		
	}

	public requiresUpdate()
	{
		for(let i=0;i<this.Target.length;++i)
		{
			if(Math.abs(this.Current[i] - this.Target[i]) > 0.00000000001)
				return true;
		}
		return false;
	}
	
};