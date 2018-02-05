import { Renderable } from "./Renderable";
import { ChartMath } from "../../Utils/ChartMath";

export class RenderableLine extends Renderable
{
	// Default line style
	Styles:any = {
		color: "#FF3030",
		width: 5,
		capping: "round",
		bezier: 0,
		interp: 1,
	};

	constructor(public linepoints:any[]=[], Styles={})
	{
		super();

		this.Styles = Object.assign(this.Styles, Styles);

	}

	addPoint(x, y)
	{
		this.linepoints.push({x: x, y: y});
	}

	drawRect = {};

	setDrawingRect(rect)
	{
		this.drawRect = rect;
	}

	clearPoints()
	{
		this.linepoints=[];
	}

	tick(deltaTime: number)
    {
    }

    render(deltaTime: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement)
    {
		if(this.linepoints.length < 2)
			return;
		
		// Set starting position
		var points = this.linepoints.slice();
		
		// Begin draw
		ctx.beginPath();
		
		// move to first point
		ctx.moveTo(points[0].x, points[0].y);
		
		
		if(this.isHovered)
		{
			ctx.strokeStyle = this.Styles["color.hover"] || this.Styles["color"];
			ctx.lineWidth = this.Styles["width.hover"] || this.Styles["width"];
			ctx.lineJoin = ctx.lineCap = this.Styles["capping.hover"] || this.Styles["capping"];
			ctx.shadowBlur = this.Styles["shadow.blur.hover"] || this.Styles["shadow.blur"];
			ctx.shadowColor = this.Styles["shadow.color.hover"] || this.Styles["shadow.color"];
		}else{
			ctx.strokeStyle = this.Styles["color"];
			ctx.lineWidth = this.Styles["width"];
			ctx.lineJoin = ctx.lineCap = this.Styles["capping"];
			ctx.shadowBlur = this.Styles["shadow.blur"];
			ctx.shadowColor = this.Styles["shadow.color"];
		}

	
		var lastPoint = points.shift();
		for(let currentPoint of points)
		{
			var point = currentPoint;
			if(this.Styles["bezier"] != 0)
			{
				point = this.bezier(lastPoint, currentPoint, Math.min(Math.max(this.Styles["bezier"], 0), 1));
			}
			
			ctx.lineTo(point.x, point.y);
			lastPoint = currentPoint;
		}
		
		// Finish drawing
		ctx.stroke();
    }

	bezier(p1, p2, alpha)
	{
		return {
			x: p1.x + (p2.x - p1.x) / (alpha * 2),
			y: p1.y + (p2.y - p1.y) / (alpha * 2)
		};
	}

	isPointOnElement(ctx, canvas, x, y)
	{
		if(!ctx.isPointInStroke)
			return false;
		return false;
		//return ctx.isPointInStroke(x, y);
	}

	hover(x, y)
	{
		this.Styles["color.hower"] = "#000000";
	}

	unhover(x, y)
	{
	}

	mouseClick(x, y)
	{
		//console.log("Clicked?");
	}
};