import { Component, OnInit } from "@angular/core"
import { Title } from "@angular/platform-browser"
import { TranslocoService } from "@ngneat/transloco"
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { KeycloakEventType, KeycloakService } from "keycloak-angular"
import { take } from "rxjs"

@UntilDestroy()
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private translocoService: TranslocoService,
    private title: Title,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.translocoService
      .selectTranslate("title")
      .pipe(take(1))
      .subscribe((title) => this.title.setTitle(title))

    this.keycloakService.keycloakEvents$.pipe(untilDestroyed(this)).subscribe({
      next: (e) => {
        if (e.type == KeycloakEventType.OnTokenExpired) {
          console.log("Token expired. Updating...")
          this.keycloakService.updateToken(20)
        }
      },
    })
  }
}
