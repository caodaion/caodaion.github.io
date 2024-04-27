import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
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

  constructor(private locationService: LocationService, private commonService: CommonService) {

  }

  ngOnInit(): void {
    this.getDefaultLocation()
    this.getAllDivisions()
  }

  getAllDivisions() {
    if (this.commonService.provinces?.length === 0) {
    this.commonService.fetchProvinceData()
      .subscribe((res: any) => {
        if (res?.status == 200) {
          this.provinces = res.provinces
          this.districts = res.districts
          this.wards = res.wards
        }
      })
    } else {
      this.provinces = this.commonService.provinces
      this.districts = this.commonService.districts
      this.wards = this.commonService.wards
    }
  }

  getDefaultLocation() {
    this.defaultLocation = <any>{}
    this.defaultLocation = JSON.parse(localStorage.getItem('defaultLocation') || '{}')
  }

  updateDefaultLocation() {
    localStorage.setItem('defaultLocation', JSON.stringify(this.defaultLocation))
    this.getDefaultLocation()
  }

  onPress(event: any) {
    if (event?.keyCode == 32) {
      event['target']['value'] = event['target']['value'] + ' '
    }
  }
}
