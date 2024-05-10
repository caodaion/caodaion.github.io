import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';
import 'leaflet.locatecontrol';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { PopupComponent } from './popup/popup.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MapsService } from 'src/app/shared/services/maps/maps.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, AfterViewInit {
  map: any;
  route: any = null;
  routingControl: any;
  drawerMode: any;
  latitude: any = 11.9861833;
  longitude: any = 108.4376802;
  thanhSoList = <any>[]
  organizations = <any>[]
  loading: boolean = false
  editting: boolean = false
  viewContainerRef = inject(ViewContainerRef)
  selectedMap = <any>{}
  setting = <any>{}
  addingItem = <any>{}
  edittingItem = <any>{}
  user = <any>{}
  googleFormsPath = ''
  editGoogleFormsPath = ''
  editingGoogleFormsPath = ''

  @ViewChild('infoDrawer') infoDrawer!: any
  @ViewChild('inforBottomSheet') inforBottomSheet!: any
  inforBottomSheetRef: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private matBottomSheet: MatBottomSheet,
    private mapsService: MapsService,
    private commonService: CommonService,
    private authService: AuthService
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
    this.user = this.authService.getCurrentUser()
  }

  ngAfterViewInit(): void {
    this.fetchMaps();
  }

  fetchMaps() {
    this.loading = true
    if (this.mapsService.maps?.thanhSo?.length > 0) {
      this.loading = false
      this.thanhSoList = this.mapsService.maps.thanhSo
      this.setting = this.mapsService.maps.setting
      this.organizations = this.mapsService.maps.organizations
      if (this.user) {
        this.user.editable = this.setting?.permission?.includes(this.user?.userName)
      }
      this.initMap()
    } else {
      this.mapsService.fetchMaps().subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this.setting = res.setting
            this.thanhSoList = res.thanhSo
            this.organizations = res.organizations
            if (this.user) {
              this.user.editable = this.setting?.permission?.includes(this.user?.userName)
            }
            this.initMap()
          } else {

          }
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
        complete: () => {
          console.info('complete')
        },
      })
    }
  }

  initMap() {
    this.map = null;
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
      this.calculateDistance()
    }
    const getPosition = {
      enableHighAccuracy: true,
      timeout: 9000,
      maximumAge: 0
    }
    const success = (gotPosition: any) => {
      this.latitude = gotPosition.coords.latitude;
      this.longitude = gotPosition.coords.longitude;
      if (this.latitude && this.longitude) {
        this.map.flyTo(new L.LatLng(this.latitude, this.longitude), 13, {
          duration: 1,
          easeLinearity: 0.5
        });
      }
    }
    if (this.latitude && this.longitude) {
      initMap()
    }
    const error = (err: any) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };
    navigator.geolocation.getCurrentPosition(success, error, getPosition)
  }

  calculateDistance(item?: any) {
    let currentLocation = L.latLng(this.latitude, this.longitude)
    if (item?.latLng[0] && item?.latLng[1]) {
      currentLocation = L.latLng(item?.latLng[0], item?.latLng[1])
    }
    this.thanhSoList?.forEach((tanhSo: any) => {
      const thanhSoLatLng = L.latLng(tanhSo.latLng[0], tanhSo.latLng[1])
      tanhSo.distance = currentLocation.distanceTo(thanhSoLatLng)
    })
  }

  loadMarkers() {
    const caodaiONMarker = L.marker([this.latitude, this.longitude], { icon: this.getThanhSoIcon('caodaion') })
    caodaiONMarker.bindPopup(`<a href="${location.origin}">${location.origin}</a>`)
    caodaiONMarker.addTo(this.map);
    this.thanhSoList?.forEach((item: any) => {
      this.loadThanhSoMarker(item);
    })
  }

  getThanhSoIcon(item: any): any {
    if (item === 'caodaion') {
      const caoDaiONIcon = L.divIcon({
        // iconUrl: '/assets/icons/assets/caodaion-pin.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        className: 'caodaion relative',
        html: `<img src="/assets/icons/assets/caodaion-pin.svg"/>
        <span class="absolute left-1/2 translate-x-[-50%]">CaoDaiON</span>`
      })
      return caoDaiONIcon
    }
    if (item?.caodaion) {
      const thanhSoCaoDaiONIcon = L.divIcon({
        // iconUrl: '/assets/icons/assets/thanhSoCaoDaiON.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        className: 'caodaion relative',
        html: `<img class="w-[32px] h-[32px]" src="/assets/icons/assets/thanhSoCaoDaiON.png"/>
        <span class="absolute left-1/2 translate-x-[-50%] w-max">${item?.name}</span>`
      })
      return thanhSoCaoDaiONIcon
    }
    const thanhSoIcon = L.divIcon({
      // iconUrl: '/assets/icons/assets/thanhSo.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      className: 'caodaion relative',
      html: `<img class="w-[32px] h-[32px]" src="/assets/icons/assets/thanhSo.png"/>
      <span class="absolute left-1/2 translate-x-[-50%] w-max">${item?.name}</span>`
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
      this.infoDrawer.open();
      this.selectItem(item)
    })
  }

  selectItem(item?: any) {
    if (item) {
      this.selectedMap = item
      if (this.drawerMode == 'over') {
        this.infoDrawer.close();
      }
      this.map.flyTo(item?.latLng, 13, {
        duration: 1,
        easeLinearity: 0.5
      })
      this.inforBottomSheetRef = this.matBottomSheet.open(this.inforBottomSheet)
      if (this.user?.editable) {
        this.edittingItem = item
        this.edittingItem.organization = [this.edittingItem.organization]
      }
    } else {
      this.selectedMap = <any>{}
      this.inforBottomSheetRef?.dismiss()
    }
  }

  updateItem() {
    this.edittingItem.key = this.commonService.generatedSlug(this.edittingItem.name)
    if (this.edittingItem.latLng?.includes('http')) {
      const decode = decodeURIComponent(this.edittingItem.latLng)
      const latLng: any = decode.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
      if (latLng[0] && latLng[1] && latLng[2]) {
        this.edittingItem.latLng = latLng[0]?.replace('@', '')
      }
    }
    const editOrganizationKey = () => {
      let newKey = '-'
      this.commonService.generatedSlug(this.edittingItem?.organization[0])?.split('-')?.forEach((v: any) => {
        if (v?.length > 1) {
          newKey += `${v[0]}${v[v?.length - 1]}`
        } else {
          newKey += v
        }
      })
      return newKey
    }
    if (this.edittingItem?.organization?.length > 1) {
      this.edittingItem?.organization?.shift();
    }
    if (this.edittingItem?.organization && this.edittingItem?.organization[0]) {
      this.edittingItem.key += editOrganizationKey()
    }
  }

  onPress(event: any): any {
    if (event?.keyCode == 32) {
      event['target']['value'] = event['target']['value'] + ' '
    }
  }

  onSave(isClear: boolean = false) {
    if (isClear) {
      this.googleFormsPath = ''
    } else {
      if (this.edittingItem.key && this.edittingItem.name && this.edittingItem.latLng) {
        this.googleFormsPath = `https://docs.google.com/forms/d/e/${this.setting?.googleFormsId}/viewform`
        this.googleFormsPath += `?${this.setting?.key}=${encodeURIComponent(this.edittingItem.key)}`
        this.googleFormsPath += `&${this.setting?.name}=${encodeURIComponent(this.edittingItem.name)}`
        if (this.edittingItem.address) {
          this.googleFormsPath += `&${this.setting?.address}=${encodeURIComponent(this.edittingItem.address)}`
        }
        if (this.edittingItem.latLng) {
          this.googleFormsPath += `&${this.setting?.latLng}=${encodeURIComponent(this.edittingItem.latLng)}`
        }
        if (this.edittingItem.organization) {
          this.googleFormsPath += `&${this.setting?.organization}=${encodeURIComponent(this.edittingItem.organization)}`
        }
        if (this.edittingItem.caodaion) {
          this.googleFormsPath += `&${this.setting?.caodaion}=${encodeURIComponent(this.edittingItem.caodaion)}`
        }
        if (this.edittingItem.phone) {
          this.googleFormsPath += `&${this.setting?.phone}=${encodeURIComponent(this.edittingItem.phone)}`
        }
      }
    }
  }

  addEditNewMapToken(isClear: boolean = false, editFormTokenEx: any) {
    const editKey = () => {
      let newKey = ''
      this.edittingItem.key?.split('-')?.forEach((v: any) => {
        if (v?.length > 1) {
          newKey += `${v[0]}${v[v?.length - 1]}`
        } else {
          newKey += v
        }
        newKey += '-'
      })
      newKey += this.edittingItem.editToken?.match(/edit[0-9]/)
      return newKey
    }
    const editToken = () => {
      return this.edittingItem.editToken?.split(this.edittingItem.editToken?.match(/edit[0-9][=]/))[1]
    }
    if (isClear) {
      this.editGoogleFormsPath = ''
      editFormTokenEx.expanded = false
    } else {
      if (this.edittingItem.key && this.edittingItem.editToken) {
        this.editGoogleFormsPath = `https://docs.google.com/forms/d/e/${this.setting?.googleFormsId}/viewform`
        this.editGoogleFormsPath += `?${this.setting?.key}=${encodeURIComponent(editKey())}`
        this.editGoogleFormsPath += `&${this.setting?.name}=${encodeURIComponent(editToken())}`
      }
    }
  }

  addDirection(params: any) {
    if (this.drawerMode == 'over') {
      this.infoDrawer?.close();
    }
    const getWaypointObject = (object?: any): any => {
      if (object) {
        return {
          latLng: new L.LatLng(object?.latLng[0], object?.latLng[1]),
          name: object?.name || ''
        }
      }
      return {
        latLng: new L.LatLng(this.latitude, this.longitude),
        name: 'Vị trí hiện tại'
      }
    }
    this.routingControl = L.Routing.control({
      waypoints: [
        getWaypointObject(params?.pointA),
        getWaypointObject(params?.pointB)
      ],
      routeWhileDragging: true,
      show: false,
      lineOptions: {
        styles: [
          {
            color: '#0f53ff',
            opacity: 0.6,
            weight: 9
          }
        ],
        extendToWaypoints: false,
        missingRouteTolerance: 10
      }
    })?.addTo(this.map);
    this.inforBottomSheetRef?.dismiss();
    this.routingControl.on('routeselected', (e: any) => {
      const route = e.route;
      this.route = route
      if (route?.coordinates?.length > 0) {
        const routeBounds = this.calculateBounds(route?.coordinates);
        this.map.fitBounds(routeBounds);
        const baseUrl = 'https://www.google.com/maps/dir/';
        const waypoints = [getWaypointObject(params?.pointA)?.latLng, getWaypointObject(params?.pointB)?.latLng]
        const coordinates = waypoints.map(waypoint => `${waypoint.lat},${waypoint.lng}`).join('/');
        this.route.googleMapsUrl = baseUrl + coordinates;
      }
    })
  }
  calculateBounds(coordinates: L.LatLngExpression[]): L.LatLngBounds {
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;
    coordinates.forEach((coord: any) => {
      const lat = coord?.lat;
      const lng = coord?.lng;
      if (!isNaN(lat) && !isNaN(lng)) {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      } else {
        console.error('Invalid coordinates:', lat, lng);
      }
    });
    const latPadding = Math.abs(maxLat - minLat) * 0.05;
    const lngPadding = Math.abs(maxLng - minLng) * 0.05;
    const southWest = L.latLng(minLat - latPadding, minLng - lngPadding);
    const northEast = L.latLng(maxLat + latPadding, maxLng + lngPadding);
    return L.latLngBounds(southWest, northEast);
  }

  removeWayRouting() {
    this.map?.removeControl(this.routingControl)
    this.route = null
  }

  patToItem(item: any) {
    this.map?.flyTo(item.latLng, 13, {
      duration: 1,
      easeLinearity: 0.5
    })
  }

  viewInstruction(item: any) {
    const foundPoint = this.route?.coordinates[item?.index]
    if (foundPoint?.lat && foundPoint?.lng) {
      this.map?.flyTo([foundPoint?.lat, foundPoint?.lng], 15, {
        duration: 1,
        easeLinearity: 0.5
      })
    }
  }

  onSaveEditting(isClear: boolean = false) {
    if (isClear) {
      this.editingGoogleFormsPath = ''
    } else {
      if (this.edittingItem.key && this.edittingItem.name && this.edittingItem.latLng && this.edittingItem.editToken) {
        this.editingGoogleFormsPath = `https://docs.google.com/forms/d/e/${this.setting?.googleFormsId}/viewform`
        this.editingGoogleFormsPath += `${this.edittingItem.editToken}`
        this.editingGoogleFormsPath += `&${this.setting?.key}=${encodeURIComponent(this.edittingItem.key)}`
        this.editingGoogleFormsPath += `&${this.setting?.name}=${encodeURIComponent(this.edittingItem.name)}`
        if (this.edittingItem.address) {
          this.editingGoogleFormsPath += `&${this.setting?.address}=${encodeURIComponent(this.edittingItem.address)}`
        }
        if (this.edittingItem.latLng) {
          this.editingGoogleFormsPath += `&${this.setting?.latLng}=${encodeURIComponent(this.edittingItem.latLng)}`
        }
        if (this.edittingItem.organization) {
          this.editingGoogleFormsPath += `&${this.setting?.organization}=${encodeURIComponent(this.edittingItem.organization)}`
        }
        if (this.edittingItem.caodaion) {
          this.editingGoogleFormsPath += `&${this.setting?.caodaion}=${encodeURIComponent(this.edittingItem.caodaion)}`
        }
        if (this.edittingItem.phone) {
          this.editingGoogleFormsPath += `&${this.setting?.phone}=${encodeURIComponent(this.edittingItem.phone)}`
        }
      }
    }
  }
}
