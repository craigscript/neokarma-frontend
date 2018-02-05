export class RenderableObject
{
    ZIndex: number = 0;
    
    tick(deltaTime: number)
    {
        // Tick used to handle logic 
    }

    render(deltaTime: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement)
    {
        // render used to handle rendering
    }
};