import { Pipe } from "@angular/core";

@Pipe({
       name: 'toArray'
})
export class ToArrayPipe
{
	 transform(value: any, args?: any[]): any[]
	 {
		return Object.keys(value).map(key => {
			return value[key];
		});
    }
}