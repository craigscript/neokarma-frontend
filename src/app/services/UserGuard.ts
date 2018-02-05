import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { User } from "./User";

@Injectable()
export class UserGuard implements Resolve<any>
{
	constructor(private router: Router, public user: User)
	{

	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any>
	{
		console.log("[UserGuard] User Guard Resolving");
		return new Promise((resolve, reject) => {
			if(this.user.IsAuthenticated())
			{
				resolve(true);
			}else{
				resolve(true);
				console.log("[UserGuard] Not authorized limited access granted.");
			}
		});
	}
}