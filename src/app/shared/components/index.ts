import { DateFormatPipe } from "../pipes/date-format.pipe"
import { ChartPanelComponent } from "./chart-panel/chart-panel.component"
import { HikVideoComponent } from "./hik-video/hik-video.component"
import { HikVideo2Component } from "./hik-video-2/hik-video-2.component"

import { NotificationToastComponent } from "./notification-toast/notification-toast.component"

export const sharedComponents = [
  ChartPanelComponent,
  HikVideoComponent,
  HikVideo2Component,
  NotificationToastComponent,

  DateFormatPipe,
]
