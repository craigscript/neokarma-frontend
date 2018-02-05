import { ChartRenderer } from "./Renderer";

export class Chart extends ChartRenderer
{
	Styles: any = {};
	constructor(Canvas, StyleOverrides)
	{
		super();
		this.Styles = StyleOverrides;
		this.createContext(Canvas);
	}
};