import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent
{
	datasets = [{
		name: "test",
		type: "line",
		data: [
			1,
			5,
			6,
			7,
			8,
			10,
			15,
		],
		labels: ["A", "B", "C", "D", "E", "F"],
	}];

	constructor()
	{

	}

	
}
