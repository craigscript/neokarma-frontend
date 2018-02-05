import { MomentAndConstRule } from "./momentandconst.rule";
import { SeriesAvgGtConstRule } from "./seriesavggtconst.rule";

export const RuleComponents = [
	MomentAndConstRule,
	SeriesAvgGtConstRule,
];

export const NotificationRuleMap: any = {
	momentgtconst: {
		component: MomentAndConstRule,
		icon: "fa-plus",
		title: "Moment Greater Than Number",
		description: "True when a tracker in a given moment is greater than the specified number",
	},
	momentltconst: {
		component: MomentAndConstRule,
		icon: "fa-minus",
		title: "Moment Less Than Number",
		description: "True when a tracker in a given moment is less than the specified number",
	},
	seriesavggtconst: {
		component: SeriesAvgGtConstRule,
		icon: "fa-percent",
		title: "Tracker Increased Average",
		description: "True when a tracker's average is greater than the specified number",
	},
	
};