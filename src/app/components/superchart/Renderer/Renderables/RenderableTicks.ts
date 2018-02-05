import { Renderable } from "./Renderable";

export class RenderableTicks extends Renderable
{

	// Default line style
	Styles:any = {
		textColor: "#FF3030",
		textSize: 12,
	};

	tickPointA: any = {};
	tickPointB: any = {};

	constructor(Styles={})
	{
		super();

		this.Styles = Object.assign(this.Styles, Styles);

	}

	setTickPoints(A, B)
	{
		this.tickPointA = A;
		this.tickPointB = B;
	}



	tick(deltaTime: number)
    {
        // Tick used to handle logic 
    }

    render(deltaTime: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement)
    {
		this.renderTickPoint(ctx, this.tickPointA, this.tickPointB);
    }

	renderTickPoint(ctx, a, b)
	{
		// Draw the axes
		ctx.beginPath();

		ctx.strokeStyle = this.Styles["color"];
		ctx.lineWidth = this.Styles["width"];
		ctx.lineJoin = ctx.lineCap = this.Styles["capping"];
		ctx.shadowBlur = this.Styles["shadow.blur"];
		ctx.shadowColor = this.Styles["shadow.color"];

		ctx.moveTo(a.x, a.y);
		ctx.lineTo(b.x, b.y);
		ctx.stroke();
	}
	
	isPointOnElement(ctx, canvas, x, y)
	{
		if(!ctx.isPointInStroke)
			return false;
		return ctx.isPointInStroke(x, y);
	}

	hover(x, y)
	{
	}

	unhover(x, y)
	{
	}

	mouseClick(x, y)
	{
	}
};