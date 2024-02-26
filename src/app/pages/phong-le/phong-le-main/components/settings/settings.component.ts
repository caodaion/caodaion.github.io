import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/shared/services/location/location.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  provinces = <any>[];
  districts = <any>[];
  filteredDistricts = <any>[];
  wards = <any>[];
  filteredWards = <any>[];
  defaultLocation = <any>{}

  constructor(private locationService: LocationService) {

  }

  ngOnInit(): void {
    this.getDefaultLocation()
    // this.getAllDivisions()
    // this.getDistricts()
    // this.getWards()
  }

  getAllDivisions() {
    this.provinces = this.locationService.provinces
    try {
      this.locationService.getAllDivisions()
        .subscribe((res: any) => {
          if (res?.length > 0) {
            this.provinces = res
            this.locationService.provinces = res
          }
        })
    } catch (e) {
      console.log(e);
    }
  }

  getDistricts() {
    this.districts = this.locationService.districts
    if (!this.districts || this.districts?.length === 0) {
      try {
        this.locationService.getDistricts()
          .subscribe((res: any) => {
            if (res?.length > 0) {
              this.districts = res
              this.locationService.districts = res
              this.filteredDistricts = res?.filter((item: any) => item.province_code === this.defaultLocation?.province)
            }
          })
      } catch (e) {
        console.log(e);
      }
    } else {
      const data = this.districts?.filter((item: any) => item.province_code === this.defaultLocation?.province)
      this.filteredDistricts = data?.length > 0 ? data : this.districts
    }
  }

  getWards() {
    this.wards = this.locationService.wards
    if (!this.wards || this.wards?.length === 0) {
      try {
        this.locationService.getWards()
          .subscribe((res: any) => {
            if (res?.length > 0) {
              this.wards = res
              this.locationService.wards = res
              this.filteredWards = res?.filter((item: any) => item.district_code === this.defaultLocation?.district)
            }
          })
      } catch (e) {
        console.log(e);
      }
    } else {
      const data = this.wards?.filter((item: any) => item.district_code === this.defaultLocation?.district)
      this.filteredWards = data?.length > 0 ? data : this.wards
    }
  }

  getDefaultLocation() {
    this.defaultLocation = <any>{}
    this.defaultLocation = JSON.parse(localStorage.getItem('defaultLocation') || '{}')
    this.getDistricts()
    this.getWards()
  }

  updateDefaultLocation() {
    localStorage.setItem('defaultLocation', JSON.stringify(this.defaultLocation))
    this.getDefaultLocation()
  }
}
