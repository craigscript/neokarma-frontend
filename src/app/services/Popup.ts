import { Component, Injectable, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

export class PopupDialog
{
	constructor(public url, public options)
	{
		let popup = window.open(url, "__blank");
		//popup.
	}
}

@Injectable()
export class Popup
{
	
	constructor(public Dialog: MdDialog)
	{
	
	}

	open(url, options): PopupDialog
	{
		let dialog = new PopupDialog(url, options);
		return dialog;
	}

}