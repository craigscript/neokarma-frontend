import { DonutChart } from "./DonutChart";
import { LineChart } from "./LineChart";
import { BarLineChart } from "./BarLineChart";

const ChartTypes = {
	donut: DonutChart,
	line: LineChart,
	barline: BarLineChart
};
export class SimpleChart
{
	Canvas = null;
	Context = null;
	Drawer = null;
	Data = null;
	Options = this.Options;
	frameRunning = null;

	constructor(target, type, data, Options={})
	{
		this.Canvas = target;
		this.Canvas.width = this.Canvas.clientWidth;
		this.Canvas.height = this.Canvas.clientHeight;
		this.Context = target.getContext("2d");
		this.Data = data;
		this.Options = Options;

		this.Drawer = new ChartTypes[type](this.Options);
		this.update(this.Data);

	}

	update(Data)
	{
		this.Data = Data;
		this.Drawer.update(this.Canvas, this.Context, this.Data, this.Options);
		if(this.Drawer.requiresUpdate())
		{
			window.cancelAnimationFrame(this.frameRunning);
			this.frameRunning = window.requestAnimationFrame(() => {
				this.update(Data);
			});
		}
	}

	private AnimateChart()
	{

	}
};