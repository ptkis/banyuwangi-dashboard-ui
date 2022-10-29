import { CommonModule } from "@angular/common"
import { Component, Input } from "@angular/core"
import { RouterTestingModule } from "@angular/router/testing"
import { Meta, moduleMetadata, Story } from "@storybook/angular"
import { NgxEchartsModule } from "ngx-echarts"
import { SharedModule } from "src/app/shared/shared.module"
import { dashboardDialogs } from "."
import { dashboardComponents } from ".."
import { dashboardRoutes } from "../dashboard.module"

import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { DialogModule, Dialog } from "@angular/cdk/dialog"
import { ComponentType } from "@angular/cdk/overlay"
import { DialogPencarianKendaraanComponent } from "./dialog-pencarian-kendaraan/dialog-pencarian-kendaraan.component"
import { DialogPencarianOrangComponent } from "./dialog-pencarian-orang/dialog-pencarian-orang.component"

@Component({
  selector: "app-dummy-cmp",
  styles: [``],
  template: `
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <button (click)="openDialogKendaraan()">
            Dialog Pencarian Kendaraan
          </button>
        </div>
        <div class="col-md-3">
          <button (click)="openDialogOrang()">Dialog Pencarian Orang</button>
        </div>
      </div>
    </div>
  `,
})
class DummyComponent {
  constructor(public dialog: Dialog) {}

  openDialogKendaraan() {
    const dialogRef = this.dialog.open<string>(
      DialogPencarianKendaraanComponent,
      {
        width: "891px",
      }
    )

    dialogRef.closed.subscribe((result) => {
      console.log("The dialog was closed")
    })
  }

  openDialogOrang() {
    const dialogRef = this.dialog.open<string>(DialogPencarianOrangComponent, {
      width: "891px",
    })

    dialogRef.closed.subscribe((result) => {
      console.log("The dialog was closed")
    })
  }
}

export default {
  title: "Dashboard/Components/Dialogs",
  component: DummyComponent,
  decorators: [
    moduleMetadata({
      declarations: [dashboardComponents, dashboardDialogs],
      imports: [
        CommonModule,
        SharedModule,
        NgxEchartsModule.forRoot({
          echarts: () => import("echarts"),
        }),
        RouterTestingModule.withRoutes(dashboardRoutes),
        MatButtonModule,
        MatIconModule,
        DialogModule,
      ],
    }),
  ],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/angular/configure/story-layout
    layout: "fullscreen",
  },
} as Meta

const Template: Story<DummyComponent> = (args: DummyComponent) => ({
  props: args,
})

export const Dialog1 = Template.bind({})
Dialog1.args = {}
