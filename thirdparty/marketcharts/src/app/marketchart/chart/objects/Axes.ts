import { RenderableObject } from "../RenderableObject";

export class Axes implements RenderableObject
{
    ZIndex: number = -1;
    
    // Tick used to handle logic 
    tick(deltaTime: number)
    {

    }

    // render used to handle rendering
    render(deltaTime: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement)
    {

    }
}