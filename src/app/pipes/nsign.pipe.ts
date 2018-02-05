import { Pipe } from "@angular/core";

@Pipe({
       name: 'nsign'
})
export class NSignPipe
{
	transform(input)
	{
		input = input ? input : 0
        return input > 0 ? "+"+input : input
    }
}