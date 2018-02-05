import { Component, OnInit, Inject } from "@angular/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { TdMediaService } from "@covalent/core";
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { CountryCallingCodes } from "../../../config";

@Component({
	templateUrl: "./sms-target.dialog.html"
})
export class MentionSmsTargetDialog implements OnInit
{
	phoneNumber: number;
	codeCtrl: FormControl;
	countryCodes: any[] = CountryCallingCodes;
	filteredCountryCodes: Observable<any[]>;

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<MentionSmsTargetDialog>,
		public media: TdMediaService,
	)
	{
		this.codeCtrl = new FormControl();
		this.filteredCountryCodes = this.codeCtrl.valueChanges
			.startWith(null)
			.map(countryCode => countryCode ? this.filterCodes(countryCode) : this.countryCodes.slice());
	}

	ngOnInit()
	{

	}

	save()
	{
		let code = this.codeCtrl.value.replace( /^\D+/g, '');
		let number = code + this.phoneNumber;
		let target = {
			type: 'sms',
			options: {
				number: number
			}
		}
		this.dialogRef.close(target);
	}

	filterCodes(name: string)
	{
		return this.countryCodes.filter(countryCode =>
			countryCode.name.toLowerCase().indexOf(name.toLowerCase()) >= 0);
	}
}
