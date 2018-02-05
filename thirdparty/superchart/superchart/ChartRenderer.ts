import { RenderableInterface } from "./Render/Renderable";
import { Color } from "./Utils/Color";

export * from "./Charts/barline.chart";

export class ChartRenderer
{
	canvas: HTMLCanvasElement = null;
	context: CanvasRenderingContext2D;
	
	isDirty = true;

	renderables = [];
	lastTime = Date.now();
	deltaTime = 0;

	constructor(canvas: HTMLCanvasElement, options = {})
	{
		this.canvas = canvas;
		this.canvas.width =  this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;
		console.log("canvas width:", this.canvas.width, this.canvas.clientWidth);
		this.context = canvas.getContext("2d");
		this.renderTick();
	}

	clear()
	{
		console.log("clear canvas");
		let ctx = this.context;
		ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
		ctx.fillStyle = Color.rgba(35, 35, 35, 5);
		ctx.fillRect(0,0, this.canvas.clientWidth, this.canvas.clientHeight);
		
	}

	render(delta)
	{
		console.log("delta:", delta);
		this.clear();
		for(let renderable of this.renderables)
		{
			renderable.update(delta, this);
			renderable.render(this.context, this.canvas);
		}
	}

	renderTick()
	{
		if(!this.canvas || !this.context)
			return;

		let now = Date.now();
		this.deltaTime = (now - this.lastTime) / 1000;

		if(this.isDirty)
		{
			this.isDirty = false;
			this.render(this.deltaTime);
		}
		
		window.requestAnimationFrame(() => {
			this.renderTick();
		});

		this.lastTime = now;
	}

	addChart(chart)
	{

	}
	
	addRenderable(renderable)
	{
		this.renderables.push(renderable);
		this.markDirtry();
	}

	removeRenderable(renderable)
	{
		this.renderables.splice(this.renderables.indexOf(renderable), 1);
		this.markDirtry();
	}

	findAtLocation(location)
	{
		return this.renderables.find((renderable) => {
			if(renderable.isAABB(location))
			{
				return true;
			}
			return false;
		});
	}

	markDirtry()
	{
		this.isDirty = true;
	}

	destroy()
	{
		this.context = null;
		this.canvas = null;

	}
}