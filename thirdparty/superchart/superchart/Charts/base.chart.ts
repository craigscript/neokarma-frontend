import { Color } from "../Utils/Color";


export class BaseChart
{
	update(deltaTime: number, renderer)
	{

	}

	render(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement)
	{
		console.log("Rendering barline chgart");
		let width = canvas.clientWidth;
		let height = canvas.clientHeight;
		//ctx.beginPath();
		ctx.fillStyle = Color.rgba(255, 0, 0, 1);
	//	ctx.rect(100, 100, width-100, height-100);
		ctx.fillRect(100, 100, 100, 100);
	//	ctx.closePath();
		
	}

	
};