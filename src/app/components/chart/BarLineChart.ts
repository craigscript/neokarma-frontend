import { ChartDrawer } from "./ChartDrawer";
import { ChartMath } from "./ChartMath";

export class BarLineChart extends ChartDrawer
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
		let Max = Math.max.apply(Math, this.Current.map(Math.abs));
		let ratio = Max / 1;
		let values = this.Current.map((item) => {
			return item / ratio;
		});

		// Calculate Origin
		
		// let Origin = Canvas.height;
		// let Min = Math.min.apply(Math, values);
		// if(Min < 0)
		// {
		// 	let Origin = Canvas.height + (Canvas.height * Min);
		// }

		// Calculate Origin
		let Min = Math.min.apply(Math, values);
		let Origin = Canvas.height + (Canvas.height * Min);
		
		// Track X Stepping
		let XTracker = 0;
		for(let i=0;i<values.length;++i)
		{
			this.drawLine(Canvas, Context, Origin, {x: XTracker, y: Origin - (Canvas.height * values[i])}, PointDistance, Options.Colors[0]);
			XTracker += PointDistance;
		}

		// Draw origo
		if(Origin != Canvas.height)
		{
			Context.lineWidth = Options.Border.Size;
			Context.strokeStyle = Options.Border.color;
			Context.beginPath();
			Context.moveTo(0, Origin);
			Context.lineTo(Canvas.width, Origin);
			Context.stroke();
		}

		if(this.Current.length > 0)
		{
			let Center = { 
				x: Canvas.width / 2,
				y: Canvas.height / 2,
			};
			Context.fillStyle = Options.FontColor;
			Context.font = Options.FontSize + "px " + Options.Font;
			
			let Sum = this.Current.reduce( (a, b) => {
				return a+b;
			});

			let text = Sum.toFixed(0);
			let textInfo = Context.measureText(text);
			Context.fillText(text, Center.x - (textInfo.width / 2), Center.y + (Options.FontSize / 3)); 
		
		}
			
	}

	public drawLine(Canvas, Context, Origin, LinePosition, Size, Color)
	{
		Context.lineWidth = Size + 1;
		Context.strokeStyle = Color;
		Context.beginPath();
		Context.moveTo(LinePosition.x, Origin);
		Context.lineTo(LinePosition.x, LinePosition.y);
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
			for(let i=this.Current.length;i<this.Target.length;++i)
			{
				this.Current.push(0);
			}
		}

		if(this.Current.length > this.Target.length)
		{
			this.Current = [];
			for(let i=0;i<this.Target.length;++i)
			{
				this.Current.push(0);
			}
		}

		for(let i=0;i<this.Target.length;++i)
		{
			this.Current[i] = ChartMath.Interpolate(this.Current[i], this.Target[i], Delta, Options.Speed);
			//console.log("this.Current:", this.Current[i], this.Target[i]);	
		}
		
	}

	public requiresUpdate()
	{
		for(let i=0;i<this.Target.length;++i)
		{
			if(this.Current[i] != this.Target[i])
				return true;
		}
		return false;
	}
	
};