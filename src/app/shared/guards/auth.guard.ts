import { Injectable } from "@angular/core"
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router"
import { KeycloakAuthGuard, KeycloakService } from "keycloak-angular"

@Injectable({
  providedIn: "root",
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak)
  }

  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      })
    } else if (route.data["roles"]) {
      const requiredRoles = route.data["roles"] as Array<string>
      const roles = this.keycloak.getUserRoles()
      return roles?.some((r) => requiredRoles.includes(r))
    }

    return this.authenticated
  }
}
