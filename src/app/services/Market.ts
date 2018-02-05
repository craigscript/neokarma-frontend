import { Component, Injectable, Inject, } from '@angular/core';
import { Subject } from "rxjs";
import { Request } from "./Request";

@Injectable()
export class Market
{
	public onSearch = new Subject<string>();
	public onViewModeChange = new Subject<{ mode: string, columns: number }>();

	constructor(
		public request: Request,
	)
	{
	
	}

	search(searchText: string)
	{
		this.onSearch.next(searchText);
	}

	setViewMode(mode: string, columns: number)
	{
		this.onViewModeChange.next({ mode: mode, columns: columns });
	}

}