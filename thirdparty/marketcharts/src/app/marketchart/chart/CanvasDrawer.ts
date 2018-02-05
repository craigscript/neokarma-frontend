import { RenderableObject } from "./RenderableObject";

export class CanvasDrawer
{
    public ctx: CanvasRenderingContext2D = null;
    public last: number = Date.now();
    public deltaTime: number = 0;
    public objects:RenderableObject[] = [];

    constructor(
        public canvas: HTMLCanvasElement, 
    )
    {
        this.ctx = canvas.getContext("2d");
    }

    tick()
    {
        this.deltaTime = (Date.now() - this.last) / 1000;
        for(var object of this.objects)
        {
            this.updateObject(object);
        }
        this.last = Date.now();
    }

    updateObject( object:RenderableObject )
    {
        object.tick(this.deltaTime);
        object.render(this.deltaTime, this.ctx, this.canvas);
    }

    addObject( object:RenderableObject )
    {
        this.objects.push(object);
        this.sortObjects();
    }

    removeObject( object: RenderableObject )
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
        // Remove self
		this.canvas.parentElement.removeChild(this.canvas);
        
        // Reset canvas
        this.canvas = null;
        this.ctx = null;
	}
};