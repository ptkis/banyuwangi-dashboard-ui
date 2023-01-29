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

    this.route.paramMap.subscribe((p) => {
      const mapType = p.get("type")
      this.initMap(!!mapType)
    })
    // this.initMap(true)
  }

  initMap(satellite = false) {
    if (!satellite) {
      this.initMapSVG()
    } else {
      this.initMapSatellite()
      setTimeout(() => {
        this.showButtons = true
      })
    }
  }

  initMapSatellite() {
    const arcUrl =
      "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"
    SpatialReference.loadArcgis(arcUrl + "?f=pjson", (err, conf) => {
      if (err) {
        throw new Error(err)
      }
      const ref = conf.spatialReference
      ref.projection = "EPSG:3857"
      ref.fullExtent = null
      this.map = new Map(this.containerId, {
        center: [114.36461695575213, -8.206547262582632],
        zoom: 9,
        minZoom: 1,
        maxZoom: 16,
        spatialReference: ref,
        baseLayer: new TileLayer("base", {
          tileSystem: conf.tileSystem,
          tileSize: conf.tileSize,
          urlTemplate: arcUrl + "/tile/{z}/{y}/{x}",
          attribution:
            '&copy; <a target="_blank" href="' + arcUrl + '"">ArcGIS</a>',
        }),
      })

      this.layer = new VectorLayer("vector").addTo(this.map)
      this.initMarkers()
    })
  }

  initMapSVG() {
    this.map = new Map(this.containerId, {
      center: [114.36461695575213, -8.206547262582632],
      // center: [0, 0],
      zoom: 9,
      // maxZoom: 12,
      pitch: 30,
      // baseLayer: new TileLayer('base', {
      //     urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      //     subdomains: ['a', 'b', 'c'],
      // }),
      layers: [
        // new ImageLayer("peta_bwi", [
        //   {
        //     url: "/assets/images/map3d.svg",
        //     extent: [
        //       113.70414350463886, -8.844666028985074, 114.73406244210503,
        //       -7.820798907775355,
        //     ],
        //     // opacity: 0.8,
        //   },
        // ]),
        // new ImageLayer("peta_bwi", [
        //   {
        //     url: "/assets/images/peta_banyuwangi.png",
        //     extent: [
        //       113.70414350463886, -8.844666028985074, 114.73406244210503,
        //       -7.820798907775355,
        //     ],
        //     opacity: 0,
        //   },
        // ]),
      ],
    })

    this.threeLayer = new ThreeLayer("t", {
      // forceRenderOnMoving: true,
      // forceRenderOnRotating: true,
    })

    this.threeLayer.prepareToDraw = (gl, scene, camera) => {
      const light = new THREE.DirectionalLight(0xffffff)
      light.position.set(0, -10, 10).normalize()
      if (scene && camera) {
        scene.add(light)
        camera.add(new THREE.PointLight("#fff", 4))
      }
      // console.log(gl, scene, camera)
      const svgLoader = new SVGLoader()
      svgLoader.load("/assets/images/map2d.svg", (svgData) => {
        const { object } = this.renderSVG(150, svgData)
        this.peta3d = object
        this.peta3d.scale.set(1.4, 1.4, 1)
        const coord = this.threeLayer?.coordinateToVector3([
          114.14398964651878, -8.316152931118921,
        ])
        this.peta3d.position.copy(<any>coord)
        if (this.threeLayer) {
          this.threeLayer.addMesh(this.peta3d as any)
          // this.animate()
        }
      })
    }

    this.threeLayer.addTo(this.map)

    // Collect latlon
    // const latlon: any[] = []
    // this.map.on("contextmenu", (e) => {
    //   latlon.push([e.coordinate.x, e.coordinate.y])
    //   console.log(latlon)
    // })

    // this.map.setBearing(15)

    // Code to calibrate image layer
    // this.map.on("contextmenu", (e) => {
    //   console.log([e.coordinate.x, e.coordinate.y])
    //   console.log(this.map.getPitch())
    //   console.log(this.map.getBearing())

    //   if (this.threeLayer && this.peta3d) {
    //     const coord = this.threeLayer.coordinateToVector3(e.coordinate)
    //     this.peta3d.position.copy(<any>coord)
    //     // this.peta3d.scale.setY(this.peta3d.scale.y - 0.1)
    //     // console.log(this.peta3d.scale.y)
    //   }
    //   if (false) {
    //     const coord = e.coordinate
    //     this.map.removeLayer("peta_bwi")
    //     this.map.addLayer([
    //       new ImageLayer("peta_bwi", [
    //         {
    //           url: "/assets/images/map2d.png",
    //           extent: [
    //             coord.x,
    //             coord.y,
    //             114.68596705340838,
    //             -7.872038223325234,
    //           ],
    //           opacity: 0.8,
    //         },
    //       ]),
    //     ])
    //   }
    // })

    this.layer = new VectorLayer("vector").addTo(this.map)
    this.initMarkers()
  }

  renderSVG = (extrusion: number, svgData: SVGResult) => {
    const svgGroup = new THREE.Group()
    const updateMap: any[] = []

    // const fillMaterial = new THREE.MeshBasicMaterial({ color: "#234976" })
    // fillMaterial.transparent = true
    // fillMaterial.opacity = 0.5
    const stokeMaterial = new THREE.LineBasicMaterial({
      color: "#00A5E6",
    })

    svgGroup.scale.y *= -1
    svgData.paths.forEach((path) => {
      const shapes = path.toShapes(true)

      shapes.forEach((shape) => {
        const meshGeometry = new THREE.ExtrudeBufferGeometry(shape, {
          depth: extrusion,
          bevelEnabled: false,
        })
        const linesGeometry = new THREE.EdgesGeometry(meshGeometry, 90)
        // const mesh = new THREE.Mesh(meshGeometry, fillMaterial)
        const mesh = new THREE.Mesh(meshGeometry, [
          new THREE.MeshBasicMaterial({ color: "#234976" }),
          new THREE.MeshBasicMaterial({ color: "black" }),
        ])
        const lines = new THREE.LineSegments(linesGeometry, stokeMaterial)

        updateMap.push({ shape, mesh, lines })
        svgGroup.add(mesh, lines)
      })
    })

    const box = new THREE.Box3().setFromObject(svgGroup)
    const size = box.getSize(new THREE.Vector3())
    const yOffset = size.y / -2
    const xOffset = size.x / -2

    // Offset all of group's elements, to center them
    svgGroup.children.forEach((item) => {
      item.position.x = xOffset
      item.position.y = yOffset
    })
    svgGroup.rotateX(-Math.PI)

    return {
      object: svgGroup,
      // update(extrusion: number) {
      //   updateMap.forEach((updateDetails) => {
      //     const meshGeometry = new THREE.ExtrudeBufferGeometry(
      //       updateDetails.shape,
      //       {
      //         depth: extrusion,
      //         bevelEnabled: false,
      //       }
      //     )
      //     const linesGeometry = new THREE.EdgesGeometry(meshGeometry)

      //     updateDetails.mesh.geometry.dispose()
      //     updateDetails.lines.geometry.dispose()
      //     updateDetails.mesh.geometry = meshGeometry
      //     updateDetails.lines.geometry = linesGeometry
      //   })
      // },
    }
  }

  // animate() {
  //   requestAnimationFrame(this.animate.bind(this))
  //   if (this.threeLayer?._needsUpdate) {
  //     this.threeLayer.redraw()
  //   }
  // }

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
