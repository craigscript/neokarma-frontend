import { Pipe } from "@angular/core";

@Pipe({
       name: 'toKeys'
})
export class ToKeysPipe
{
	 transform(value: any, args?: any[]): any[]
	 {
		return Object.keys(value);
    }
}