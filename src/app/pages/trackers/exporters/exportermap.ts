import { SumExporterDialog } from "./sum.exporter";

export var ExporterMap: any = {
	percentage: {
		icon: "fa-plus",
		name: "Sum exporter",
		DialogComponent: SumExporterDialog,
		description: "Sums the data together and exports it into the chart.",
	},
};