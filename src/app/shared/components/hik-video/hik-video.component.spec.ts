import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HttpClientTestingModule } from "@angular/common/http/testing"

import { HikVideoComponent } from "./hik-video.component"

import { VgCoreModule } from "@videogular/ngx-videogular/core"
import { VgControlsModule } from "@videogular/ngx-videogular/controls"
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play"
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering"
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming"

describe("HikVideoComponent", () => {
  let component: HikVideoComponent
  let fixture: ComponentFixture<HikVideoComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HikVideoComponent],
      imports: [
        HttpClientTestingModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        VgStreamingModule,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(HikVideoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
