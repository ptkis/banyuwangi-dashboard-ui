import { Component, OnInit } from "@angular/core"
import { AngularFireMessaging } from "@angular/fire/compat/messaging"
import { Title } from "@angular/platform-browser"
import { Router } from "@angular/router"
import { TranslocoService } from "@ngneat/transloco"
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { KeycloakEventType, KeycloakService } from "keycloak-angular"
import { take } from "rxjs"
import { environment } from "src/environments/environment"
import { AppService } from "./app.service"
import { ModalService } from "./shared/services/modal.service"

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
    private service: AppService,
    private modalService: ModalService,
    private router: Router
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

    this.setupNotification()
    this.listenMessages()
  }

  setupNotification() {
    const nData = localStorage.getItem("nData")
    if (!nData) {
      this.confirmNotification()
    } else if (nData === "1") {
      this.requestPermission()
    } else {
      const minute = 10
      const shouldPrompt =
        new Date(+nData).getTime() < Date.now() - minute * 60 * 1000
      if (shouldPrompt) {
        this.confirmNotification()
      }
    }
  }

  confirmNotification() {
    this.translocoService.selectTranslate("title").subscribe(() => {
      this.modalService
        .showConfirm(
          this.translocoService.translate("notification_confirm.message"),
          this.translocoService.translate("notification_confirm.title"),
          this.translocoService.translate("notification_confirm.btnConfirm"),
          this.translocoService.translate("notification_confirm.btnCancel")
        )
        .closed.subscribe((res) => {
          if (res) {
            localStorage.setItem("nData", "1")
            this.requestPermission()
          } else {
            localStorage.setItem("nData", new Date().getTime() + "")
          }
        })
    })
  }

  requestPermission() {
    this.afMessaging.requestToken.subscribe({
      next: (token) => {
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
      if (message.notification) {
        const { title, image, body } = message.notification
        const toastRef = this.modalService.showNotificationToast(
          {
            title,
            message: body || "",
            image_main: image,
            image_logo: "/assets/images/alert.svg",
            data: message.data,
          },
          {
            timeOut: environment.toast.peringatanTimeout,
          }
        )

        toastRef.onAction.subscribe((e) => {
          const data = e?.["data"]?.["alarm"]
          try {
            const snapshotData = JSON.parse(data)
            if (snapshotData) {
              this.router.navigate(
                [
                  "",
                  {
                    outlets: {
                      dialog: ["toast-chart-image"],
                    },
                  },
                ],
                {
                  queryParams: {
                    // Old implementation
                    // data,
                    // imageSrc: image,

                    snapshotid:
                      snapshotData["snapshotCount"]?.["snapshotImageId"],
                    value: snapshotData["snapshotCount"]?.["value"],
                    type: snapshotData["snapshotCount"]?.["type"],
                  },
                }
              )
            }
          } catch (error) {}
        })
      }
    })
  }
}
