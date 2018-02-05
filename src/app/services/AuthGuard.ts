import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { User } from "./User";

@Injectable()
export class AuthGuard implements Resolve<any>
{
	constructor(private router: Router, public user: User)
	{

	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any>
	{
		console.log("[AuthGuard] Auth Guard Resolving");
		return new Promise((resolve, reject) => {
			if(this.user.IsAuthenticated())
			{
				resolve(true);
			}else{
				console.log("[AuthGuard] Not authorized redirecting to /login.");
				this.router.navigateByUrl("/auth/login");
				resolve(false);
			}
		});
	}
}