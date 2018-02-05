import { DataSet } from "../datatypes"
import { RenderableObject } from "../RenderableObject";
import { Polygon } from "./Polygon/Polygon";

export class LineChart implements RenderableObject
{
    ZIndex: number = 0;
    
    ScaleFunction = null;
    
    linePolygon = new Polygon();
    
    constructor(
        public dataPoints: DataSet,
        public chartOptions = {}
    )
    {

    }

    reset()
    {
        this.linePolygon.clearPoints();

    }

    // Tick used to handle logic 
    tick(deltaTime: number)
    {
     //   this.dataPoints
        var points = this.dataPoints;
    }

    // render used to handle rendering
    render(deltaTime: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement)
    {

    }
}