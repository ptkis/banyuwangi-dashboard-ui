import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { sharedComponents } from "./components"

import { VgCoreModule } from "@videogular/ngx-videogular/core"
import { VgControlsModule } from "@videogular/ngx-videogular/controls"
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play"
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering"
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming"

@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,

    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
  ],
  exports: [sharedComponents],
  providers: [],
})
export class SharedModule {}
