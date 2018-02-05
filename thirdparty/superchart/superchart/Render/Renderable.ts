export interface RenderableInterface
{
	update(deltaTime: number, renderer: any);
	render(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement);
	isAABB(location: any): boolean;
}