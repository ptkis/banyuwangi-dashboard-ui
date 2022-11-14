import { DomPortalOutlet, TemplatePortal } from "@angular/cdk/portal"
import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from "@angular/core"
import { Map, VectorLayer, ImageLayer, Marker, ui, Polygon } from "maptalks"
import { CCTVData, DashboardService } from "../dashboard.service"

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

  number = 0

  debugMode = false

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _dashboardService: DashboardService
  ) {}

  ngAfterViewInit(): void {
    this.initMap()
    this.initMarkers()
  }

  initMap() {
    this.map = new Map("map-container", {
      center: [114.36461695575213, -8.206547262582632],
      zoom: 10,
      // baseLayer: new TileLayer('base', {
      //     urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      //     subdomains: ['a', 'b', 'c'],
      // }),
      // baseLayer : new TileLayer('base',{
      //   'urlTemplate': 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
      //   'subdomains'  : ['a','b','c','d']
      // }),
      layers: [
        new ImageLayer("peta_bwi", [
          {
            url: "/assets/images/peta_banyuwangi.png",
            extent: [
              113.70414350463886, -8.844666028985074, 114.73406244210503,
              -7.820798907775355,
            ],
            opacity: 0.8,
          },
        ]),
      ],
    })

    this.map.on("contextmenu", (e) => {
      console.log(e.coordinate)
      if (this.debugMode) {
        const coord = e.coordinate
        this.map.removeLayer("peta_bwi")
        this.map.addLayer([
          new ImageLayer("peta_bwi", [
            {
              url: "/assets/images/peta_banyuwangi.png",
              extent: [
                113.70414350463886,
                -8.844666028985074,
                coord.x,
                coord.y,
              ],
              opacity: 0.8,
            },
          ]),
        ])
      }
    })

    this.layer = new VectorLayer("vector").addTo(this.map)
  }

  getMarker(coordinates: number[]) {
    return new Marker(coordinates, {
      symbol: [
        {
          markerFile: "/assets/images/marker-cctv.svg",
          markerWidth: 25,
          markerHeight: 35,
        },
      ],
    })
  }

  initMarkers() {
    this._dashboardService.getCCTVData().subscribe((markers) => {
      for (const marker_data of markers) {
        const marker = this.getMarker([
          +marker_data.cctv_longitude,
          +marker_data.cctv_latitude,
        ]).addTo(this.layer)

        this.markers = [...this.markers, marker]

        this.setupMarkerInfoWindow(marker, marker_data)
      }
    })
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
      this.attachVideo(target.__uiDOM, marker_data)

      this.flyToMarker(marker)
    })
  }

  attachVideo(domElement: Element, marker_data: CCTVData) {
    const po = new DomPortalOutlet(domElement)
    const templatePortal = new TemplatePortal(
      this.infoWindowContent,
      this._viewContainerRef
    )
    templatePortal.attach(po, marker_data)
  }

  flyToMarker(marker: Marker) {
    const currCenter = this.map.getCenter()
    this.map.setCenter(marker.getCenter())
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
    if (this.debugMode) {
      new VectorLayer("vector2").addGeometry([rectangle]).addTo(this.map)
    }
    this.map.setCenter(currCenter)
    this.map.animateTo(
      {
        center: rectangle.getCenter(),
      },
      {
        duration: 500,
      }
    )
  }
}
