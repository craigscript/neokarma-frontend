import { Component } from '@angular/core';
import * as moment from "moment";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent
{
	chartData = [];
	labels = [];
	constructor()
	{
		
		for(var i=0;i<1000;++i)
		{
			var time = new Date(Date.now() - (60*60*1000*i));
			this.labels.push(moment(time).format("HH:mm:ss"));
			this.chartData.push({
				t: time,
				value: Math.random() * 100000
			});
			
			// if(this.chartData.length > 300)
			// {
			// 	this.chartData.shift();
			// 	this.labels.shift();
			// }
			
		};
		this.chartData = this.chartData.slice();
		this.labels = this.labels.slice();
	}
}
