import { Component, Input } from '@angular/core';
import { ObservableMedia } from "@angular/flex-layout";

@Component({
	selector: 'md-nav-dropdown',
	styleUrls: ["md-nav-dropdown.scss"],
	templateUrl: './md-nav-dropdown.html',
})
export class MdNavDropdown
{
	@Input("collapsed")
	collapsed: boolean = true;

	constructor()
	{
		
	}

	open()
	{
       this.collapsed = false;
   }

   close()
   {
	   this.collapsed = true;
   }

   toggle()
   {
	   this.collapsed = !this.collapsed;
   }
	
}

