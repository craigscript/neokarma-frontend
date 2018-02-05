import { Pipe } from "@angular/core";

@Pipe({
       name: 'timezone'
})
export class TimezonePipe
{
	transform(input)
	{
		input = input ? input : 0
		let zone = this.pad(input) + ":00";
        return "UTC" + (input >= 0 ? ("+" + zone) : ("-" + zone));
    }

	pad(d)
	{
		d = Math.abs(d);
		return (d < 10) ? '0' + d.toString() : d.toString();
	}
}