import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from "@covalent/core";
import { Request, Alert} from "../../services/";

@Component({
	selector: 'neo-mentions-feed-list',
	templateUrl: './feed-list.html',
	styleUrls: ['./feed-list.scss'],
})
export class MentionsFeedList implements OnInit
{
	Mentions: any [] = [];
	loadingFeed: boolean = true;
	NoMore = false;
	currentFilters: any = {};

	constructor(
		public request: Request,
		public alert: Alert,
	)
	{

	}

	ngOnInit()
	{
		this.getFeed(0, {});
	}

	clearFeed()
	{
		this.Mentions = [];
		this.NoMore = false;
	}

	getFeed(lastTime, filters)
	{
		this.loadingFeed = true;
		this.currentFilters = filters;
		this.request.post("/mentions/feed/" + lastTime, {
			filters: filters
		}).then( response => {
			this.loadingFeed = false;
			if (!response.success)
			{
				return this.alert.error(response.message);
			}
			if (response.mentions.length == 0)
			{
				this.NoMore = true;
			}
			Array.prototype.push.apply(this.Mentions, response.mentions);
		});
	}

	loadMore()
	{
		if(!this.loadingFeed && !this.NoMore)
		{
			if(this.Mentions.length > 0)
			{
				let lastTime = this.Mentions[this.Mentions.length - 1].date;
				this.getFeed(lastTime, this.currentFilters);
			}
		}
	}
}
