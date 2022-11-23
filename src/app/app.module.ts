import { DATE_PIPE_DEFAULT_TIMEZONE } from "@angular/common"
import { APP_INITIALIZER, NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"

import { NgxEchartsModule } from "ngx-echarts"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular"
import { environment } from "src/environments/environment"
import { HttpClientModule } from "@angular/common/http"

import { ToastrModule } from "ngx-toastr"

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloakUrl,
        realm: environment.keycloakRealm,
        clientId: environment.keycloakClientId,
      },
      initOptions: {
        pkceMethod: "S256",
        // must match to the configured value in keycloak
        redirectUri: window.location.origin,
        // this will solved the error
        checkLoginIframe: false,
        enableLogging: !environment.production,
      },
      enableBearerInterceptor: true,
      shouldAddToken(request) {
        return request.url.includes(environment.serverBaseUrl)
      },
    })
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxEchartsModule.forRoot({
      // echarts
      echarts: () => import("echarts"),
    }),
    BrowserAnimationsModule,
    KeycloakAngularModule,
    HttpClientModule,

    ToastrModule.forRoot({
      timeOut: 10000,
      preventDuplicates: true,
    }),
  ],
  providers: [
    {
      provide: DATE_PIPE_DEFAULT_TIMEZONE,
      useValue: "+0700",
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
