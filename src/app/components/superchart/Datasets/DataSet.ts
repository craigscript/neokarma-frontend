// A two dimensional point set (x and y)

export class DataSet
{
	
	isDirty = true;
	constructor(public points:any[] = [])
	{
	}

	push(point: any)
	{
		this.points.push(point);
		this.markDirty();
	}
	
	pop()
	{
		this.points.pop();
		this.markDirty();
	}
	
	shift()
	{
		this.points.shift();
		this.markDirty();
	}
	

	clear()
	{
		this.points=[];
		this.markDirty();
	}

	set(points:any[])
	{
		this.points = points.slice();
		this.markDirty();
	}

	getPoints()
	{
		return this.points;
	}

	getPoint(index:number)
	{
		return this.points[index];
	}
	
	getValue( index )
	{
		return this.points[index];
	}

	markDirty()
	{
		this.isDirty = true;
	}

	get max()
	{
		return Math.max.apply(null, this.points);
	}

	get min()
	{
		return Math.min.apply(null, this.points);
	}

	get length(): number
	{
		return this.points.length;
	}
	
	getScaledStep(Step, Scales)
	{
		return Step;
	}

	getMaxScale()
	{
		return this.points.length - 1;
	}

	getMinScale()
	{
		return 0;
	}
}