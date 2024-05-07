import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';
import 'leaflet.locatecontrol' // Import plugin
import * as L from 'leaflet';
import { PopupComponent } from './popup/popup.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, AfterViewInit {
  map: any;
  drawerMode: any;
  latitude: any = 11.9861833;
  longitude: any = 108.4376802;

  

  thanhSoList = <any>[
    {
      name: 'Thánh Thất Đà Lạt',
      latLng: [11.9677739, 108.4280524],
      address: '147 Xô Viết Nghệ Tĩnh, Phường 7, Thành phố Đà Lạt, Lâm Đồng, Vietnam',
      caodaion: true
    },
    {
      name: 'Thánh thất Xuân Sơn',
      latLng: [11.8824912, 108.4719696],
      address: 'thôn Xuân Sơn, Thành phố Đà Lạt, Lâm Đồng, Vietnam'
    }
  ]
  viewContainerRef = inject(ViewContainerRef)
  selectedMap = <any>{}

  @ViewChild('infoDrawer') infoDrawer!: any

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {

  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.drawerMode = 'over';
        } else {
          this.drawerMode = 'side';
        }
      });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    const initMap = () => {
      this.map = L.map('map', {
        center: [this.latitude, this.longitude],
        zoom: 15
      });
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
      });
      tiles.addTo(this.map);
      L.control.locate({ position: 'topright' }).addTo(this.map);
      this.map.zoomControl.setPosition('topright')
      this.loadMarkers()
    }
    const getPosition = {
      enableHighAccuracy: true,
      timeout: 9000,
      maximumAge: 0
    }
    const success = (gotPosition: any) => {
      this.latitude = gotPosition.coords.latitude;
      this.longitude = gotPosition.coords.longitude;
    }
    if (this.latitude && this.longitude) {
      initMap()
    }
    const error = (err: any) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };
    navigator.geolocation.getCurrentPosition(success, error, getPosition)
  }

  loadMarkers() {
    const caodaiONMarker = L.marker([this.latitude, this.longitude], { icon: this.getThanhSoIcon('caodaion') })
    caodaiONMarker.bindPopup(`<a href="${location.origin}">${location.origin}</a>`)
    caodaiONMarker.addTo(this.map);
    this.thanhSoList.forEach((item: any) => {
      this.loadThanhSoMarker(item);
    })
  }

  getThanhSoIcon(item: any): any {
    if (item === 'caodaion') {
      const caoDaiONIcon = L.icon({
        iconUrl: '/assets/icons/assets/caodaion-pin.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      })
      return caoDaiONIcon
    }
    if (item?.caodaion) {
      const thanhSoCaoDaiONIcon = L.icon({
        iconUrl: '/assets/icons/assets/thanhSoCaoDaiON.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      })
      return thanhSoCaoDaiONIcon
    }
    const thanhSoIcon = L.icon({
      iconUrl: '/assets/icons/assets/thanhSo.png',
      iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    })
    return thanhSoIcon
  }

  loadThanhSoMarker(item: any) {
    const thanhSoMarker = L.marker(item.latLng, { icon: this.getThanhSoIcon(item) })
    thanhSoMarker.addTo(this.map)
    const popup = this.viewContainerRef.createComponent(PopupComponent)
    popup.instance.thanhSo = item
    popup.changeDetectorRef.detectChanges()
    thanhSoMarker.bindPopup(popup.location.nativeElement);
    this.viewContainerRef.clear()
    thanhSoMarker.on('mouseover', () => {
      thanhSoMarker.openPopup()
    })
    thanhSoMarker.on('click', () => {
      if (item.latLng == this.selectedMap.latLng) {
        this.infoDrawer.toggle();
      } else {
        this.infoDrawer.open();
        this.selectItem(item)
      }
    })
  }

  selectItem(item?: any) {
    if (item) {
      if (item.latLng == this.selectedMap.latLng) {
        this.infoDrawer.toggle();
      } else {
        this.selectedMap = item
        this.infoDrawer.open();
      }
    } else {
      this.selectedMap = <any>{}
    }
  }
}
