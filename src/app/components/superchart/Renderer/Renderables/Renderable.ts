export class Renderable
{
    ZIndex: number = 0;
    Visible: boolean = true;
	isHovered:boolean = false;

    tick(deltaTime: number)
    {
        // Tick used to handle logic 
    }

    render(deltaTime: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement)
    {
        // render used to handle rendering
    }

	hide()
	{
		this.Visible = false;
	}

	show()
	{
		this.Visible = true;
	}

	hover(x, y)
	{
	}

	unhover(x, y)
	{
	}

	mouseMove(x, y)
	{
		
	}

	mouseClick(x, y)
	{

	}

	mouseDown(x, y)
	{

	}

	mouseUp(x, y)
	{

	}

	isPointOnElement(ctx, canvas, x, y): boolean
	{
		return false;
	}
	
};