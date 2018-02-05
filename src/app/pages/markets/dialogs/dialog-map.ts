import { MarketPricePointAlertDialog } from "./market-price-alert.dialog";
import { MarketPercentageChangeAlertDialog } from "./market-percent-alert.dialog";
import { MarketUpdateAlertDialog } from "./market-update-alert.dialog";
import { MarketHoldingsDialog } from "./market-holdings.dialog";
import { MarketAddDialog } from "./market-add.dialog";

export const MarketDialogMap = {
	pricepoint: MarketPricePointAlertDialog,
	percentchange: MarketPercentageChangeAlertDialog,
	marketupddate: MarketUpdateAlertDialog,

	// Custom
	holdings: MarketHoldingsDialog,
	add: MarketAddDialog,
};

export const MarketAlertDialogs = [
	MarketPricePointAlertDialog,
	MarketPercentageChangeAlertDialog,
	MarketUpdateAlertDialog,
	MarketHoldingsDialog,
	MarketAddDialog,
];
