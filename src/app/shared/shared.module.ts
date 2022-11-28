import { NgModule } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import { sharedComponents } from "./components"

import { VgCoreModule } from "@videogular/ngx-videogular/core"
import { VgControlsModule } from "@videogular/ngx-videogular/controls"
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play"
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering"
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming"

import { NgxEchartsModule } from "ngx-echarts"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatMenuModule } from "@angular/material/menu"
import { CdkListboxModule } from "@angular/cdk/listbox"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { FormsModule } from "@angular/forms"

@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,

    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,

    NgxEchartsModule,

    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    CdkListboxModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,

    FormsModule,
  ],
  exports: [sharedComponents],
  providers: [DatePipe],
})
export class SharedModule {}
