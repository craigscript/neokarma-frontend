import { ITrendActionDialog } from "./itrend.action";
import { EMAActionDialog } from "./ema.action";
import { MAVGActionDialog } from "./mavg.action";
import { LWMAVGActionDialog } from "./lwmavg.action";
import { LPFActionDialog } from "./lpf.action";
import { NoiseActionDialog } from "./noise.action";
import { OutliersActionDialog } from "./outliers.action";
import { PixelizeActionDialog } from "./pixelize.action";
import { SmoothActionDialog } from "./smooth.action";

export const ActionDialogs:any[] = [

	ITrendActionDialog,
	EMAActionDialog,
	LWMAVGActionDialog,
	MAVGActionDialog,
	LPFActionDialog,
	NoiseActionDialog,
	OutliersActionDialog,
	PixelizeActionDialog,
	SmoothActionDialog
];

export var RedditActionMap: any = {

	abs: {
		icon: "fa-arrow-up",
		name: "Absolute",
		DialogComponent: null,
		description: "Produces absolute values",	
	},
	diff: {
		icon: "fa-minus",
		name: "Difference",
		DialogComponent: null,
		description: "Produces the difference between the neighbouring data points",	
	},
	sum: {
		icon: "fa-plus",
		name: "Addition",
		DialogComponent: null,
		description: "Produces the addition between the neighbouring data points",	
	},
	positive: {
		icon: "fa-plus-square",
		name: "Positive",
		DialogComponent: null,
		description: "Produces a positive value for each data point",	
	},
	negative: {
		icon: "fa-minus-square",
		name: "Negative",
		DialogComponent: null,
		description: "Produces a negative value for each data point",	
	},
	normalize: {
		icon: "fa-compress",
		name: "Normalize",
		DialogComponent: null,
		description: "Normalizes the data points between 0 and 1",	
	},
	standardize: {
		icon: "fa-expand",
		name: "Standardize",
		DialogComponent: null,
		description: "Same as normalize",	
	},
	osc: {
		icon: "fa-random",
		name: "Oscillation",
		DialogComponent: null,
		description: "Oscillates the time series data",	
	},
	smooth: {
		icon: "fa-signal",
		name: "Smoothing",
		DialogComponent: SmoothActionDialog,
		description: "Removes noise from the time series data",	
	},
	noise: {
		icon: "fa-signal",
		name: "Extracts noise",
		DialogComponent: NoiseActionDialog,
		description: "Extracts the noise and returns the noise itself only",	
	},
	ema: {
		icon: "fa-percent",
		name: "Estimated Average",
		DialogComponent: EMAActionDialog,
		description: "Produces the Estimated Moving average",
	},
	lwmavg: {
		icon: "fa-percent",
		name: "Linear Weighted Moving Average",
		DialogComponent: LWMAVGActionDialog,
		description: "Produces the Linear Weighted Moving Average",
	},
	mavg: {
		icon: "fa-percent",
		name: "Moving Average",
		DialogComponent: MAVGActionDialog,
		description: "Produces the Moving Average",
	},
	itrend: {
		icon: "fa-line-chart",
		name: "iTrend",
		DialogComponent: ITrendActionDialog,
		description: "Created by John Ehlers to smooth noisy data without lag. alpha must be between 0 and 1",
	},
	lpf: {
		icon: "fa-signal",
		name: "Low Pass Filter",
		DialogComponent: LPFActionDialog,
		description: "Smooths the time series data with low pass filter",
	},
	pixelize: {
		icon: "fa-magic",
		name: "Pixelize",
		DialogComponent: PixelizeActionDialog,
		description: "Produces pixelized time series data",	
	},
	outliers: {
		icon: "fa-pie-chart",
		name: "Outliers",
		DialogComponent: OutliersActionDialog,
		description: "Finds the outliers by a threshold value",	
	},
};


