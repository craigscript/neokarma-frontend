import { ChartDrawer } from "./ChartDrawer";
import { ChartMath } from "./ChartMath";

export class DonutChart extends ChartDrawer
{
	constructor(Options)
	{
		super();
	}

	Current = [];
	Target = [];

	public update(Canvas, Context, Data, Options)
	{
		if(!Data || !Data.length)
			return;
		

		this.Target = Data;
		// let Max = this.Target.reduce((a, b) => {
		// 	return a+b;
		// });

		let Max = Math.max.apply(Math, this.Current.map(Math.abs));
		
		this.updateTarget(Options);
		Context.clearRect(0, 0, Canvas.width, Canvas.height);

		
		let Center = { 
			x: Canvas.width / 2,
			y: Canvas.height / 2,
		};
		let Radius = Math.min(Center.x, Center.y);

		let Start = 0;
		let End = 0;
		
		for(let l=0;l<this.Current.length;++l)
		{
			let Current = this.Current[l];
			End = 2 * Math.PI * (Current / Max);
			this.drawPie(Context, Center, Radius, Start, Start + End, Options.Colors[l], Options.Border.Color, Options.Border.Size);
		
			Start += End;
		}
		
		this.drawPie(Context, Center, Radius - Radius * Options.DonutScale, 0, 2 * Math.PI, Options.Background, Options.Border.Color, Options.Border.Size);

		if(this.Current.length > 0)
		{
			Context.fillStyle = Options.FontColor;
			Context.font = Options.FontSize + "px " + Options.Font;
			let text = ((this.Current[1] / Max) * 100).toFixed(0) + "%";
			//let text = "100%";
			let textInfo = Context.measureText(text);
		//	console.log("textInfo:", textInfo);
			Context.fillText(text, Center.x - (textInfo.width / 2), Center.y + (Options.FontSize / 3)); 
			//	console.log("Canvas:", Center.x, Center.y, Radius);
		}
	}

	public drawPie(Context, Center, Radius, Start, End, Color, StrokeColor, Size)
	{
		
		if(Size > 0)
		{
			Context.strokeStyle = StrokeColor;
			Context.lineWidth = Size;
		}
		Context.fillStyle = Color;
		Context.beginPath();
		Context.moveTo(Center.x, Center.y);
		Context.arc(Center.x, Center.y, Radius - Size, Start, End);
		Context.closePath();
		Context.fill()
		if(Size > 0)
		{
			Context.stroke();
		}
	}


	public updateTarget(Options)
	{
		if(this.Current.length != this.Target.length)
		{
			this.Current = [];
			for(let i=0;i<this.Target.length;++i)
			{
				this.Current.push(0);
			}
		}

		for(let i=0;i<this.Target.length;++i)
		{
			this.Current[i] = ChartMath.Interpolate(this.Current[i], this.Target[i], 0.01, Options.Speed);
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