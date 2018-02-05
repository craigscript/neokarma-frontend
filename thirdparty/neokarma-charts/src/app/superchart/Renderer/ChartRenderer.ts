import { EventEmitter } from '@angular/core';
import { Renderable } from "./Renderables";

export class ChartRenderer
{
	Canvas: HTMLCanvasElement = null;
	Context: CanvasRenderingContext2D = null;
    public last: number = Date.now();
    public deltaTime: number = 0;
    public objects:Renderable[] = [];
	public mousePosition = { x: 0, y: 0};

	chartDirty = true;
	dirtyTimer = null;
	destroyed = false;
	constructor()
	{
		// Re render every ms.
		this.dirtyTimer = setInterval(() => {
			if(this.destroyed)
				return;
			this.chartDirty = true;
		}, 1000);
	}

	createContext(Canvas: HTMLCanvasElement)
	{
		this.Canvas = Canvas;
		
		this.Context = Canvas.getContext("2d");

		Canvas.addEventListener('mousemove', (event) => {
			var rect = Canvas.getBoundingClientRect();
			this.mouseMoveInterval(event.clientX - rect.left, event.clientY - rect.top);
		}, false);

		Canvas.addEventListener("click", (event) => {
			var rect = Canvas.getBoundingClientRect();
			this.mouseMoveInterval(event.clientX - rect.left, event.clientY - rect.top);
			this.mouseClickInternal(event.clientX - rect.left, event.clientY - rect.top);
		}, false);

		Canvas.addEventListener("mousedown", (event) => {
			var rect = Canvas.getBoundingClientRect();
			this.mouseDownInternal(event.clientX - rect.left, event.clientY - rect.top);
			this.mouseMoveInterval(event.clientX - rect.left, event.clientY - rect.top);
		}, false);

		Canvas.addEventListener("mouseup", (event) => {
			var rect = Canvas.getBoundingClientRect();
			this.mouseUpInternal(event.clientX - rect.left, event.clientY - rect.top);
			this.mouseMoveInterval(event.clientX - rect.left, event.clientY - rect.top);
		}, false);

		// Start ticking the canvas drawer
		window.requestAnimationFrame(() => {
			this.tickInternal();
		});
		
	}

	private tickInternal()
	{
		if(this.destroyed)
			return;

		this.deltaTime = (Date.now() - this.last) / 1000;
		
		this.tick(this.deltaTime);
		this.render(this.deltaTime);

		// Queue next tick
		window.requestAnimationFrame(() => {
			this.tickInternal();
		});
		
		this.last = Date.now();
	}

	resizeCanvas(width: number, height: number)
	{
	//	console.log("Canvas is resized:", width, height);
		this.Canvas.width = width;
		this.Canvas.height = height;
		this.resized(width, height);
	}


	// Send overlap event to components
	private mouseMoveInterval(x, y) {
		this.mousePosition = {
			x: x, 
			y: y
		};
		this.chartDirty = true;
		this.mouseMove(x, y);
	}

	private mouseClickInternal(x, y)
	{
		console.log("Object is clicked at?", x, y);
		for(var object of this.objects)
        {
            if(object.isHovered)
			{
				object.mouseClick(x, y);
			}
        }
		this.mouseClick(x, y);
	}

	private mouseDownInternal(x, y)
	{
		for(var object of this.objects)
        {
            if(object.isHovered)
			{
				object.mouseDown(x, y);
			}
        }
		this.mouseDown(x, y);
	}

	private mouseUpInternal(x, y)
	{
		for(var object of this.objects)
        {
            if(object.isHovered)
			{
				object.mouseUp(x, y);
			}
        }
		this.mouseUp(x, y);
	}

	// Event listeners
	mouseMove(x, y) {}
	mouseClick(x, y){}
	mouseDown(x, y){}
	mouseUp(x, y){}
	resized(width:number, height:number) {}
	objectHovered(object, x, y){}
	objectUnhovered(object, x, y){}

	tick(deltaTime: number)
    {
		// Check for resize events
		if(this.Canvas.width != this.Canvas.clientWidth
		|| this.Canvas.height != this.Canvas.clientHeight)
		{
			this.resizeCanvas(this.Canvas.clientWidth, this.Canvas.clientHeight);
		}
		
		// Tick components
        for(var object of this.objects)
        {
            this.updateObject(object);
        }

    }

	render(deltaTime: number)
	{
		// Clear canvas
		// this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
		// console.log("Internal Render?");

		// Render components
		for(var object of this.objects)
        {
            this.renderObject(object);
        }
	}

    updateObject( object:Renderable )
    {
        object.tick(this.deltaTime);
    }

  	renderObject( object:Renderable )
    {
		this.Context.save();
        object.render(this.deltaTime, this.Context, this.Canvas);
		if(object.isPointOnElement(this.Context, this.Canvas, this.mousePosition.x, this.mousePosition.y))
		{
			object.isHovered = true;
			object.hover(this.mousePosition.x, this.mousePosition.y);
			this.objectHovered(object, this.mousePosition.x, this.mousePosition.y);
		}else{
			if(object.isHovered)
			{
				object.unhover(this.mousePosition.x, this.mousePosition.y);
				this.objectUnhovered(object, this.mousePosition.x, this.mousePosition.y);
			}
			object.isHovered = false;
		}
		this.Context.restore();
    }

    addObject( object:Renderable )
    {
        this.objects.push(object);
        this.sortObjects();
    }

    removeObject( object: Renderable )
    {
        this.objects.splice(this.objects.indexOf(object));
    }

    sortObjects()
    {
        this.objects = this.objects.sort( (a, b) => {
            if(a.ZIndex > b.ZIndex)
                return -1;
            return 1;
        });
    }

	destroy()
	{
		this.destroyed = true;
		
        // Remove self
		this.Canvas.parentElement.removeChild(this.Canvas);
        
        // Reset canvas
        this.Canvas = null;
        this.Context = null;

		
	}
};
