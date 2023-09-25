import { DomPortalOutlet, TemplatePortal } from "@angular/cdk/portal"
import {
  AfterViewInit,
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from "@angular/core"
import {
  Map,
  VectorLayer,
  ImageLayer,
  Marker,
  ui,
  Polygon,
  TileLayer,
  SpatialReference,
} from "maptalks"
import * as THREE from "three"
import { ThreeLayer } from "maptalks.three"
import { SVGLoader, SVGResult } from "three/examples/jsm/loaders/SVGLoader"

import { ToastrService } from "ngx-toastr"
import { HttpErrorResponse } from "@angular/common/http"
import { finalize } from "rxjs"
import { HCPService } from "src/app/shared/services/hcp.service"
import { HCMService } from "src/app/shared/services/hcm.service"
import { CCTVData } from "src/app/shared/services/hik.service"
import { environment } from "src/environments/environment"
import { ActivatedRoute } from "@angular/router"

@Component({
  selector: "app-map-dashboard",
  templateUrl: "./map-dashboard.component.html",
  styleUrls: ["./map-dashboard.component.scss"],
})
export class MapDashboardComponent implements AfterViewInit {
  map!: Map
  layer!: VectorLayer
  markers: Marker[] = []

  @ViewChild("infoWindowContent") infoWindowContent!: TemplateRef<any>
  @ViewChild("mapContainer") mapContainer!: ElementRef<HTMLDivElement>

  threeLayer: ThreeLayer | undefined
  peta3d: THREE.Group | undefined

  useHCPHCMData = true
  containerId = "map-container"

  showButtons = false
  isMapReady = false

  constructor(
    protected _viewContainerRef: ViewContainerRef,
    protected _HCMService: HCMService,
    protected _HCPService: HCPService,
    protected toastr: ToastrService,
    protected route: ActivatedRoute
  ) {
    this.containerId = "map-container" + new Date().getTime()
  }

  ngAfterViewInit(): void {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())
    if (params["dataSourceSettings"]) {
      sessionStorage.setItem("dataSourceSettings", params["dataSourceSettings"])
      window.location.href = "/dashboard"
    } else {
      this.useHCPHCMData = environment.useHCPHCMData
      const useHCPHCMData = sessionStorage.getItem("dataSourceSettings")
      if (useHCPHCMData === "1") {
        this.useHCPHCMData = true
      } else if (useHCPHCMData === "0") {
        this.useHCPHCMData = false
      }
    }
    this.initMap()
  }

  initMap() {
    this.map = new Map(this.mapContainer.nativeElement, {
      center: environment.mapCenter,
      zoom: environment.mapZoom,
      minZoom: 1,
      maxZoom: 16,
      baseLayer: new TileLayer("base", {
        urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        subdomains: ["a", "b", "c"],
      }),
    })

    this.layer = new VectorLayer("vector").addTo(this.map)
    this.initMarkers()
    this.isMapReady = true
  }

  getMarker(coordinates: number[], svgFile: string) {
    return new Marker(coordinates, {
      symbol: [
        {
          markerFile: svgFile,
          markerWidth: 25,
          markerHeight: 35,
          markerFill: "green",
        },
      ],
    })
  }

  showLoading(message: string, title?: string) {
    return this.toastr.info(
      `
      <div>${message}</div>
      <div class="loader-long"></div>
    `,
      title || "Info",
      {
        disableTimeOut: true,
        enableHtml: true,
      }
    )
  }

  showError(message: string, title?: string) {
    return this.toastr.error(message, title || "Error", {
      timeOut: environment.toast.errorTimeout,
    })
  }

  getCCTVHCP() {
    const loadingtoast = this.showLoading("HCP - Loading CCTV List")
    this._HCPService
      .getCCTVData()
      .pipe(finalize(() => loadingtoast.toastRef.close()))
      .subscribe({
        next: (markers) => {
          for (const marker_data of markers) {
            this.initMarkerFromCCTV(
              marker_data,
              "/assets/images/marker-cctv2.svg"
            )
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log({ error })
          const status = error.statusText ? ` (${error.statusText})` : ""
          this.showError(
            `HCP - Failed to get CCTV List! ${status}`,
            "Network Error"
          )
        },
      })
  }

  getCCTVHCM() {
    const loadingtoast = this.showLoading("HCM - Loading CCTV List")
    this._HCMService
      .getCCTVData()
      .pipe(finalize(() => loadingtoast.toastRef.close()))
      .subscribe({
        next: (markers) => {
          for (const marker_data of markers) {
            this.initMarkerFromCCTV(marker_data)
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log({ error })
          const status = error.statusText ? ` (${error.statusText})` : ""
          this.showError(
            `HCM - Failed to get CCTV List! ${status}`,
            "Network Error"
          )
        },
      })
  }

  getCCTVNonHCP() {
    const loadingtoast = this.showLoading("Loading CCTV List")
    this._HCPService
      .getNonHCPData()
      .pipe(finalize(() => loadingtoast.toastRef.close()))
      .subscribe({
        next: (markers) => {
          for (const marker_data of markers) {
            this.initMarkerFromCCTV(marker_data)
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log({ error })
          const status = error.statusText ? ` (${error.statusText})` : ""
          this.showError(`Failed to get CCTV List! ${status}`, "Network Error")
        },
      })
  }

  initMarkers() {
    if (this.useHCPHCMData) {
      this.getCCTVHCP()
      this.getCCTVHCM()
    } else {
      this.getCCTVNonHCP()
    }
  }

  initMarkerFromCCTV(
    marker_data: CCTVData,
    svgFile = "/assets/images/marker-cctv.svg"
  ) {
    let svg = svgFile
    if (marker_data.cctv_status?.trim()?.toLowerCase() === "offline") {
      svg = "/assets/images/marker-cctv2-offline.svg"
    }
    const marker = this.getMarker(
      [+marker_data.cctv_longitude, +marker_data.cctv_latitude],
      svg
    ).addTo(this.layer)

    this.markers = [...this.markers, marker]

    this.setupMarkerInfoWindow(marker, marker_data)
  }

  setupMarkerInfoWindow(marker: Marker, marker_data: CCTVData) {
    new ui.ToolTip(marker_data.cctv_title, {
      showTimeout: 0,
    }).addTo(marker)

    marker.setInfoWindow({
      title: marker_data.cctv_title,
      content: "",
    })

    const iw: ui.InfoWindow = marker.getInfoWindow()
    iw.on("showend", (e) => {
      const { target } = e
      this.attachVideo(target.__uiDOM, marker_data, iw)

      this.flyToMarker(marker)
    })
  }

  attachVideo(domElement: Element, marker_data: CCTVData, iw: ui.InfoWindow) {
    const po = new DomPortalOutlet(domElement)
    const templatePortal = new TemplatePortal(
      this.infoWindowContent,
      this._viewContainerRef
    )
    templatePortal.attach(po, marker_data)
    iw.on("hide", () => {
      templatePortal.detach()
    })
  }

  flyToMarker(marker: Marker) {
    // if (this.map.getPitch() === 0) {
    const currPitch = this.map.getPitch()
    const currCenter = this.map.getCenter()
    this.map.setCenter(marker.getCenter())
    this.map.setPitch(0)
    const rectangle = new Polygon(
      [
        [
          [this.map.getExtent().getMax().x, this.map.getExtent().getMax().y],
          [this.map.getExtent().getMax().x, marker.getExtent().getMin().y],
          [this.map.getExtent().getMin().x, marker.getExtent().getMin().y],
          [this.map.getExtent().getMin().x, this.map.getExtent().getMax().y],
        ],
      ],
      {
        symbol: {
          lineColor: "#34495e",
          lineWidth: 2,
          polygonFill: "#34495e",
          polygonOpacity: 0.4,
        },
      }
    )
    // Debug polygon
    // new VectorLayer("vector2").addGeometry([rectangle]).addTo(this.map)
    this.map.setCenter(currCenter)
    this.map.setPitch(currPitch)
    this.map.animateTo(
      {
        center: rectangle.getCenter(),
      },
      {
        duration: 500,
      }
    )
    // } else {
    //   this.map.animateTo(
    //     {
    //       center: marker.getCenter(),
    //     },
    //     {
    //       duration: 500,
    //     }
    //   )
    // }
  }
}
