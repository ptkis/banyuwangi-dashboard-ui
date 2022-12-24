import { Component, OnInit } from "@angular/core"
import { AngularFireMessaging } from "@angular/fire/compat/messaging"
import { Title } from "@angular/platform-browser"
import { TranslocoService } from "@ngneat/transloco"
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { KeycloakEventType, KeycloakService } from "keycloak-angular"
import { mergeMap, take } from "rxjs"
import { AppService } from "./app.service"

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
    private keycloakService: KeycloakService,
    private afMessaging: AngularFireMessaging,
    private service: AppService
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

    this.requestPermission()
    this.listenMessages()
  }

  requestPermission() {
    this.afMessaging.requestToken.subscribe({
      next: (token) => {
        console.log("Permission granted! Save to the server!", token)
        if (token) {
          this.service.storeDeviceToken(token).subscribe()
        }
      },
      error: (error) => {
        console.error(error)
      },
    })
  }

  listenMessages() {
    this.afMessaging.messages.subscribe((message) => {
      console.log(message)
    })
  }
}
