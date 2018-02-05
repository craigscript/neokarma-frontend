import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import 'hammerjs';
import { MomentModule } from 'angular2-moment';

// Custom Components
import {
	MdNavDropdown,
	MdScrollable,
	MdCounter,
	MdChart,
	MdSimpleChart,
	MdTicker,
	SuperChartComponent,
	SuperChartMarketComponent
} from "./app/components/";

import {
	MarketRedditPage,
} from "./app/pages/markets";
// Custom directives
import {
	DebounceDirective,
	SortableListDirective,
	SortableItemDirective,
	ChangeDebugDirective,
} from "./app/directives";

// Application Modules
import { Pages, EntryComponents, appRoutes } from "./app/routes";
import { UIModule } from "./ui.module";
import { ApplicationComponent } from './app/application';

// Services
import {
	Request,
	AuthGuard,
	UserGuard,
	Alert,
	AlertDialog,
	LoadingDialog,
	ConfirmationDialog,
	User,
	UserStorage,
	Market,
	SocketService
} from "./app/services/";

// Pipes
import {
	TimePipe,
	WordHighlightPipe,
	NSignPipe,
	TimezonePipe,
	ToArrayPipe,
	ToKeysPipe,
 } from "./app/pipes";

// Perfect scrollbar
// import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

// const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
// 	suppressScrollX: true,
// 	wheelSpeed: 1.0
// };

// Recaptcha
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
	declarations: [
		// Application level
		ApplicationComponent,

		// Routed Pages
		Pages,
		EntryComponents,

		// Custom Components
		MdNavDropdown,
		MdScrollable,
		MdCounter,
		MdChart,
		MdSimpleChart,
		MdTicker,

		// Charting
		SuperChartComponent,
		SuperChartMarketComponent,
		// Dialogs
		AlertDialog,
		LoadingDialog,
		ConfirmationDialog,

		// Custom Pipes
		TimePipe,
		WordHighlightPipe,
		NSignPipe,
		TimezonePipe,
		ToArrayPipe,
		ToKeysPipe,

		// Custom directives
		DebounceDirective,
		SortableListDirective,
		SortableItemDirective,
		ChangeDebugDirective,
		MarketRedditPage
	],
	entryComponents: [
		EntryComponents,
		AlertDialog,
		LoadingDialog,
		ConfirmationDialog
	],
	imports: [
		CommonModule,
		// App modules
		// ApplicationRoutings,
		RouterModule.forRoot(appRoutes, { useHash: true }),

		// Core modules
		BrowserModule,
		BrowserAnimationsModule,

		// UI Module
		UIModule,
		//PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),

		// HTTP & RXJS
		HttpModule,
		JsonpModule,

		// Recaptcha
		RecaptchaModule.forRoot(),

		// Angular Moment (Moment pipes & date utilities)
		MomentModule,
	],
	providers: [
		Title,
		Request,
		AuthGuard,
		UserGuard,
		User,
		UserStorage,
		Alert,
		Market,
		SocketService
	],
	bootstrap: [ApplicationComponent]
})
export class ApplicationModule {}
