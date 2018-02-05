export class Point {
    x: number;
    y: number;
};

export class Polygon
{
    points: Point[] = [];
    constructor()
    {

    }

    addPoints(points:Point[])
    {
        this.points.push.apply(this.points, points);
    }

    addPoint(point: Point)
    {
        this.points.push(point);
    }

    removePoints()
    {
    }

    clearPoints()
    {
        this.points = [];
    }
};