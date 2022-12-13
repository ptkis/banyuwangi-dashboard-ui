import { Component } from "@angular/core"
import { map, Observable, timer } from "rxjs"

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  time$: Observable<Date> = timer(0, 1000).pipe(map(() => new Date()))

  constructor() {}
}
