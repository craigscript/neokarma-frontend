import { NgModule, } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { FlexLayoutModule, } from '@angular/flex-layout';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { ToastOptions } from 'ng2-toastr';
import { NouisliderModule } from 'ng2-nouislider';

export class NotificationsOption extends ToastOptions {
  showCloseButton = true;
	newestOnTop = true;
	dismiss = 'controlled';
}

const FLEX_LAYOUT_MODULES: any[] = [
	
];

const ANGULAR_MODULES: any[] = [
	FormsModule, ReactiveFormsModule, NouisliderModule
];

// Covalent UI
import {
	TdLoadingService, CovalentExpansionPanelModule,
	CovalentDataTableModule, CovalentMediaModule, CovalentLoadingModule,
	CovalentNotificationsModule, CovalentLayoutModule, CovalentMenuModule,
	CovalentPagingModule, CovalentSearchModule, CovalentStepsModule,
	CovalentCommonModule, CovalentDialogsModule,
} from '@covalent/core';

const COVALENT_MODULES: any[] = [
	CovalentExpansionPanelModule,
	CovalentDataTableModule, CovalentMediaModule, CovalentLoadingModule,
	CovalentNotificationsModule, CovalentLayoutModule, CovalentMenuModule,
	CovalentPagingModule, CovalentSearchModule, CovalentStepsModule,
	CovalentCommonModule, CovalentDialogsModule,
];

// Material
import {
	MdChipsModule, MdGridListModule, MdAutocompleteModule, MdDialogModule,
	MdButtonModule, MdCardModule, MdIconModule,
	MdListModule, MdMenuModule, MdTooltipModule,
	MdSlideToggleModule, MdInputModule, MdCheckboxModule,
	MdToolbarModule, MdSnackBarModule, MdSidenavModule,
	MdTabsModule, MdSelectModule, MdDatepickerModule, MdNativeDateModule, MdProgressSpinnerModule, MdProgressBarModule,
	MdIconRegistry, MdSliderModule, MdExpansionModule, MdRippleModule, MdButtonToggleModule, MdFormFieldModule
} from '@angular/material';

const MATERIAL_MODULES: any[] = [
	MdChipsModule, MdGridListModule, MdAutocompleteModule, MdDialogModule,
	MdButtonModule, MdCardModule, MdIconModule,
	MdListModule, MdMenuModule, MdTooltipModule,
	MdSlideToggleModule, MdInputModule, MdCheckboxModule,
	MdToolbarModule, MdSnackBarModule, MdSidenavModule,
	MdTabsModule, MdSelectModule, MdDatepickerModule, MdNativeDateModule, MdSliderModule, MdExpansionModule, MdProgressSpinnerModule, MdProgressBarModule, MdRippleModule, MdButtonToggleModule,
	MdFormFieldModule
];

@NgModule({
	imports: [
		CommonModule,
		COVALENT_MODULES,
		ANGULAR_MODULES,
		MATERIAL_MODULES,
		FLEX_LAYOUT_MODULES,
		ToastModule.forRoot(),
	],
	declarations: [
	],
	providers: [
		TdLoadingService,
		{
			provide: ToastOptions,
			useClass: NotificationsOption
		}
	],
	exports: [
		COVALENT_MODULES,
		ANGULAR_MODULES,
		MATERIAL_MODULES,
		FLEX_LAYOUT_MODULES,
	]
})
export class UIModule {
	constructor(private mdIconRegistry: MdIconRegistry)
	{
		mdIconRegistry.registerFontClassAlias('fontawesome', 'fa');
		mdIconRegistry.registerFontClassAlias('cryptocoins', 'cc');
		mdIconRegistry.setDefaultFontSetClass("fa");
	}
}
