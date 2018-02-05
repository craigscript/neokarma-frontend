// A two dimensional point set (x and y)
import { DataSet } from "./DataSet";

export class TimeSet extends DataSet
{
	EndTime = 0;
	StartTime = 0;
	constructor(public points:{t:Date, value: number}[] = [])
	{
		super();
		this.calculateMaxTime();
	}

	calculateMaxTime()
	{
		var times = this.points.map( p => p.t.getTime())
		this.StartTime = Math.min.apply(null, times);
		this.EndTime = Math.max.apply(null, times);
	}

	push(point: {t:Date, value: number})
	{
		this.points.push(point);
		this.calculateMaxTime();
		this.markDirty();
	}
	
	set(points:{t:Date, value: number}[])
	{
		this.points = points.slice();
		this.calculateMaxTime();
		this.markDirty();
	}

	clear()
	{
		super.clear();
		this.calculateMaxTime();
	}

	getValue( index )
	{
		return this.points[index].value;
	}

	get max()
	{
		return Math.max.apply(null, this.points.map( p => p.value));
	}

	get min()
	{
		return Math.min.apply(null, this.points.map( p => p.value));
	}

	getScaledStep(Step, Scales)
	{
		return this.points[Step].t.getTime();
		
		//return timeDif * Step;
	}

	getMaxScale()
	{
		return this.EndTime;
		//this.StartTime = Math.min.apply(null, times);
		//this.EndTime = Math.max.apply(null, times);
		//return  Math.max.apply(null, this.points.map( p => p.t.getTime()));
	}
	
	getMinScale()
	{
		return this.StartTime;
		
		//return  Math.max.apply(null, this.points.map( p => p.t.getTime()));
	}

}