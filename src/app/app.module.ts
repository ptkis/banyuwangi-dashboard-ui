import { DATE_PIPE_DEFAULT_TIMEZONE } from "@angular/common"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { HeaderComponent } from "./header/header.component"
import { SharedModule } from "./shared/shared.module"

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule],
  providers: [
    {
      provide: DATE_PIPE_DEFAULT_TIMEZONE,
      useValue: "+0800",
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
