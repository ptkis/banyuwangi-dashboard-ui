import { Component, OnInit } from "@angular/core"
import { Title } from "@angular/platform-browser"
import { TranslocoService } from "@ngneat/transloco"
import { take } from "rxjs"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private translocoService: TranslocoService,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.translocoService
      .selectTranslate("title")
      .pipe(take(1))
      .subscribe((title) => this.title.setTitle(title))
  }
}
