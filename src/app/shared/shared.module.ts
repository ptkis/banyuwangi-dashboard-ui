import { NgModule } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import { sharedComponents } from "./components"

import { VgCoreModule } from "@videogular/ngx-videogular/core"
import { VgControlsModule } from "@videogular/ngx-videogular/controls"
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play"
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering"
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming"

import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { RouterModule } from "@angular/router"
import { ModalComponent } from "./components/modal/modal.component"
import { DialogModule } from "@angular/cdk/dialog"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"

export const materialModules = [
  MatIconModule,
  MatButtonModule,
  DialogModule,
  MatProgressSpinnerModule,
]

@NgModule({
  declarations: [sharedComponents, ModalComponent],
  imports: [
    CommonModule,

    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,

    ...materialModules,
  ],
  exports: [sharedComponents],
  providers: [DatePipe],
})
export class SharedModule {}
